import PluralKitApi from 'src/lib/PluralKitApi';
import MemberCache from 'src/stores/cache/MemberCache';
import SystemCache from 'src/stores/cache/SystemCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';
import FronterCache from 'src/stores/cache/FronterCache';
import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';
import { Member } from 'src/models/Member';

export default class PluralKitWrapper {
  constructor(
    public readonly api: PluralKitApi,
    public readonly systemCache: SystemCache,
    public readonly memberCache: MemberCache,
    public readonly fronterCache: FronterCache,
    public readonly systemMemberCache: SystemMemberCache,
  ) {}

  public async getSystemForToken(token: string): Promise<System> {
    return await this.systemCache.fetchToken(token);
  }

  public async getSystem(id: string): Promise<System> {
    return await this.systemCache.get(id);
  }

  public async getMembers(system: string): Promise<Array<Member>> {
    const memberIds = (await this.systemMemberCache.get(system)).members;
    return await this.memberCache.getMulti(memberIds);
  }

  public async getMember(id: string): Promise<Member> {
    return await this.memberCache.get(id);
  }

  public async getFronters(system: string): Promise<Fronters> {
    return await this.fronterCache.get(system);
  }
}
