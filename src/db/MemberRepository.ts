import { Member as ApiMember } from 'pkapi.js';
import { Database } from 'src/db/Database';
import PluralKitApi from 'src/lib/PluralKitApi';
import { Member } from 'src/models/Member';

export default class MemberRepository {
  constructor(protected db: Database) {}

  async updateFromApi(apiMembers: Iterable<ApiMember>, system: string) {
    for (const apiMember of apiMembers) {
      await this.db.members.put(Member.fromPKApi({ ...apiMember, system }));
    }
  }

  async refreshFromApi(pk: PluralKitApi, system: string, token: string) {
    const apiMembers = await pk.getMembers({
      system: system,
      token: token,
    });

    await this.updateFromApi(apiMembers.values(), system);
  }
}
