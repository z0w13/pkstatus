import { reactive } from 'vue';
import dayjs from 'dayjs';
import { z } from 'zod';

import { notEmpty } from 'src/util';
import PluralKitApi from 'src/lib/PluralKitApi';
import { EventBus } from 'quasar';

interface HasId {
  id: string;
}

export const SerializedCacheInfo = z.object({
  ttl: z.number(),
  createdAt: z.string().datetime(),
});
export type SerializedCacheInfo = z.infer<typeof SerializedCacheInfo>;

export class CacheInfo {
  constructor(
    public ttl: number,
    public createdAt: dayjs.Dayjs = dayjs(),
  ) {}

  public expired(ttl?: number): boolean {
    return dayjs().diff(this.createdAt, 'seconds') > (ttl ?? this.ttl);
  }

  public toStorage(): SerializedCacheInfo {
    return {
      ...this,
      createdAt: this.createdAt.toJSON(),
    };
  }

  static fromStorage(serialized: SerializedCacheInfo): CacheInfo {
    return new CacheInfo(serialized.ttl, dayjs(serialized.createdAt));
  }
}

export default abstract class BaseCache<T extends HasId> extends EventBus<{
  change: (item: T) => void;
}> {
  public objects: Record<string, T>;
  public cacheInfo: Record<string, CacheInfo>;

  constructor(
    protected pk: PluralKitApi,
    public ttl: number = 300,
  ) {
    super();

    this.objects = reactive(Object.create(null));
    this.cacheInfo = Object.create(null);
  }

  public setTtl(ttl: number) {
    this.ttl = ttl;
    Object.values(this.cacheInfo).forEach((cd) => (cd.ttl = ttl));
  }

  public has(id: string): boolean {
    return !!this.objects[id];
  }

  public set(object: T): T {
    this.objects[object.id] = object;
    this.cacheInfo[object.id] = new CacheInfo(this.ttl);

    this.emit('change', object);
    return object;
  }

  public getExpired(ttl?: number, sorted = false): Array<T> {
    const objects = Object.values(this.objects).filter((obj) =>
      this.expired(obj, ttl),
    );

    if (!sorted) {
      return objects;
    }

    return objects.sort(
      (a, b) =>
        this.cacheInfo[a.id].createdAt.valueOf() -
        this.cacheInfo[b.id].createdAt.valueOf(),
    );
  }

  public expired(obj: string | T, ttl?: number): boolean {
    const id = typeof obj === 'string' ? obj : obj.id;

    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo) {
      return true;
    }

    return cacheInfo.expired(ttl);
  }

  // Get cached object or fetch new one when missing or expired
  public async get(id: string, token?: string): Promise<T> {
    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo || cacheInfo.expired()) {
      return await this.fetch(id, token);
    }

    const obj = this.objects[id];
    if (!obj) {
      throw new Error(`Object for key ${id} undefined, shouldn't happen!`);
    }
    return obj;
  }

  public async getMulti(ids: Array<string>, token?: string): Promise<Array<T>> {
    return await Promise.all(ids.map((id) => this.get(id, token)));
  }

  public setCached(info: CacheInfo, object: T) {
    this.cacheInfo[object.id] = info;
    this.objects[object.id] = object;

    this.emit('change', object);
  }

  public getCached(id: string): T | undefined {
    return this.objects[id];
  }

  public getMultiCached(ids: Array<string>): Array<T> {
    return ids.map((id) => this.objects[id]).filter(notEmpty);
  }

  public async fetch(id: string, token?: string): Promise<T> {
    return this.set(await this.refresh(id, token));
  }

  public async getCacheObject(id: string): Promise<CacheInfo> {
    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo || cacheInfo.expired()) {
      await this.fetch(id);
    }

    const res = this.cacheInfo[id];
    if (!res) {
      throw new Error(`THIS SHOULDN'T HAPPEN, No CacheInfo for ${id}`);
    }
    return res;
  }

  public persist(
    filterFunc: (val: T) => boolean,
  ): Array<{ info: CacheInfo; obj: T }> {
    return Object.values(this.objects)
      .filter(filterFunc)
      .map((obj) => ({
        info: this.cacheInfo[obj.id],
        obj: obj,
      }));
  }

  protected abstract refresh(id: string, token?: string): Promise<T>;
}
