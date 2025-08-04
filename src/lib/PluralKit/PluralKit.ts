import { StrictTypedClient } from 'pkapi-ts';
import { APIError, HTTPError } from 'pkapi-ts/errors';

import SystemID, { SystemRef } from 'pkapi-ts/models/SystemID';
import MemberID from 'pkapi-ts/models/MemberID';
import GroupID from 'pkapi-ts/models/GroupID';

import FronterCache from 'src/lib/PluralKit/cache/FronterCache';
import SystemCache from 'src/lib/PluralKit/cache/SystemCache';
import SystemGroupCache from 'src/lib/PluralKit/cache/SystemGroupCache';
import SystemMemberCache from 'src/lib/PluralKit/cache/SystemMemberCache';
import GroupCache from 'src/lib/PluralKit/cache/GroupCache';
import MemberCache from 'src/lib/PluralKit/cache/MemberCache';
import GroupMemberCache from 'src/lib/PluralKit/cache/GroupMemberCache';

import { System } from 'src/models/System';
import { Group } from 'src/models/Group';
import { Member } from 'src/models/Member';
import { Fronters } from 'src/models/Fronters';
import dayjs from 'dayjs';

interface RequestOptions {
  priority?: number;
}
const DEFAULT_REQUEST_OPTIONS: Required<RequestOptions> = {
  priority: 25,
};

interface GetRequestOptions extends RequestOptions {
  skipCache?: boolean;
}
const DEFAULT_GET_REQUEST_OPTIONS: Required<GetRequestOptions> = {
  ...DEFAULT_REQUEST_OPTIONS,
  priority: 50,
  skipCache: false,
};

export default class PluralKit {
  protected client: StrictTypedClient;
  protected ownSystem: System | null;

  // caches
  public fronterCache: FronterCache;

  public systemCache: SystemCache;
  public systemGroupCache: SystemGroupCache;
  public systemMemberCache: SystemMemberCache;

  public memberCache: MemberCache;

  public groupCache: GroupCache;
  public groupMemberCache: GroupMemberCache;

  constructor(client?: StrictTypedClient) {
    this.client = client ?? new StrictTypedClient();

    this.ownSystem = null;

    this.groupCache = new GroupCache();
    this.memberCache = new MemberCache();
    this.groupMemberCache = new GroupMemberCache(this.memberCache);
    this.fronterCache = new FronterCache(this.memberCache);
    this.systemCache = new SystemCache();
    this.systemGroupCache = new SystemGroupCache(this.groupCache);
    this.systemMemberCache = new SystemMemberCache(this.memberCache);
  }

  public async setToken(token: string | null) {
    // no-op if token stayed the same
    if (token === this.client.getToken()) {
      return;
    }
    console.debug('clearing system', { token });

    // clear all caches of our data
    if (this.ownSystem) {
      this.pruneSystem(this.ownSystem.id);
    }

    // clear own system
    this.ownSystem = null;

    // assign new token
    this.client.setToken(token);

    if (!token) {
      return;
    }

    try {
      // fetch new system
      const newSystem = await this.getSystemByToken(token);

      // prune any data related to it from the cache
      this.pruneSystem(newSystem.id);

      // cache the new system and return it
      return this.systemCache.setDirect(newSystem);
    } catch (e) {
      // if we get a 401 then the API token was wrong, reset token and rethrow error
      if (e instanceof APIError && e.status == 401) {
        this.client.setToken(null);
      }

      throw e;
    }
  }

  protected pruneSystem(id: string) {
    // clear all caches of our data
    const system = this.systemCache.prune(id);
    if (!system) {
      return;
    }

    this.fronterCache.prune(system.id);

    const ownMembers = this.systemMemberCache.prune(system.id);
    if (ownMembers) {
      ownMembers.members.forEach((memberId) =>
        this.memberCache.prune(memberId),
      );
    }

    const ownGroups = this.systemGroupCache.prune(system.id);
    if (ownGroups) {
      ownGroups.groups.forEach((groupId) => {
        this.groupCache.prune(groupId);
        this.groupMemberCache.prune(groupId);
      });
    }
  }

  // api methods
  public async getSystemByToken(token: string, inOptions: RequestOptions = {}) {
    const options = this.mergeRequestOptions(inOptions);
    return System.fromPKApi(
      await this.client.getSystem(SystemRef.parse('@me'), {
        ...options,
        token,
      }),
    );
  }

  public async getSystem(id: string, inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);

    if (this.ownSystem?.id === id && !this.client.getToken()) {
      throw new Error(
        '`ApiClient::ownSystem` is populated but somehow `client.token` is empty, invalid state',
      );
    }

