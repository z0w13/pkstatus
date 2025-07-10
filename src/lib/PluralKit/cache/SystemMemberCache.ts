import BaseCache from 'src/lib/PluralKit/cache/BaseCache';
import MemberCache from 'src/lib/PluralKit/cache/MemberCache';

import { Member } from 'src/models/Member';

class SystemMembers {
  constructor(
    public id: string,
    public members: Array<string>,
  ) {}
}

interface SystemMemberInput {
  system: string;
  members: Array<Member>;
}

export default class SystemMemberCache extends BaseCache<
  SystemMembers,
  SystemMemberInput
> {
  constructor(
    private memberCache: MemberCache,
    ttl: number = 300,
  ) {
    super(ttl);
  }

  protected parse({ system, members }: SystemMemberInput): SystemMembers {
    return new SystemMembers(
      system,
      members.map(
        (m) => this.memberCache.set(Member.fromDict({ ...m, system })).id,
      ),
    );
  }
}
