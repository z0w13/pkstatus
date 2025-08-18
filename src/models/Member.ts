import dayjs from 'dayjs';
import { z } from 'zod';
import ApiMember from 'pkapi-ts/models/Member';
import Birthday, {
  BirthdayFromString,
  BirthdayToString,
} from 'pkapi-ts/models/Birthday';

import { IProxyTag, ProxyTag } from 'src/models/ProxyTag';
import * as util from 'src/util';

export const SerializedMember = z.object({
  id: z.string(),
  uuid: z.string(),
  system: z.string(),

  name: z.string().nullable(),
  displayName: z.string().nullable(),
  color: z.string().nullable(),
  birthday: z.string().nullable(),
  pronouns: z.string().nullable(),
  description: z.string().nullable(),

  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  webhookAvatarUrl: z.string().nullable(),

  proxyTags: z.array(IProxyTag),
  keepProxy: z.boolean().nullable(),
  tts: z.boolean().nullable(),
  autoproxyEnabled: z.boolean().nullable(),
  messageCount: z.number().nullable(),

  createdAt: z.string().datetime().nullable(),
  lastMessageAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
});
export type SerializedMember = z.infer<typeof SerializedMember>;

export interface IMember {
  id: string;
  uuid: string;
  system: string;

  name: string | null;
  displayName: string | null;
  color: string | null;
  birthday: Birthday | null;
  pronouns: string | null;
  description: string | null;

  avatarUrl: string | null;
  bannerUrl: string | null;
  webhookAvatarUrl: string | null;

  proxyTags: Array<ProxyTag>;
  keepProxy: boolean | null;
  tts: boolean | null;
  autoproxyEnabled: boolean | null;
  messageCount: number | null;

  createdAt: dayjs.Dayjs | null;
  lastMessageAt: dayjs.Dayjs | null;

  updatedAt: dayjs.Dayjs;
}

export class Member implements IMember {
  constructor(
    public id: string,
    public uuid: string,
    public system: string,

    public name: string | null,
    public displayName: string | null,
    public color: string | null,
    public birthday: Birthday | null,
    public pronouns: string | null,
    public description: string | null,

    public avatarUrl: string | null,
    public bannerUrl: string | null,
    public webhookAvatarUrl: string | null,

    public proxyTags: Array<ProxyTag>,
    public keepProxy: boolean | null,
    public tts: boolean | null,
    public autoproxyEnabled: boolean | null,
    public messageCount: number | null,

    public createdAt: dayjs.Dayjs | null,
    public lastMessageAt: dayjs.Dayjs | null,

    public updatedAt: dayjs.Dayjs,
  ) {
    if (!system) {
      throw new Error('Well shit no system');
    }
  }

  formatId(opts: util.FormatIdOpts = {}): string {
    return util.formatId(this.id, opts);
  }

  getName(stripPronouns = false): string {
    const name = this.displayName ?? this.name;
    if (!name) {
      return this.id;
    }

    return stripPronouns ? util.stripPronouns(name, '|') : name;
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

  getFormattedBirthday(): string | null {
    if (!this.birthday) {
      return null;
    }

    if (this.birthday.year === null) {
      return `????-${this.birthday.month}-${this.birthday.day}`;
    }

    return `${this.birthday.year}-${this.birthday.month}-${this.birthday.day}`;
  }

  static fromDict(values: IMember): Member {
    return new Member(
      values.id,
      values.uuid,
      values.system,

      values.name,
      values.displayName,
      values.color,
      values.birthday,
      values.pronouns,
      values.description,

      values.avatarUrl,
      values.bannerUrl,
      values.webhookAvatarUrl,

      values.proxyTags,
      values.keepProxy,
      values.tts,
      values.autoproxyEnabled,
      values.messageCount,

      values.createdAt,
      values.lastMessageAt,

      values.updatedAt,
    );
  }

  static fromPKApi(member: ApiMember): Member {
    if (typeof member.system !== 'string' || member.system.length === 0) {
      throw new Error("Member.system shouldn't be an empty string");
    }

    return Member.fromDict({
      ...member,

      // NOTE: Needed because typescript doesn't seem to narrow spread operators
      system: member.system,
      name: member.name,
      displayName: member.displayName,
      color: member.color,
      pronouns: member.pronouns,
      description: member.description,

      bannerUrl: member.banner,

      proxyTags: (member.proxyTags || []).map((t) => ProxyTag.fromPKApi(t)),

      createdAt: util.dayjsNull(member.created),
      lastMessageAt: util.dayjsNull(member.lastMessageTimestamp),

      updatedAt: dayjs(),
    });
  }

  toStorage(): SerializedMember {
    return {
      ...this,

      birthday: this.birthday ? BirthdayToString.parse(this.birthday) : null,

      createdAt: this.createdAt?.toJSON() ?? null,
      lastMessageAt: this.lastMessageAt?.toJSON() || null,

      updatedAt: this.updatedAt.toJSON(),
    };
  }

  static fromStorage(serialized: SerializedMember): Member {
    return Member.fromDict({
      ...serialized,

      birthday: serialized.birthday
        ? BirthdayFromString.parse(serialized.birthday)
        : null,

      createdAt: dayjs(serialized.createdAt),
      lastMessageAt: util.dayjsNull(serialized.lastMessageAt),

      updatedAt: dayjs(serialized.updatedAt),
    });
  }
}
