import dayjs from 'dayjs';
import { APIError, Member as ApiMember } from 'pkapi.js';
import { pk } from 'boot/pkapi';

import BaseCache from 'src/stores/cache/BaseCache';
import MemberCache from 'src/stores/cache/MemberCache';
import { Member } from 'src/models/Member';
import { Fronters } from 'src/models/Fronters';

export async function getFronters(
  id: string,
  memberCache: MemberCache,
  token?: string,
): Promise<Fronters> {
  try {
    const fronters = await pk.getFronters({ system: id, token });
    // Fronters being undefined means a switch has never been registered
    if (!fronters) {
      return new Fronters(id, true);
    }

    const members = (
      [...(fronters.members?.values() || [])] as Array<ApiMember>
    ).map((m) => memberCache.set(Member.fromPKApi({ ...m, system: id })));

    return new Fronters(id, true, dayjs(fronters.timestamp), members);
  } catch (e) {
    if (e instanceof APIError && e.status == '403') {
      // System has denied access to fronters, return default/empty data
      return new Fronters(id);
    } else if (e instanceof APIError && e.status == '404') {
      return new Fronters(id, true);
    }

    throw e;
  }
}

export default class FronterCache extends BaseCache<Fronters> {
  private memberCache: MemberCache;

  constructor(memberCache: MemberCache, ttl: number = 300) {
    super(ttl);

    this.memberCache = memberCache;
  }

  public async fetchToken(system: string, token: string): Promise<Fronters> {
    return await getFronters(system, this.memberCache, token);
  }

  // Fetch (refresh) member
  protected async refresh(id: string): Promise<Fronters> {
    return await getFronters(id, this.memberCache);
  }
}