    return this.systemCache.getOrInsert(
      id,
      async (id) =>
        System.fromPKApi(await this.client.getSystem(SystemID.parse(id))),
      options.skipCache,
    );
  }

  public async getMembers(system: string, inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);

    const memberIds = (
      await this.systemMemberCache.getOrInsert(
        system,
        async (id) => ({
          system,
          members: (await this.client.getSystemMembers(SystemID.parse(id))).map(
            (m) => Member.fromPKApi(m),
          ),
        }),
        options.skipCache,
      )
    ).members;

    return this.memberCache.getMulti(memberIds);
  }

  public async getMember(id: string, inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);

    return this.memberCache.getOrInsert(
      id,
      async (id) =>
        Member.fromPKApi(await this.client.getMember(MemberID.parse(id))),
      options.skipCache,
    );
  }

  public async getGroup(
    id: string,
    inOptions: GetRequestOptions = {},
  ): Promise<Group> {
    const options = this.mergeGetRequestOptions(inOptions);

    return await this.groupCache.getOrInsert(
      id,
      async (id) =>
        Group.fromPKApi(await this.client.getGroup(GroupID.parse(id), true)),
      options.skipCache,
    );
  }

  public async getGroupMembers(
    id: string,
    inOptions: GetRequestOptions = {},
  ): Promise<ReadonlyArray<Member>> {
    const options = this.mergeGetRequestOptions(inOptions);

    const memberIds = (
      await this.groupMemberCache.getOrInsert(
        id,
        async (id) => ({
          group: id,
          members: (await this.client.getGroupMembers(GroupID.parse(id))).map(
            (m) => Member.fromPKApi(m),
          ),
        }),
        options.skipCache,
      )
    ).members;

    return this.memberCache.getMulti(memberIds);
  }

  public async getGroups(
    system: string,
    inOptions: GetRequestOptions = {},
  ): Promise<ReadonlyArray<Group>> {
    const options = this.mergeGetRequestOptions(inOptions);

    const groupIds = (
      await this.systemGroupCache.getOrInsert(
        system,
        async (id) => ({
          system,
          groups: (await this.client.getGroups(SystemID.parse(id), true)).map(
            (g) => Group.fromPKApi(g),
          ),
        }),
        options.skipCache,
      )
    ).groups;

    return Promise.all(groupIds.map((id) => this.getGroup(id, options)));
  }

  public async getFronters(system: string, inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);

    return await this.fronterCache.getOrInsert(
      system,
      async (system) => {
        try {
          const fronters = await this.client.getFronters(
            SystemID.parse(system),
          );

          return {
            system,
            fronters: fronters
              ? new Fronters(
                  system,
                  true,
                  dayjs(fronters.timestamp),
                  fronters.members.map((m) => Member.fromPKApi(m)),
                )
              : Fronters.empty(system),
          };
        } catch (e) {
          if (e instanceof HTTPError && e.status == 403) {
            return { system, fronters: Fronters.private(system) };
          }

          throw e;
        }
      },
      options.skipCache,
    );
  }

  public async createSwitch(
    members: Array<string>,
    inOptions: RequestOptions = {},
  ) {
    const _options = this.mergeRequestOptions(inOptions);

    const system = await this.getOwnSystem();
    if (!system) {
      return null;
    }

    const result = await this.client.createSwitch(
      system.id,
      members.map((m) => MemberID.parse(m)),
    );
    if (!result) {
      throw new Error("result of createSwitch is empty, shouldn't happen");
    }

    const fronters = new Fronters(
      system.id,
      true,
      dayjs(result.timestamp),
      result.members.map((m) => Member.fromPKApi(m)),
    );

    this.fronterCache.set({
      system: system.id,
      fronters,
    });

    return fronters;
  }

  // own system
  public async getOwnSystem(
    // NOTE: Can't specify priority because for proper functioning it's important
    //       we know our own system information, so it's always a priority 1
    inOptions: Omit<GetRequestOptions, 'priority'> = {},
  ): Promise<System | null> {
    const options = {
      skipCache: inOptions.skipCache ?? DEFAULT_GET_REQUEST_OPTIONS.skipCache,
    };

    if (!this.client.getToken()) {
      return null;
    }

    if (!this.ownSystem) {
      this.ownSystem = await this.getSystem('@me', {
        priority: 1,
        skipCache: options.skipCache,
      });
    }

    return this.ownSystem;
  }

  public async getOwnMembers(inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);
    const system = await this.getOwnSystem({ skipCache: options.skipCache });
    if (!system) {
      return null;
    }

    return await this.getMembers(system.id, options);
  }

  public async getOwnGroups(
    options: GetRequestOptions = {},
  ): Promise<ReadonlyArray<Group> | null> {
    const system = await this.getOwnSystem();
    if (!system) {
      return null;
    }

    return await this.getGroups(system.id, options);
  }

  public async getOwnFronters(inOptions: GetRequestOptions = {}) {
    const options = this.mergeGetRequestOptions(inOptions);

    const system = await this.getOwnSystem();
    if (!system) {
      return null;
    }

    return await this.getFronters(system.id, options);
  }

  // utility functions
  protected mergeGetRequestOptions(
    options: GetRequestOptions,
  ): Required<GetRequestOptions> {
    return {
      ...DEFAULT_GET_REQUEST_OPTIONS,
      ...options,
    };
  }

  protected mergeRequestOptions(
    options: RequestOptions,
  ): Required<RequestOptions> {
    return {
      ...DEFAULT_REQUEST_OPTIONS,
      ...options,
    };
  }
}
