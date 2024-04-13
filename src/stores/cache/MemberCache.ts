import BaseCache from 'src/stores/cache/BaseCache';
import { Member } from 'src/models/Member';

export default class MemberCache extends BaseCache<Member> {
  protected async refresh(id: string): Promise<Member> {
    return Member.fromPKApi(await this.pk.getMember({ member: id }));
  }

  async getForSystem(system: string, token?: string): Promise<Array<Member>> {
    const members = [
      ...(await this.pk.getMembers({ system, token })).values(),
    ].map((m) => Member.fromPKApi(m));
    members.forEach((m) => this.set(m));
    return members;
  }
}
