import dayjs from 'dayjs';
import BaseCache from 'src/lib/PluralKit/cache/BaseCache';
import { describe, expect, it } from 'vitest';

class TestCacheObject {
  constructor(public id: string) {}
}

class TestCache extends BaseCache<TestCacheObject, string> {
  public parse(input: string): TestCacheObject {
    return new TestCacheObject(input);
  }

  public setWithCustomCacheInfo(input: string, createdAt: dayjs.Dayjs) {
    const obj = this.set(input);
    this.cacheInfo[obj.id].createdAt = createdAt;
  }
}

function getCache() {
  return new TestCache();
}

describe('BaseCache', function () {
  describe('get', function () {
    it('returns the cached object', function () {
      const cache = getCache();
      cache.setWithCustomCacheInfo('test', dayjs());

      expect(cache.get('test')?.id).toBe('test');
    });
    it('returns undefined if nothing is cached', function () {
      const cache = getCache();
      expect(cache.get('test')).toBeUndefined();
    });
  });

  describe('getExpired', function () {
    it('returns by added first', function () {
      const cache = getCache();

      cache.setWithCustomCacheInfo('first', dayjs(5));
      cache.setWithCustomCacheInfo('second', dayjs(4));

      expect(cache.getExpired(0, false)).toStrictEqual([
        new TestCacheObject('first'),
        new TestCacheObject('second'),
      ]);
    });

    it('returns sorted by oldest entry', function () {
      const cache = getCache();

      cache.setWithCustomCacheInfo('youngest', dayjs(5));
      cache.setWithCustomCacheInfo('middle', dayjs(4));
      cache.setWithCustomCacheInfo('oldest', dayjs(3));

      expect(cache.getExpired(0, true)).toStrictEqual([
        new TestCacheObject('oldest'),
        new TestCacheObject('middle'),
        new TestCacheObject('youngest'),
      ]);
    });
  });
});
