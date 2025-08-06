import { reactive } from 'vue';
import dayjs from 'dayjs';
import { z } from 'zod';

import { EventBus } from 'quasar';
import { notEmpty } from 'src/util';

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
    console.debug('CacheInfo::expired', {
      ttl: ttl ?? this.ttl,
      diff: dayjs().diff(this.createdAt, 'seconds'),
      expired: dayjs().diff(this.createdAt, 'seconds') > (ttl ?? this.ttl),
    });
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

export default abstract class BaseCache<T extends HasId, I> extends EventBus<{
  change: (item: T) => void;
}> {
  public objects: Record<string, T>;
  public cacheInfo: Record<string, CacheInfo>;

  constructor(public ttl: number = 300) {
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

  protected abstract parse(input: I): T;

  public async getOrInsert(
    id: string,
    insertFn: (id: string) => Promise<I>,
    skipCache = false,
  ): Promise<T> {
    console.debug('getOrInsert', {
      class: this.constructor.name,
      id,
      has: this.has(id),
      skipCache,
    });

    if (skipCache) {
      return this.set(await insertFn(id));
    }

    return this.get(id) ?? this.set(await insertFn(id));
  }

  public setCached(info: CacheInfo, obj: T): T {
    this.cacheInfo[obj.id] = info;
    this.objects[obj.id] = obj;

    this.emit('change', obj);
    return obj;
  }

  public setDirect(obj: T): T {
    console.debug('setDirect', {
      class: this.constructor.name,
      id: obj.id,
    });

    this.objects[obj.id] = obj;
    this.cacheInfo[obj.id] = new CacheInfo(this.ttl);

    this.emit('change', obj);
    return obj;
  }

  public set(input: I): T {
    return this.setDirect(this.parse(input));
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
        // NOTE: we can safely use ! because `objects` and `cacheInfo` are always set together
        //       @see BaseCache#set
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

  public prune(id: string): T | undefined {
    console.debug('prune', {
      class: this.constructor.name,
      id,
      has: this.has(id),
    });

    if (this.has(id)) {
      // NOTE: access this.objects directly, so expired state gets bypassed
      const object = this.objects[id];

      delete this.objects[id];
      delete this.cacheInfo[id];

      return object;
    }
  }

  public get(id: string): T | undefined {
    console.debug('get', {
      class: this.constructor.name,
      id,
      has: this.has(id),
    });

    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo) {
      return;
    }

    if (cacheInfo.expired()) {
      delete this.objects[id];
      delete this.cacheInfo[id];

      return;
    }

    const obj = this.objects[id];
    if (!obj) {
      throw new Error(`Object for key ${id} undefined, shouldn't happen!`);
    }
    return obj;
  }

  public getMulti(ids: ReadonlyArray<string>): ReadonlyArray<T> {
    return ids.map((id) => this.get(id)).filter(notEmpty);
  }

  public getCacheObject(id: string): CacheInfo | undefined {
    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo || cacheInfo.expired()) {
      return;
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
        // NOTE: we can safely use ! because `objects` and `cacheInfo` are always set together
        //       @see BaseCache#set
        info: this.cacheInfo[obj.id],
        obj: obj,
      }));
  }
}
