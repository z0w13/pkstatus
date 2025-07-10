import BaseCache from 'src/lib/PluralKit/cache/BaseCache';
import { System } from 'src/models/System';

export default class SystemCache extends BaseCache<System, System> {
  protected parse(system: System): System {
    return system;
  }
}
