import dayjs from 'dayjs';
import ApiSystem from 'pkapi-ts/models/System';
import { z } from 'zod';
import * as util from 'src/util';
import SystemID, { SystemUUID } from 'pkapi-ts/models/SystemID';

export const SerializedSystem = z.object({
  id: z.string(),
  uuid: z.string(),

  name: z.string().nullable(),
  description: z.string().nullable(),
  tag: z.string().nullable(),
  pronouns: z.string().nullable(),

  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  color: z.string().nullable(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type SerializedSystem = z.infer<typeof SerializedSystem>;

export interface ISystem {
  id: SystemID;
  uuid: SystemUUID;

  name: string | null;
  description: string | null;
  tag: string | null;
  pronouns: string | null;

  avatarUrl: string | null;
  bannerUrl: string | null;
  color: string | null;

  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
}

export class System implements ISystem {
  constructor(
    public id: SystemID,
    public uuid: SystemUUID,

    public name: string | null,
    public description: string | null,
    public tag: string | null,
    public pronouns: string | null,

    public avatarUrl: string | null,
    public bannerUrl: string | null,
    public color: string | null,

    public createdAt: dayjs.Dayjs,
    public updatedAt: dayjs.Dayjs,
  ) {}

  formatId(opts: util.FormatIdOpts = {}): string {
    return util.formatId(this.id, opts);
  }

  getName(stripPronouns = false): string {
    if (!this.name) {
      return this.id;
    }

    return stripPronouns ? util.stripPronouns(this.name, '|') : this.name;
  }

  getPronouns(nameFallback = false): string | null {
    if (this.pronouns) {
      return this.pronouns;
    }

    if (this.name && nameFallback) {
      return util.getPronouns(this.name);
    }

    return null;
  }

  static fromDict(values: ISystem): System {
    return new System(
      values.id,
      values.uuid,

      values.name,
      values.description,
      values.tag,
      values.pronouns,

      values.avatarUrl,
      values.bannerUrl,
      values.color,

      values.createdAt,
      values.updatedAt,
    );
  }

  static fromPKApi(system: ApiSystem): System {
    return System.fromDict({
      ...system,
      name: system.name || '',
      description: system.description || '',
      tag: system.tag || '',
      pronouns: system.pronouns || '',

      avatarUrl: system.avatarUrl || null,
      bannerUrl: system.banner || null,
      color: system.color || null,

      createdAt: dayjs(system.created),
      updatedAt: dayjs(),
    });
  }

  toStorage(): SerializedSystem {
    return {
      ...this,

      createdAt: this.createdAt.toJSON(),
      updatedAt: this.updatedAt.toJSON(),
    };
  }

  static fromStorage(serialized: SerializedSystem): System {
    return System.fromDict({
      ...serialized,

      id: SystemID.parse(serialized.id),
      uuid: SystemUUID.parse(serialized.uuid),

      createdAt: dayjs(serialized.createdAt),
      updatedAt: dayjs(serialized.updatedAt),
    });
  }
}
