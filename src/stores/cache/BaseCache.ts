import { reactive } from 'vue';
import dayjs from 'dayjs';

import { notEmpty } from 'src/util';

interface HasId {
  id: string;
}

class CacheInfo {
  public readonly createdAt: dayjs.Dayjs;

  constructor(public ttl: number) {
    this.createdAt = dayjs();
  }

  public expired(): boolean {
    return dayjs().diff(this.createdAt, 'seconds') > this.ttl;
  }
}

export default abstract class BaseCache<T extends HasId> {
  public objects: Record<string, T>;
  public cacheInfo: Record<string, CacheInfo>;

  constructor(public ttl: number = 300) {
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

    return object;
  }

  public getExpired(): Array<T> {
    return Object.values(this.objects).filter((obj) => this.expired(obj));
  }

  public expired(obj: string | T): boolean {
    const id = typeof obj === 'string' ? obj : obj.id;

    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo) {
      return true;
    }

    return cacheInfo.expired();
  }

  // Get cached object or fetch new one when missing or expired
  public async get(id: string): Promise<T> {
    const cacheInfo = this.cacheInfo[id];
    if (!cacheInfo || cacheInfo.expired()) {
      return await this.fetch(id);
    }

    const obj = this.objects[id];
    if (!obj) {
      throw new Error(`Object for key ${id} undefined, shouldn't happen!`);
    }
    return obj;
  }

  public async getMulti(ids: Array<string>): Promise<Array<T>> {
    return await Promise.all(ids.map((id) => this.get(id)));
  }

  public getCached(id: string): T | undefined {
    return this.objects[id];
  }

  public getMultiCached(ids: Array<string>): Array<T> {
    return ids.map((id) => this.objects[id]).filter(notEmpty);
  }

  public async fetch(id: string): Promise<T> {
    return this.set(await this.refresh(id));
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

  protected abstract refresh(id: string): Promise<T>;
}
