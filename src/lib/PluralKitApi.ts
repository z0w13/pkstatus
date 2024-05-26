/* eslint-disable @typescript-eslint/no-explicit-any */
import PKAPI, { APIData, APIError } from 'pkapi.js';
import dayjs from 'dayjs';

import PriorityQueue from 'src/lib/PriorityQueue';

interface RequestPath {
  method: string;
  route: string;
}
interface RequestOptions {
  token?: string;
  headers?: any;
  body?: any;
}
interface Request {
  priority: number;
  path: RequestPath;
  options?: RequestOptions;
  resolve: (value: PKApiResponse) => void;
  reject: (reason: any) => void;
}

type HandleReturn = ReturnType<PKAPI['handle']>;
type PKApiResponse = Awaited<HandleReturn>;

export default class PluralKitApi extends PKAPI {
  private promiseMap: Map<string, HandleReturn>;
  private requestQueue: PriorityQueue<Request>;
  private running: boolean;

  constructor(data?: APIData) {
    super(data);

    this.promiseMap = new Map<string, HandleReturn>();
    this.requestQueue = new PriorityQueue<Request>();
    this.running = false;
  }

  public async start(): Promise<void> {
    if (!this.running) {
      this.running = true;
      return this.loop();
    }
  }
  public stop() {
    this.running = false;
  }
  public async loop(): Promise<void> {
    while (this.running) {
      const item = await this.requestQueue.waitPop();

      try {
        const res = await super.handle(item.path, item.options);

        item.resolve(res);
        await this.handleRatelimitHeaders(res);
      } catch (e) {
        if (e instanceof APIError && e.status == '429') {
          this.requestQueue.push(item.priority, item);
          await this.handleRatelimitHeaders(e);
        } else {
          return item.reject(e);
        }
      }
    }
  }

  protected queueKey(method: string, route: string, token?: string): string {
    return token ? `${method} | ${route} | ${token}` : `${method} | ${route}`;
  }

  handle(path: RequestPath, options?: RequestOptions): HandleReturn {
    const key = this.queueKey(path.method, path.route);
    const priority = path.method.toLowerCase() == 'GET' ? 75 : 25;

    // Only deduplicate get requests
    if (path.method == 'GET' && this.promiseMap.has(key)) {
      // Don't create new responses if we're already waiting for one
      console.debug('Returning existing request with key:', key);
      return this.promiseMap.get(key)!;
    }

    const prom = new Promise<Awaited<HandleReturn>>((resolve, reject) =>
      this.requestQueue.push(priority, {
        priority,
        path,
        options,
        resolve,
        reject,
      }),
    );

    if (path.method == 'GET') {
      // Make sure to delete promise from cache when it resolves
      this.promiseMap.set(key, prom);
      prom.finally(() => this.promiseMap.delete(key));
    }
    return prom;
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
      const type = res instanceof APIError ? 'triggered' : 'hit';
      console.info(`Rate limit ${type}, waiting for ${resetSeconds} seconds`);
      await new Promise((resolve) => setTimeout(resolve, resetSeconds * 1_000));
    }
  }
}
