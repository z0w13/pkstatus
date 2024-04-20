import BaseCache from 'src/stores/cache/BaseCache';
import { Group } from 'src/models/Group';

export default class GroupCache extends BaseCache<Group> {
  protected async refresh(id: string, token?: string): Promise<Group> {
    return Group.fromPKApi(
      await this.pk.getGroup({ group: id, token, fetch_members: true }),
    );
  }

  async getForSystem(system: string, token?: string): Promise<Array<Group>> {
    const groups = [
      ...(
        await this.pk.getGroups({ system, token, with_members: true })
      ).values(),
    ].map((m) => Group.fromPKApi(m));
    groups.forEach((m) => this.set(m));
    return groups;
  }
}
