import { AxiosHeaders, AxiosResponse } from 'axios';

import { vi, describe, expect, it } from 'vitest';

import RateLimiter from 'src/lib/RateLimiter';

export function createAxiosError(
  status = 429,
  responseOptions: Partial<AxiosResponse> = {},
) {
  return {
    isAxiosError: true,
    code: status,
    response: createResponse({
      status,
      headers: {},
      data: '',
      statusText: '',
      config: {
        headers: new AxiosHeaders(),
      },
      ...responseOptions,
    }),
  };
}

export function createResponse(
  options: Partial<AxiosResponse> = {},
): AxiosResponse {
  return {
    status: 200,
    headers: {},
    statusText: 'OK',
    data: '',
    config: {
      headers: new AxiosHeaders(),
    },
    ...options,
  };
}

class TestRateLimiter extends RateLimiter {
  public setErrorTimestamps(timestamps: Array<number>) {
    this.errorTimestamps = timestamps;
  }

  public triggerError() {
    return this.handleError(createAxiosError());
  }

  public getWaitTime() {
    return this.waitTime;
  }

  public getResetTimestamp() {
    return this.resetTimestamp;
  }
}

describe('DefaultRateLimiter', function () {
  describe('waitTime', function () {
    it('increases the wait time if we exceed the max error threshold', function () {
      const limiter = new TestRateLimiter();

      limiter.triggerError();
      limiter.triggerError();
      limiter.triggerError();

      expect(limiter.getWaitTime()).toBe(1500);
    });
    it('decreases the wait time if we drop below the min threshold', function () {
      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 2000,
      });

      limiter.setErrorTimestamps([0, 1, 2]);
      limiter.handleResponse(createResponse());

      expect(limiter.getWaitTime()).toBe(1500);
    });
    it('does not exceed maxWait', function () {
      const limiter = new TestRateLimiter({
        maxWait: 3000,
        initialWaitTime: 2000,
        increment: 500,
      });

      limiter.triggerError();
      limiter.triggerError();
      limiter.triggerError();
      limiter.triggerError();
      limiter.triggerError();

      expect(limiter.getWaitTime()).toBe(3000);
    });
    it('does not go below minWait', function () {
      const limiter = new TestRateLimiter({
        minWait: 1000,
        initialWaitTime: 2000,
        increment: 500,
      });

      limiter.handleResponse(createResponse());
      limiter.handleResponse(createResponse());
      limiter.handleResponse(createResponse());

      expect(limiter.getWaitTime()).toBe(1000);
    });
  });
  describe('wait', function () {
    it("waits if there's no remaining requests", async function () {
      vi.useFakeTimers();

      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 1000,
      });
      // trigger the ratelimiter by setting remaining requests to 0
      limiter.handleResponse(
        createResponse({
          headers: { 'x-ratelimit-remaining': '0' },
        }),
      );

      await expect(limiter.wait()).toResolveAfterAtLeast(1000);
    });
    it('waits if a rate limit error was triggered', async function () {
      vi.useFakeTimers();

      const limiter = new TestRateLimiter({ initialWaitTime: 1000 });
      // trigger an error to ratelimit the next request
      limiter.triggerError();

      await expect(limiter.wait()).toResolveAfterAtLeast(1000);
    });
    it("immediately returns if there's no ratelimiting", async function () {
      vi.useFakeTimers();
      const limiter = new TestRateLimiter({ initialWaitTime: 1000 });
      await expect(limiter.wait()).toResolveAfterAtLeast(0);
    });
    it('respects x-ratelimit-reset headers from API responses', async function () {
      vi.useFakeTimers();

      const limiter = new TestRateLimiter();
      limiter.handleResponse(
        createResponse({
          headers: {
            'x-ratelimit-remaining': 0,
            'x-ratelimit-reset': Math.ceil(Date.now() / 1000) + 60,
          },
        }),
      );

      await expect(limiter.wait()).toResolveAfterAtLeast(60000);
    });
    it('respects x-ratelimit-reset headers from API errors', async function () {
      vi.useFakeTimers();

      const limiter = new TestRateLimiter();
      limiter.handleError(
        createAxiosError(429, {
          headers: {
            'x-ratelimit-remaining': 0,
            'x-ratelimit-reset': Math.ceil(Date.now() / 1000) + 60,
          },
        }),
      );

      await expect(limiter.wait()).toResolveAfterAtLeast(60000);
    });
  });
  describe('handleError', function () {
    it('returns true on errors related to ratelimiting', function () {
      const limiter = new TestRateLimiter();
      expect(limiter.handleError(createAxiosError())).toBe(true);
    });
    it('returns false on errors unrelated to ratelimiting', function () {
      const limiter = new TestRateLimiter();
      expect(limiter.handleError('unrelated')).toBe(false);
    });
    it('respects the x-ratelimit-remaining header in API responses', async function () {
      vi.useFakeTimers();

      const limiter = new TestRateLimiter({
        errorWindowBase: 5000,
        initialWaitTime: 1000,
      });
      // trigger the ratelimiter by setting remaining requests to 0
      limiter.handleError(
        createAxiosError(404, {
          headers: { 'x-ratelimit-remaining': '0' },
        }),
      );

      await expect(limiter.wait()).toResolveAfterAtLeast(1000);
    });
  });
});
