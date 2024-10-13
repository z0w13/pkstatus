import BaseCache from 'src/stores/cache/BaseCache';
import { Switch } from 'src/models/Switch';

class SystemSwitches {
  constructor(
    public id: string,
    public switches: Array<Switch>,
  ) {}
}

export default class SystemSwitchCache extends BaseCache<SystemSwitches> {
  protected async refresh(id: string, token?: string): Promise<SystemSwitches> {
    const switches = await this.pk.getSwitches({
      system: id,
      raw: true,
      token,
    });
    if (!(switches instanceof Map)) {
      throw new Error('switches should be a map');
    }

    return new SystemSwitches(
      id,
      [...switches.values()].map((s) => Switch.fromPKApi(s, id)),
    );
  }
}
