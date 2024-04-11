import { pk } from 'boot/pkapi';

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
  private memberCache: MemberCache;

  constructor(memberCache: MemberCache, ttl: number = 300) {
    super(ttl);

    this.memberCache = memberCache;
  }

  async fetchToken(system: string, token: string): Promise<SystemMembers> {
    const members = [...(await pk.getMembers({ token, system })).values()].map(
      (m) => this.memberCache.set(Member.fromPKApi({ ...m, system })),
    );

    return new SystemMembers(
      system,
      members.map((m) => m.id),
    );
  }

  protected async refresh(system: string): Promise<SystemMembers> {
    const members = [...(await pk.getMembers({ system })).values()].map((m) =>
      this.memberCache.set(Member.fromPKApi({ ...m, system })),
    );

    return new SystemMembers(
      system,
      members.map((m) => m.id),
    );
  }
}
