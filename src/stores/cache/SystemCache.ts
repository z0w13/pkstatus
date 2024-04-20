import BaseCache from 'src/stores/cache/BaseCache';
import { System } from 'src/models/System';

export default class SystemCache extends BaseCache<System> {
  protected async refresh(id: string, token?: string): Promise<System> {
    if (token && id !== '@me') {
      throw new Error(
        'SystemCache::refresh called with token and ID other than @me, ' +
          "don't do this as it causes unexpected behaviour with PKAPI.js",
      );
    }

    return System.fromPKApi(await this.pk.getSystem({ system: id, token }));
  }

  async fetchToken(token: string): Promise<System> {
    return this.set(System.fromPKApi(await this.pk.getSystem({ token })));
  }
}
