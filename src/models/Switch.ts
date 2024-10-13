import dayjs from 'dayjs';

import { ISwitch as ApiSwitch } from 'pkapi.js';

export interface ISwitch {
  id: string;
  system: string;
  timestamp: dayjs.Dayjs;
  members: Array<string>;
}

export class Switch implements ISwitch {
  constructor(
    public id: string,
    public system: string,
    public timestamp: dayjs.Dayjs,
    public members: Array<string>,
  ) {}

  static fromDict(values: ISwitch): Switch {
    return new Switch(
      values.id,
      values.system,
      values.timestamp,
      values.members,
    );
  }

  static fromPKApi(api: ApiSwitch, system: string): Switch {
    const members = api.members;
    if (!Array.isArray(members)) {
      console.error("api.members isn't an array", api.members);
      throw new Error("api.members isn't an array");
    }

    return Switch.fromDict({
      ...api,

      members,
      timestamp: dayjs(api.timestamp),
      system,
    });
  }
}
