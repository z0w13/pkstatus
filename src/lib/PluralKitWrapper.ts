import PluralKitApi from 'src/lib/PluralKitApi';
import MemberCache from 'src/stores/cache/MemberCache';
import SystemCache from 'src/stores/cache/SystemCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';
import FronterCache from 'src/stores/cache/FronterCache';
import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';
import { Member } from 'src/models/Member';
import GroupCache from 'src/stores/cache/GroupCache';
import { Group } from 'src/models/Group';
import SystemGroupCache from 'src/stores/cache/SystemGroupCache';
import GroupMemberCache from 'src/stores/cache/GroupMemberCache';

enum AuthState {
  NoToken = 'NO_TOKEN',
  Loading = 'LOADING',
  LoggedIn = 'LOGGED_IN',
}

interface NoTokenAuthInfo {
  state: AuthState.NoToken;
  token?: undefined;
}
interface LoadingAuthInfo {
  token: string;
  state: AuthState.Loading;
  promise: Promise<System>;
}
interface LoggedInAuthInfo {
  token: string;
  state: AuthState.LoggedIn;
  system: System;
}
type AuthInfo = NoTokenAuthInfo | LoadingAuthInfo | LoggedInAuthInfo;

export default class PluralKitWrapper {
  private authInfo: AuthInfo = {
    state: AuthState.NoToken,
  };

  constructor(
    public readonly api: PluralKitApi,
    public readonly systemCache: SystemCache,
    public readonly memberCache: MemberCache,
    public readonly systemMemberCache: SystemMemberCache,
    public readonly groupCache: GroupCache,
    public readonly groupMemberCache: GroupMemberCache,
    public readonly systemGroupCache: SystemGroupCache,
    public readonly fronterCache: FronterCache,
  ) {}

  public async setToken(token: string | null) {
    if (!token) {
      return (this.authInfo = {
        state: AuthState.NoToken,
      });
    }

    this.authInfo = {
      token,
      state: AuthState.Loading,
      promise: this.systemCache.fetchToken(token),
    };

    this.authInfo = {
      token,
      state: AuthState.LoggedIn,
      system: await this.authInfo.promise,
    };
  }

  protected isOwnSystem(system: string): boolean {
    if (this.authInfo.state !== AuthState.LoggedIn) {
      return false;
    }

    return [this.authInfo.system.id, this.authInfo.system.uuid, '@me'].includes(
      system,
    );
  }

  public async getSystem(id: string): Promise<System> {
    return this.isOwnSystem(id)
      ? await this.systemCache.get(id, this.authInfo.token)
      : this.systemCache.get(id);
  }

  public async getOwnSystem(): Promise<System | null> {
    if (this.authInfo.state === AuthState.NoToken) {
      return null;
    }

    const system =
      this.authInfo.state === AuthState.Loading
        ? await this.authInfo.promise
        : this.authInfo.system;

    if (this.systemCache.expired(system)) {
      return this.systemCache.fetchToken(this.authInfo.token);
    }

    return this.systemCache.get(system.id, this.authInfo.token);
  }

  public async getMember(id: string): Promise<Member> {
    return await this.memberCache.get(id, this.authInfo.token);
  }

  public async getMembers(system: string): Promise<Array<Member>> {
    const memberIds = (
      await this.systemMemberCache.get(system, this.authInfo.token)
    ).members;
    return await this.memberCache.getMulti(memberIds, this.authInfo.token);
  }

  public async getOwnMembers(): Promise<Array<Member>> {
    if (this.authInfo.state === AuthState.Loading) {
      await this.authInfo.promise;
    }

    if (this.authInfo.state !== AuthState.LoggedIn) {
      throw new Error("Can't get own members when not logged in");
    }

    return await this.getMembers(this.authInfo.system.id);
  }

  public async getGroup(id: string): Promise<Group> {
    return await this.groupCache.get(id, this.authInfo.token);
  }

  public async getGroupMembers(id: string): Promise<Array<Member>> {
    const memberIds = (await this.groupMemberCache.get(id, this.authInfo.token))
      .members;
    return await this.memberCache.getMulti(memberIds, this.authInfo.token);
  }

  public async getGroups(system: string): Promise<Array<Group>> {
    const groupIds = (
      await this.systemGroupCache.get(system, this.authInfo.token)
    ).groups;
    return await this.groupCache.getMulti(groupIds, this.authInfo.token);
  }

  public async getOwnGroups(): Promise<Array<Group>> {
    if (this.authInfo.state === AuthState.Loading) {
      await this.authInfo.promise;
    }

    if (this.authInfo.state !== AuthState.LoggedIn) {
      throw new Error("Can't get own groups when not logged in");
    }

    return await this.getGroups(this.authInfo.system.id);
  }

  public async getFronters(system: string): Promise<Fronters> {
    return await this.fronterCache.get(system, this.authInfo.token);
  }

  public async getOwnFronters(): Promise<Fronters> {
    if (this.authInfo.state === AuthState.Loading) {
      await this.authInfo.promise;
    }

    if (this.authInfo.state !== AuthState.LoggedIn) {
      throw new Error("Can't get own fronters when not logged in");
    }

    return await this.getFronters(this.authInfo.system.id);
  }

  public async createSwitch(...args: Parameters<PluralKitApi['createSwitch']>) {
    if (!args[0].token) {
      args[0].token = this.authInfo.token;
    }

    return await this.api.createSwitch(...args);
  }
}
