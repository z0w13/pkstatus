import PluralKitApi from 'src/lib/PluralKitApi';

import BaseCache from 'src/stores/cache/BaseCache';
import GroupCache from 'src/stores/cache/GroupCache';

import { Group } from 'src/models/Group';

class SystemGroups {
  constructor(
    public id: string,
    public groups: Array<string>,
  ) {}
}

export default class SystemGroupCache extends BaseCache<SystemGroups> {
  constructor(
    private groupCache: GroupCache,
    pk: PluralKitApi,
    ttl: number = 300,
  ) {
    super(pk, ttl);
  }

  async fetchToken(system: string, token: string): Promise<SystemGroups> {
    const groups = [
      ...(await this.pk.getMembers({ token, system })).values(),
    ].map((g) => this.groupCache.set(Group.fromPKApi({ ...g })));

    return new SystemGroups(
      system,
      groups.map((m) => m.id),
    );
  }

  protected async refresh(
    system: string,
    token?: string,
  ): Promise<SystemGroups> {
    const groups = [
      ...(await this.pk.getGroups({ system, token })).values(),
    ].map((g) => this.groupCache.set(Group.fromPKApi({ ...g })));

    return new SystemGroups(
      system,
      groups.map((m) => m.id),
    );
  }
}
