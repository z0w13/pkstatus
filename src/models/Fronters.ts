import dayjs from 'dayjs';
import { z } from 'zod';

import { Member } from 'src/models/Member';
import { dayjsNull } from 'src/util';

export const SerializedFronters = z.object({
  system: z.string(),
  allowed: z.boolean(),
  members: z.array(z.string()),
  lastSwitch: z.string().datetime().nullable(),
  lastUpdated: z.string().datetime(),
});
export type SerializedFronters = z.infer<typeof SerializedFronters>;

export interface IFronters {
  system: string;
  allowed: boolean;
  members: Array<Member>;
  lastSwitch: dayjs.Dayjs | null;
  lastUpdated: dayjs.Dayjs;
}

export class Fronters {
  constructor(
    public system: string,
    public allowed: boolean = false,
    public lastSwitch: dayjs.Dayjs | null = null,
    public members: Array<Member> = [],
    public lastUpdated: dayjs.Dayjs = dayjs(),
  ) {}

  public get id(): string {
    return this.system;
  }

  toStorage(): SerializedFronters {
    return {
      ...this,

      members: this.members.map((m) => m.id),
      lastSwitch: this.lastSwitch?.toJSON() || null,
      lastUpdated: this.lastUpdated.toJSON(),
    };
  }

  static fromDict(values: IFronters): Fronters {
    return new Fronters(
      values.system,
      values.allowed,
      values.lastSwitch,
      values.members,
      values.lastUpdated,
    );
  }

  static fromStorage(
    serialized: SerializedFronters,
    members: Array<Member>,
  ): Fronters {
    return Fronters.fromDict({
      ...serialized,

      members,

      lastUpdated: dayjs(serialized.lastUpdated),
      lastSwitch: dayjsNull(serialized.lastSwitch),
    });
  }

  static empty(system: string) {
    return new Fronters(system, true);
  }

  static private(system: string) {
    return new Fronters(system, false);
  }
}
