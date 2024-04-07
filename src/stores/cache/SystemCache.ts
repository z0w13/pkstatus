import { pk } from 'boot/pkapi';

import BaseCache from 'src/stores/cache/BaseCache';
import { System } from 'src/models/System';

export default class SystemCache extends BaseCache<System> {
  protected async refresh(id: string): Promise<System> {
    return System.fromPKApi(await pk.getSystem({ system: id }));
  }

  async fetchToken(token: string): Promise<System> {
    return this.set(System.fromPKApi(await pk.getSystem({ token })));
  }
}
