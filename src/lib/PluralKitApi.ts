/* eslint-disable @typescript-eslint/no-explicit-any */
import PKAPI, { APIData, APIError } from 'pkapi.js';
import Bottleneck from 'bottleneck';

type HandleReturn = ReturnType<PKAPI['handle']>;

export default class PluralKitApi extends PKAPI {
  private limiter: Bottleneck;
  private requestQueues: Map<string, HandleReturn>;

  constructor(data?: APIData) {
    super(data);

    this.limiter = new Bottleneck({
      minTime: 1000,
      maxConcurrent: 1,
    });

    this.requestQueues = new Map<string, HandleReturn>();
  }

  protected queueKey(method: string, route: string, token?: string): string {
    return token ? `${method} | ${route} | ${token}` : `${method} | ${route}`;
  }

  async handle(
    path: { method: string; route: string },
    options?: {
      token?: string;
      headers?: any;
      body?: any;
    },
  ): ReturnType<PKAPI['handle']> {
    const key = this.queueKey(path.method, path.route, options?.token);

    // Only deduplicate get requests
    if (path.method == 'GET') {
      // Don't create new responses if we're already waiting for one
      const promise = this.requestQueues.get(key);
      if (promise) {
        return promise;
      }
    }

    const prom = new Promise<Awaited<HandleReturn>>(async (resolve, reject) => {
      while (true) {
        try {
          await this.limiter.schedule(async () => {
            resolve(await super.handle(path, options));
          });

          // API didn't throw an error, so promise is resolved, remove it
          break;
        } catch (e) {
          // 429 Too Many Requests
          if (e instanceof APIError && e.status == '429') {
            console.log('Too many requests, retrying...');
          } else {
            // Not an expected error reject the promise
            return reject(e);
          }
        }
      }
    });

    if (path.method == 'GET') {
      // Make sure to delete promise from cache when it resolves
      this.requestQueues.set(key, prom);
      prom.finally(() => this.requestQueues.delete(key));
    }
    return prom;
  }
}
