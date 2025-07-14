import axios, { Axios, isAxiosError, Method as AxiosMethod } from 'axios';
import dayjs from 'dayjs';
import { IGroup, IMember, ISwitch, ISystem } from 'pkapi.js';

import PriorityQueue from 'src/lib/PriorityQueue';
import RateLimiter from 'src/lib/RateLimiter';

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';
import { Group } from 'src/models/Group';
import { Fronters } from 'src/models/Fronters';

type Method = Uppercase<AxiosMethod>;

function requestKey(method: Method, path: string, data: unknown): string {
  return btoa(JSON.stringify({ method, path, data }));
}

interface RequestOptions {
  token: string | null | undefined;
  priority: number;
}

interface RequestData {
  method: Method;
  path: string;
  data: unknown;
  options: RequestOptions;
  key: string;
}

function newRequestData(
  method: Method,
  path: string,
  data: unknown,
  options: RequestOptions,
): RequestData {
  return {
    method,
    path,
    data,
    options,
    key: requestKey(method, path, data),
  };
}

class RequestPromise<T = unknown> {
  constructor(
    public request: RequestData,
    public promise: Promise<T>,
  ) {}
}

class PendingRequest<T = unknown> {
  constructor(
    public request: RequestData,
    public resolve: (value: T | PromiseLike<T>) => void,
    public reject: (reason?: unknown) => void,
  ) {}

  static fromRequestData<T>(
    request: RequestData,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
  ): PendingRequest<T> {
    return new PendingRequest<T>(request, resolve, reject);
  }
}

export default class ApiClient {
  protected axios: Axios;
  protected token: string | null;

  protected limiter: RateLimiter;

  protected concurrencyLimit: number;
  protected isProcessingRequests: boolean;
  protected requestsProcessing: Set<Promise<unknown>>;

  protected queue: PriorityQueue<PendingRequest>;
  protected pendingRequestMap: Map<string, PendingRequest>;

  protected getRequestMap: Map<string, RequestPromise>;

