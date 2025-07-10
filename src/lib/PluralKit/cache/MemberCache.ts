import BaseCache from 'src/lib/PluralKit/cache/BaseCache';

import { Member } from 'src/models/Member';

export default class MemberCache extends BaseCache<Member, Member> {
  public parse(member: Member): Member {
    return member;
  }
}
