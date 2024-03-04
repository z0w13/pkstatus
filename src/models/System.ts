import dayjs from 'dayjs';
import { ISystem as ApiSystem } from 'pkapi.js';
import { z } from 'zod';
import * as util from 'src/util';

export const SerializedSystem = z.object({
  id: z.string(),
  uuid: z.string(),

  name: z.string().default(''),
  description: z.string().default(''),
  tag: z.string().default(''),
  pronouns: z.string().default(''),

  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  color: z.string().nullable(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type SerializedSystem = z.infer<typeof SerializedSystem>;

interface ISystem {
  id: string;
  uuid: string;

  name: string;
  description: string;
  tag: string;
  pronouns: string;

  avatarUrl: string | null;
  bannerUrl: string | null;
  color: string | null;

  createdAt: dayjs.Dayjs;
  updatedAt: dayjs.Dayjs;
}

export class System implements ISystem {
  constructor(
    public id: string,
    public uuid: string,

    public name: string,
    public description: string,
    public tag: string,
    public pronouns: string,

    public avatarUrl: string | null,
    public bannerUrl: string | null,
    public color: string | null,

    public createdAt: dayjs.Dayjs,
    public updatedAt: dayjs.Dayjs,
  ) {}

  getName({
    stripPronouns = false,
    appendPronouns = false,
  }: {
    stripPronouns?: boolean;
    appendPronouns?: boolean;
  } = {}): string {
    if (stripPronouns) {
      return util.stripPronouns(this.name, '|');
    }

    if (appendPronouns && (util.containsPronouns(this.name) || this.pronouns)) {
      return util.containsPronouns(this.name)
        ? this.name
        : `${this.name} (${this.pronouns})`;
    }

    return this.name;
  }

  getPronouns(): string | null {
    return this.pronouns || util.getPronouns(this.name);
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

      avatarUrl: system.avatar_url || null,
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

      createdAt: dayjs(serialized.createdAt),
      updatedAt: dayjs(serialized.updatedAt),
    });
  }
}
