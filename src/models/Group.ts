import dayjs from 'dayjs';
import { IGroup as ApiGroup } from 'pkapi.js';
import { nonEmptyStringOrNull, formatId, FormatIdOpts } from 'src/util';

export interface IGroup {
  id: string;
  uuid: string;
  system: string;
  name: string;
  displayName: string | null;
  description: string | null;
  icon: string | null;
  banner: string | null;
  color: string | null;
  members: Array<string>;
  createdAt: dayjs.Dayjs;
}

export class Group implements IGroup {
  constructor(
    public id: string,
    public uuid: string,
    public system: string,
    public name: string,
    public displayName: string | null,
    public description: string | null,
    public icon: string | null,
    public banner: string | null,
    public color: string | null,
    public members: Array<string>,
    public createdAt: dayjs.Dayjs,
  ) {
    if (system.length === 0) {
      throw new Error("Group.system shouldn't be an empty string");
    }
  }

  public formatId(opts: FormatIdOpts = {}): string {
    return formatId(this.id, opts);
  }

  public getName() {
    return this.displayName || this.name;
  }

  static fromDict(group: IGroup): Group {
    return new Group(
      group.id,
      group.uuid,
      group.system,
      group.name,
      group.displayName,
      group.description,
      group.icon,
      group.banner,
      group.color,
      group.members,
      group.createdAt,
    );
  }
  static fromPKApi(group: ApiGroup): Group {
    if (typeof group.system !== 'string' || group.system.length === 0) {
      throw new Error("Group.system shouldn't be an empty string");
    }

    return Group.fromDict({
      ...group,

      system: group.system!, // This is verified by above guard
      color: nonEmptyStringOrNull(group.color),
      displayName: nonEmptyStringOrNull(group.display_name),
      description: nonEmptyStringOrNull(group.description),
      icon: nonEmptyStringOrNull(group.icon),
      banner: nonEmptyStringOrNull(group.banner),
      members: Array.isArray(group.members)
        ? group.members || []
        : [...(group?.members?.keys() || [])],

      createdAt: dayjs(group.created),
    });
  }
}
