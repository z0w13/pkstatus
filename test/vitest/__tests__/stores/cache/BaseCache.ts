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
