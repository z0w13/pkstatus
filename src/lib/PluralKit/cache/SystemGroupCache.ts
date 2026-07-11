import BaseCache from '@/lib/PluralKit/cache/BaseCache';
import GroupCache from '@/lib/PluralKit/cache/GroupCache';

import { Group } from '@/models/Group';

class SystemGroups {
  constructor(
    public id: string,
    public groups: Array<string>,
  ) {}
}

interface SystemGroupsInput {
  system: string;
  groups: Array<Group>;
}

export default class SystemGroupCache extends BaseCache<
  SystemGroups,
  SystemGroupsInput
> {
  constructor(
    private groupCache: GroupCache,
    ttl: number = 300,
  ) {
    super(ttl);
  }

  protected parse({ system, groups }: SystemGroupsInput): SystemGroups {
    return new SystemGroups(
      system,
      groups.map((g) => this.groupCache.set(g).id),
    );
  }
}
