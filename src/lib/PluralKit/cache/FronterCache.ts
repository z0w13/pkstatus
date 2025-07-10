import BaseCache from 'src/lib/PluralKit/cache/BaseCache';
import MemberCache from 'src/lib/PluralKit/cache/MemberCache';
import { Fronters } from 'src/models/Fronters';

interface FronterInput {
  system: string;
  fronters: Fronters;
}

export default class FronterCache extends BaseCache<Fronters, FronterInput> {
  private memberCache: MemberCache;

  constructor(memberCache: MemberCache, ttl: number = 300) {
    super(ttl);

    this.memberCache = memberCache;
  }

  // Fetch (refresh) member
  protected parse({ system: _system, fronters }: FronterInput): Fronters {
    fronters.members.forEach((m) => this.memberCache.set(m));
    return fronters;
  }
}