  public constructor({
    token,
    concurrencyLimit,
    axiosInstance,
  }: {
    token?: string | null;
    concurrencyLimit?: number;
    axiosInstance?: Axios;
  } = {}) {
    this.token = token ?? null;
    this.axios =
      axiosInstance ??
      axios.create({
        baseURL: 'https://api.pluralkit.me/v2/',
      });

    this.limiter = new RateLimiter();

    this.concurrencyLimit = concurrencyLimit ?? 50;
    this.isProcessingRequests = false;
    this.requestsProcessing = new Set();

    this.queue = new PriorityQueue<PendingRequest>();
    this.pendingRequestMap = new Map();

    this.getRequestMap = new Map();
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  protected async processQueue() {
    // if the queue is already processing return
    if (this.isProcessingRequests) {
      return;
    }

    this.isProcessingRequests = true;

    // queue main loop
    while (true) {
      console.debug('processQueue', {
        current: this.requestsProcessing.size,
        limit: this.concurrencyLimit,
      });

      // enforce concurrency limit
      while (this.requestsProcessing.size >= this.concurrencyLimit) {
        await Promise.race(this.requestsProcessing);
      }

      // wait for the rate limiter if needed
      await this.limiter.wait();

      const pending = this.queue.pop();
      if (!pending) {
        break;
      }

      // also remove from the pending request map
      this.pendingRequestMap.delete(pending.request.key);

      const prom = this.performRequest(pending);
      this.requestsProcessing.add(prom);
      prom.then(() => this.requestsProcessing.delete(prom));

      prom.then(pending.resolve);
      prom.catch(pending.reject);
    }

    this.isProcessingRequests = false;
  }

  protected async performRequest(pending: PendingRequest<unknown>) {
    const headers: { Authorization?: string } = {};
    if (pending.request.options.token !== undefined) {
      if (pending.request.options.token !== null) {
        headers.Authorization = pending.request.options.token;
      }
    } else if (this.token) {
      headers.Authorization = this.token;
    }

    try {
      const resp = await this.axios.request({
        method: pending.request.method,
        url: pending.request.path,
        data: pending.request.data,
        headers,
      });

      this.limiter.handleResponse(resp);
      return resp.data;
    } catch (e) {
      // handle ratelimiter errors
      if (isAxiosError(e) && e.status === 429) {
        this.limiter.handleError(e);
        this.queueRequest(pending.request);
      }

      // rethrow other errors
      throw e;
    }
  }

  protected deduplicateGetRequest<T>(request: RequestData): Promise<T> | null {
    if (request.method.toUpperCase() !== 'GET') {
      return null;
    }

    console.debug(
      'ApiClient::deduplicateGetRequest, fetching GET request with key:',
      request.key,
    );
    const existingProm = this.getRequestMap.get(request.key);
    if (existingProm) {
      // if priority is higher on new request bump existing request in queue up
      if (request.options.priority < existingProm.request.options.priority) {
        const pending = this.pendingRequestMap.get(request.key);
        if (!pending) {
          throw new Error(
            'internal data desynced, pending request exists in `getRequestMap but not in `pendingRequestMap`',
          );
        }

        this.queue.pushReplace(request.options.priority, pending);
      }
      return existingProm.promise as Promise<T>;
    }

    const prom = this.queueRequest<T>(request);
    console.debug(
      'ApiClient::deduplicateGetRequest, request stored with key:',
      request.key,
    );
    this.getRequestMap.set(request.key, prom);
    prom.promise.finally(() => this.getRequestMap.delete(request.key));

    return prom.promise;
  }

  protected queueRequest<T>(request: RequestData): RequestPromise<T> {
    const prom = new RequestPromise<T>(
      request,
      new Promise((resolve, reject) => {
        const pending = PendingRequest.fromRequestData<T>(
          request,
          resolve,
          reject,
        );

        this.pendingRequestMap.set(
          pending.request.key,
          pending as PendingRequest,
        );
        console.debug('ApiClient::queueRequest, queuing', {
          method: request.method,
          path: request.path,
        });
        this.queue.push(request.options.priority, pending as PendingRequest);
      }),
    );

    this.processQueue();
    return prom;
  }

  public async request<T>(
    method: Method,
    path: string,
    data: unknown = undefined,
    options: Partial<RequestOptions> = {},
  ): Promise<T> {
    console.debug('ApiClient::request', { method, path });
    const requestData = newRequestData(method, path, data, {
      token: options.token ?? undefined,
      priority: (options.priority ?? method === 'GET') ? 50 : 25,
    });

    const deduplicated = this.deduplicateGetRequest<T>(requestData);
    if (deduplicated) {
      return deduplicated;
    }

    return this.queueRequest<T>(requestData).promise;
  }

  // PluralKit API calls
  public async getSystem(
    id: string,
    options: Partial<RequestOptions> = {},
  ): Promise<System> {
    if (id === '@me' && !this.token && !options.token) {
      throw new Error("Can't get system '@me' without a token set");
    }

    return System.fromPKApi(
      await this.request<ISystem>('GET', `/systems/${id}`, undefined, options),
    );
  }

  public async getGroups(
    system: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Array<Group>> {
    return (
      await this.request<Array<IGroup>>(
        'GET',
        `/systems/${system}/groups`,
        undefined,
        options,
      )
    ).map((g) => Group.fromPKApi(g));
  }

  public async getGroup(
    id: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Group> {
    return Group.fromPKApi(
      await this.request<IGroup>('GET', `/groups/${id}`, undefined, options),
    );
  }

  public async getGroupMembers(
    id: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Array<Member>> {
    return (
      await this.request<Array<IMember>>(
        'GET',
        `/groups/${id}/members`,
        undefined,
        options,
      )
    ).map((m) => Member.fromPKApi(m));
  }

  public async getMembers(
    system: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Array<Member>> {
    return (
      await this.request<Array<IMember>>(
        'GET',
        `/systems/${system}/members`,
        undefined,
        options,
      )
    ).map((m) => Member.fromPKApi(m));
  }

  public async getMember(
    id: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Member> {
    return Member.fromPKApi(
      await this.request<IMember>('GET', `/members/${id}`, undefined, options),
    );
  }

  public async getFronters(
    system: string,
    options: Partial<RequestOptions> = {},
  ): Promise<Fronters> {
    try {
      const fronters = await this.request<
        ISwitch & { members: Array<IMember> }
      >('GET', `/systems/${system}/fronters`, undefined, options);

      // Fronters being undefined means a switch has never been registered
      if (!fronters) {
        return Fronters.empty(system);
      }

      // Convert members to PKStatus variant
      const members = fronters.members.map((m) => Member.fromPKApi(m));

      return new Fronters(system, true, dayjs(fronters.timestamp), members);
    } catch (e) {
      if (axios.isAxiosError(e) && e.code == '403') {
        return Fronters.private(system);
      }

      throw e;
    }
  }

  public async createSwitch(
    system: string,
    data: Partial<ISwitch>,
    options: Partial<RequestOptions> = {},
  ): Promise<Fronters> {
    const fronters = await this.request<ISwitch & { members: Array<IMember> }>(
      'POST',
      `/systems/${system}/switches`,
      data,
      options,
    );

    return new Fronters(
      system,
      true,
      dayjs(fronters.timestamp),
      (fronters.members ?? []).map((m) => Member.fromPKApi(m)),
    );
  }
}
