import dayjs from 'dayjs';
import { APIError, Member as ApiMember } from 'pkapi.js';

import PluralKitApi from 'src/lib/PluralKitApi';
import BaseCache from 'src/stores/cache/BaseCache';
import MemberCache from 'src/stores/cache/MemberCache';
import { Member } from 'src/models/Member';
import { Fronters } from 'src/models/Fronters';

export default class FronterCache extends BaseCache<Fronters> {
  private memberCache: MemberCache;

  constructor(memberCache: MemberCache, pk: PluralKitApi, ttl: number = 300) {
    super(pk, ttl);

    this.memberCache = memberCache;
  }

  protected async getFronters(
    system: string,
    token?: string,
  ): Promise<Fronters> {
    try {
      const fronters = await this.pk.getFronters({ system, token });
      // Fronters being undefined means a switch has never been registered
      if (!fronters) {
        return Fronters.empty(system);
      }

      // Convert members to PKStatus variant
      const members = (
        [...(fronters.members?.values() || [])] as Array<ApiMember>
      ).map((m) => Member.fromPKApi({ ...m, system: system }));

      // Update cached members
      members.forEach((m) => this.memberCache.set(m));

      return new Fronters(system, true, dayjs(fronters.timestamp), members);
    } catch (e) {
      if (e instanceof APIError && e.status == '403') {
        return Fronters.private(system);
      } else if (e instanceof APIError && e.status == '404') {
        return Fronters.empty(system);
      }

      throw e;
    }
  }

  public async fetchToken(system: string, token: string): Promise<Fronters> {
    return await this.getFronters(system, token);
  }

  // Fetch (refresh) member
  protected async refresh(id: string, token?: string): Promise<Fronters> {
    return await this.getFronters(id, token);
  }
}
