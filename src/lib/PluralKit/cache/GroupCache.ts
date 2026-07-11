import BaseCache from '@/lib/PluralKit/cache/BaseCache';
import { Group } from '@/models/Group';

export default class GroupCache extends BaseCache<Group, Group> {
  protected parse(group: Group): Group {
    return group;
  }
}
