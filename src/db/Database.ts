import Dexie from 'dexie';
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import schema0001 from 'src/db/schema/0001';

export class Database extends Dexie {
  systems!: Dexie.Table<System, string>;
  members!: Dexie.Table<Member, string>;

  constructor() {
    super('PKStatusDatabase');

    this.version(1).stores(schema0001);

    this.systems.mapToClass(System);
    this.members.mapToClass(Member);
  }
}
