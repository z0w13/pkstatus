import dayjs from 'dayjs';
import PluralKitApi from 'src/lib/PluralKitApi';
import BaseCache from 'src/stores/cache/BaseCache';
import { describe, expect, it } from 'vitest';

class TestCacheObject {
  constructor(public id: string) {}
}

class TestCache extends BaseCache<TestCacheObject> {
  protected async refresh(
    id: string,
    _token?: string,
  ): Promise<TestCacheObject> {
    return new TestCacheObject(id);
  }

  public async setWithCustomCacheInfo(id: string, createdAt: dayjs.Dayjs) {
    await this.fetch(id);
    this.cacheInfo[id].createdAt = createdAt;
  }
}

function getCache() {
  const pk = new PluralKitApi();
  return new TestCache(pk);
}

describe('BaseCache::get', function () {
  it('stores the object in the cache after fetching', async function () {
    const cache = getCache();
    await cache.get('Foo');

    expect(cache.has('Foo')).toBe(true);
  });
});

describe('BaseCache::getCached', function () {
  it('returns the cached object', async function () {
    const cache = getCache();
    await cache.get('Foo');
    expect(cache.getCached('Foo')?.id).toBe('Foo');
  });
  it('returns undefined if the object is missing', async function () {
    const cache = getCache();
    expect(cache.getCached('Foo')).toBeUndefined();
  });
});

describe('BaseCache::getExpired', function () {
  it('returns by added first', async function () {
    const cache = getCache();

    await cache.setWithCustomCacheInfo('first', dayjs(5));
    await cache.setWithCustomCacheInfo('second', dayjs(4));

    expect(cache.getExpired(0, false)).toStrictEqual([
      new TestCacheObject('first'),
      new TestCacheObject('second'),
    ]);
  });
  it('returns sorted by oldest entry', async function () {
    const cache = getCache();

    await cache.setWithCustomCacheInfo('youngest', dayjs(5));
    await cache.setWithCustomCacheInfo('middle', dayjs(4));
    await cache.setWithCustomCacheInfo('oldest', dayjs(3));

    expect(cache.getExpired(0, true)).toStrictEqual([
      new TestCacheObject('oldest'),
      new TestCacheObject('middle'),
      new TestCacheObject('youngest'),
    ]);
  });
});
