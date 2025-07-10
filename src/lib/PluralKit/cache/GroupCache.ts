import BaseCache from 'src/lib/PluralKit/cache/BaseCache';
import { Group } from 'src/models/Group';

export default class GroupCache extends BaseCache<Group, Group> {
  protected parse(group: Group): Group {
    return group;
  }
}
