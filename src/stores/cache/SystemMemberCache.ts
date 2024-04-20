import PluralKitApi from 'src/lib/PluralKitApi';

import BaseCache from 'src/stores/cache/BaseCache';
import MemberCache from 'src/stores/cache/MemberCache';

import { Member } from 'src/models/Member';

class SystemMembers {
  constructor(
    public id: string,
    public members: Array<string>,
  ) {}
}

export default class SystemMemberCache extends BaseCache<SystemMembers> {
  constructor(
    private memberCache: MemberCache,
    pk: PluralKitApi,
    ttl: number = 300,
  ) {
    super(pk, ttl);
  }

  async fetchToken(system: string, token: string): Promise<SystemMembers> {
    const members = [
      ...(await this.pk.getMembers({ token, system })).values(),
    ].map((m) => this.memberCache.set(Member.fromPKApi({ ...m, system })));

    return new SystemMembers(
      system,
      members.map((m) => m.id),
    );
  }

  protected async refresh(
    system: string,
    token?: string,
  ): Promise<SystemMembers> {
    const members = [
      ...(await this.pk.getMembers({ system, token })).values(),
    ].map((m) => this.memberCache.set(Member.fromPKApi({ ...m, system })));

    return new SystemMembers(
      system,
      members.map((m) => m.id),
    );
  }
}
