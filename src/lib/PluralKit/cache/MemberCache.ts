import BaseCache from '@/lib/PluralKit/cache/BaseCache';

import { Member } from '@/models/Member';

export default class MemberCache extends BaseCache<Member, Member> {
  public parse(member: Member): Member {
    return member;
  }
}
