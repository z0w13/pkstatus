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
      minTime: 500,
      maxConcurrent: 1,
    });

    this.requestQueues = new Map<string, HandleReturn>();
  }

  async handle(
    path: { method: string; route: string },
    options?: {
      token?: string;
      headers?: any;
      body?: any;
    },
  ): ReturnType<PKAPI['handle']> {
    // Don't create new responses if we're already waiting for one
    const key = JSON.stringify({ path, options });
    const promise = this.requestQueues.get(key);
    if (promise) {
      return promise;
    }

    const prom = new Promise<Awaited<HandleReturn>>(async (resolve, reject) => {
      while (true) {
        try {
          await this.limiter.schedule(async () => {
            resolve(await super.handle(path, options));
          });

          // API didn't throw an error, so promise is resolved, remove it
          this.requestQueues.delete(key);
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

    // Store the promise for the current request and return it
    this.requestQueues.set(key, prom);
    return prom;
  }
}
