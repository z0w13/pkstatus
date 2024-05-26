import dayjs from 'dayjs';
import { APIError } from 'pkapi.js';

interface RateLimitableItem {
  status?: string | number;
  headers?: unknown;
}

export default class RateLimiter {
  constructor(
    // Array of timestamps when we triggered a 429
    protected errorTimestamps: Array<number> = [],
    // Base window to use for increasing/decreasing the wait time
    private errorWindowBase = 5000,
    // Time we wait when we hit the ratelimit (error or no remaining)
    private waitTime = 1,
    // Lowest our wait time can go
    private minWait = 1,
    // Highest the wait time can go
    private maxWait = 3,
    // How much to change the wait time by when increase/decrease thresholds are hit
    private increment = 0.5,
    // Min amount of errors in the last (errorWindowBase * waitTime) ms to increase wait time
    private increaseThreshold = 3,
    // Max amount of errors in the last (errorWindowBase * waitTime) ms to allow decreasing wait time
    private decreaseThreshold = 0,
  ) {}

  public getWaitTime() {
    return this.waitTime;
  }

  private adjustWaitTime() {
    const curTime = dayjs().valueOf();
    this.errorTimestamps = this.errorTimestamps.filter(
      (v) => v > curTime - this.errorWindowBase * this.minWait,
    );

    // If we hit the rate limit more than 3 times in the last 5 seconds we increase the delay
    if (this.errorTimestamps.length >= this.increaseThreshold) {
      this.waitTime = Math.min(this.waitTime + this.increment, this.maxWait);
      console.debug(
        `ratelimit: error threshold exceeded, increased wait time to ${this.waitTime}s`,
      );
    } else if (
      this.errorTimestamps.length <= this.decreaseThreshold &&
      this.waitTime !== this.minWait
    ) {
      console.debug(
        `ratelimit: error threshold reset, decreased wait time to ${this.waitTime}s`,
      );
      this.waitTime = Math.max(this.waitTime - this.increment, this.minWait);
    }
  }

  private handleError() {
    this.errorTimestamps.push(dayjs().valueOf());
  }

  private isRateLimitError(res: RateLimitableItem) {
    // res.status is string or number but coercion means either works
    return res instanceof APIError && res.status == '429';
  }

  private async waitForRateLimit(resetSeconds: number) {
    await new Promise((resolve) => setTimeout(resolve, resetSeconds * 1000));
  }

  private parseHeaders(headers: unknown): {
    limit?: number;
    remaining?: number;
    reset?: number;
  } | null {
    if (!headers) {
      return null;
    }

    if (typeof headers != 'object') {
      return null;
    }

    const parsed: { limit?: number; remaining?: number; reset?: number } = {};

    if ('x-ratelimit-limit' in headers) {
      if (typeof headers['x-ratelimit-limit'] == 'string') {
        const limit = parseInt(headers['x-ratelimit-limit']);
        if (!isNaN(limit)) {
          parsed.limit = limit;
        }
      } else if (typeof headers['x-ratelimit-limit'] == 'number') {
        parsed.limit = headers['x-ratelimit-limit'];
      }
    }

    if ('x-ratelimit-remaining' in headers) {
      if (typeof headers['x-ratelimit-remaining'] == 'string') {
        const limit = parseInt(headers['x-ratelimit-remaining']);
        if (!isNaN(limit)) {
          parsed.remaining = limit;
        }
      } else if (typeof headers['x-ratelimit-remaining'] == 'number') {
        parsed.remaining = headers['x-ratelimit-remaining'];
      }
    }

    if ('x-ratelimit-reset' in headers) {
      if (typeof headers['x-ratelimit-reset'] == 'string') {
        const limit = parseInt(headers['x-ratelimit-reset']);
        if (!isNaN(limit)) {
          parsed.remaining = limit;
        }
      } else if (typeof headers['x-ratelimit-reset'] == 'number') {
        parsed.remaining = headers['x-ratelimit-reset'];
      }
    }

    return parsed;
  }

  public async handleHeaders(res: RateLimitableItem) {
    if (this.isRateLimitError(res)) {
      this.handleError();
    }

    // Handle incremental backoff when ratelimited
    this.adjustWaitTime();

    const headers = this.parseHeaders(res.headers);
    const resetSeconds = headers?.reset
      ? Math.max(headers.reset - dayjs().unix(), this.waitTime)
      : this.waitTime;

    if (
      (headers?.remaining !== undefined && headers.remaining < 1) ||
      this.isRateLimitError(res)
    ) {
      const type = this.isRateLimitError(res) ? 'triggered' : 'hit';
      console.debug(`ratelimit: ${type}, waiting for ${resetSeconds} seconds`);
      await this.waitForRateLimit(resetSeconds);
    }
  }
}
