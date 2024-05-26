/* eslint-disable @typescript-eslint/no-explicit-any */
import PKAPI, { APIData, APIError } from 'pkapi.js';
import dayjs from 'dayjs';

interface RequestPath {
  method: string;
  route: string;
}
interface RequestOptions {
  token?: string;
  headers?: any;
  body?: any;
  priority?: number;
}

type HandleReturn = ReturnType<PKAPI['handle']>;
type PKApiResponse = Awaited<HandleReturn>;

export default class PluralKitApi extends PKAPI {
  private requestQueues: Map<string, HandleReturn>;

  constructor(data?: APIData) {
    super(data);

    this.requestQueues = new Map<string, HandleReturn>();
  }

  protected queueKey(method: string, route: string, token?: string): string {
    return token ? `${method} | ${route} | ${token}` : `${method} | ${route}`;
  }

  handle(path: RequestPath, options?: RequestOptions): HandleReturn {
    // TODO: Look into prioritized queueing
    const key = this.queueKey(path.method, path.route);

    // Only deduplicate get requests
    if (path.method == 'GET' && this.requestQueues.has(key)) {
      // Don't create new responses if we're already waiting for one
      console.debug('Returning existing request with key:', key);
      return this.requestQueues.get(key)!;
    }

    const prom = new Promise<Awaited<HandleReturn>>((resolve, reject) =>
      this.innerHandle(resolve, reject, path, options),
    );

    if (path.method == 'GET') {
      // Make sure to delete promise from cache when it resolves
      this.requestQueues.set(key, prom);
      prom.finally(() => this.requestQueues.delete(key));
    }
    return prom;
  }

  private async innerHandle(
    resolve: (value: PKApiResponse) => void,
    reject: (reason: unknown) => void,
    path: RequestPath,
    options?: RequestOptions,
  ): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const res = await super.handle(path, options);
        await this.handleRatelimitHeaders(res);
        return resolve(res);
      } catch (e) {
        if (e instanceof APIError && e.status == '429') {
          // Hit the rate limit
          await this.handleRatelimitHeaders(e);
        } else {
          return reject(e);
        }
      }
    }
  }

  private async handleRatelimitHeaders(
    res: PKApiResponse | APIError,
  ): Promise<void> {
    // TODO: Extra backoff if hitting ratelimit multiple times

    // const limit = res.headers['x-ratelimit-limit'];
    const remaining = res.headers['x-ratelimit-remaining'];
    const reset = res.headers['x-ratelimit-reset'];
    const resetSeconds = Math.max(reset - dayjs().unix(), 1);

    if (remaining < 1) {
      console.info(`Rate limit reached, waiting for ${resetSeconds} seconds`);
      await new Promise((resolve) => setTimeout(resolve, resetSeconds * 1_000));
    }
  }
}
