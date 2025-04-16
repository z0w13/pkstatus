import { APIError } from 'pkapi.js';
import PluralKitApi from 'src/lib/PluralKitApi';
import RateLimiter from 'src/lib/RateLimiter';
import { describe, expect, it, vi } from 'vitest';

class TestRateLimiter extends RateLimiter {
  public setErrorTimestamps(timestamps: Array<number>) {
    this.errorTimestamps = timestamps;
  }

  public async triggerError() {
    return await this.handleHeaders(
      new APIError(new PluralKitApi(), {
        status: '429',
      }),
    );
  }
}

describe('RateLimiter', function () {
  it('increases the wait time if we exceed the max error threshold', function () {
    const limiter = new TestRateLimiter();

    limiter.triggerError();
    limiter.triggerError();
    limiter.triggerError();

    expect(limiter.getWaitTime()).toBe(1.5);
  });
  it('decreases the wait time if we drop below the min threshold', function () {
    const limiter = new TestRateLimiter([], 5000, 2);

    limiter.setErrorTimestamps([0, 1, 2]);
    limiter.handleHeaders({
      status: '200',
    });

    expect(limiter.getWaitTime()).toBe(1.5);
  });
  it("waits if there's no remaining requests", async function () {
    vi.useFakeTimers();

    const limiter = new TestRateLimiter([], 5000, 1);

    // set done to true after the wait time
    let done = false;
    const limiterPromise = limiter
      .handleHeaders({
        status: '200',
        headers: { 'x-ratelimit-remaining': '0' },
      })
      .then(() => (done = true));

    expect(done).toBe(false);
    vi.runAllTimers(); // run the timers
    await limiterPromise; // wait for the promise
    expect(done).toBe(true);
  });
  it('waits if a rate limit error was triggered', async function () {
    vi.useFakeTimers();

    const limiter = new TestRateLimiter([], 5000, 0.1, 0.1);

    // set done to true after the wait time
    let done = false;
    const limiterPromise = limiter.triggerError().then(() => (done = true));

    expect(done).toBe(false);
    vi.runAllTimers(); // run the timers
    await limiterPromise; // wait for the promise
    expect(done).toBe(true);
  });
});
