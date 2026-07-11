import BaseCache from '@/lib/PluralKit/cache/BaseCache';
import { System } from '@/models/System';

export default class SystemCache extends BaseCache<System, System> {
  protected parse(system: System): System {
    return system;
  }
}
