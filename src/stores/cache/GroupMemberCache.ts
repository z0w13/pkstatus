import PluralKitApi from 'src/lib/PluralKitApi';
import BaseCache from 'src/stores/cache/BaseCache';
import MemberCache from 'src/stores/cache/MemberCache';
import GroupCache from 'src/stores/cache/GroupCache';

import { Member } from 'src/models/Member';

class GroupMembers {
  constructor(
    public id: string,
    public members: Array<string>,
  ) {}
}

export default class GroupMemberCache extends BaseCache<GroupMembers> {
  constructor(
    private memberCache: MemberCache,
    private groupCache: GroupCache,
    pk: PluralKitApi,
    ttl: number = 300,
  ) {
    super(pk, ttl);
  }

  protected async refresh(id: string, token?: string): Promise<GroupMembers> {
    const system = (await this.groupCache.get(id, token)).system;
    const members = [
      ...(await this.pk.getGroupMembers({ group: id, token })).values(),
    ].map((m) => this.memberCache.set(Member.fromPKApi({ ...m, system })));

    return new GroupMembers(
      id,
      members.map((m) => m.id),
    );
  }
}
