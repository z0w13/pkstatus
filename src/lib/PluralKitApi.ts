/* eslint-disable @typescript-eslint/no-explicit-any */
import PKAPI, { APIData, APIError } from 'pkapi.js';

import PriorityQueue from 'src/lib/PriorityQueue';
import RateLimiter from 'src/lib/RateLimiter';

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
  private limiter: RateLimiter;

  constructor(data?: APIData) {
    super(data);

    this.promiseMap = new Map<string, HandleReturn>();
    this.requestQueue = new PriorityQueue<Request>();
    this.running = false;
    this.limiter = new RateLimiter();
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
        await this.limiter.handleHeaders(res);
      } catch (e) {
        if (e instanceof APIError && e.status == '429') {
          this.requestQueue.push(item.priority, item);
          await this.limiter.handleHeaders(e);
        } else {
          item.reject(e);
        }
      }
    }
  }

  protected queueKey(method: string, route: string, token?: string): string {
    return token ? `${method} | ${route} | ${token}` : `${method} | ${route}`;
  }

  handle(path: RequestPath, options?: RequestOptions): HandleReturn {
    const key = this.queueKey(path.method, path.route);
    const priority = path.method.toUpperCase() == 'GET' ? 75 : 25;

    if (this.promiseMap.has(key)) {
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
    ).finally(() => {
      if (path.method == 'GET') {
        console.debug('deleting promise key', { key });
        this.promiseMap.delete(key);
      }
    });

    // Only deduplicate GET requests
    if (path.method == 'GET') {
      console.debug('setting promise key', { key });
      this.promiseMap.set(key, prom);
    }

    return prom;
  }
}
