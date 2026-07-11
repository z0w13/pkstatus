import BaseCache from '@/lib/PluralKit/cache/BaseCache';
import MemberCache from '@/lib/PluralKit/cache/MemberCache';

import { Member } from '@/models/Member';

class GroupMembers {
  constructor(
    public id: string,
    public members: Array<string>,
  ) {}
}

interface GroupMemberInput {
  group: string;
  members: Array<Member>;
}

export default class GroupMemberCache extends BaseCache<
  GroupMembers,
  GroupMemberInput
> {
  constructor(
    private memberCache: MemberCache,
    ttl: number = 300,
  ) {
    super(ttl);
  }

  protected parse({ group, members }: GroupMemberInput): GroupMembers {
    return new GroupMembers(
      group,
      members.map((m) => this.memberCache.set(m).id),
    );
  }
}
