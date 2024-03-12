import dayjs from 'dayjs';
import { IMember as ApiMember } from 'pkapi.js';

import { IProxyTag, ProxyTag } from 'src/models/ProxyTag';
import * as util from 'src/util';
import { z } from 'zod';
import * as zt from 'src/zodtypes';

export const IMember = z.object({
  id: z.string(),
  uuid: z.string(),
  system: z.string(),

  name: z.string(),
  displayName: z.string().nullable(),
  color: z.string().nullable(),
  birthday: zt.dayjs().nullable(),
  pronouns: z.string().nullable(),
  description: z.string().nullable(),

  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  webhookAvatarUrl: z.string().nullable(),

  proxyTags: z.array(IProxyTag).nullable(),
  keepProxy: z.boolean().nullable(),
  tts: z.boolean().nullable(),
  autoproxyEnabled: z.boolean().nullable(),
  messageCount: z.number().nullable(),

  createdAt: zt.dayjs(),
  lastMessageAt: zt.dayjs().nullable(),
  updatedAt: zt.dayjs(),
});
export type IMember = z.infer<typeof IMember>;

export class Member implements IMember {
  constructor(
    public id: string,
    public uuid: string,
    public system: string,

    public name: string,
    public displayName: string | null,
    public color: string | null,
    public birthday: dayjs.Dayjs | null,
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

    public createdAt: dayjs.Dayjs,
    public lastMessageAt: dayjs.Dayjs | null,

    public updatedAt: dayjs.Dayjs,
  ) {}

  getName(stripPronouns = false): string {
    const name = this.displayName || this.name;
    return stripPronouns ? util.stripPronouns(name, '|') : name;
  }

  getPronouns(nameFallback = false): string | null {
    if (!this.pronouns) {
      return nameFallback ? util.getPronouns(this.getName()) : null;
    }

    return this.pronouns;
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

      (values.proxyTags || []).map((t) => new ProxyTag(t.prefix, t.suffix)),
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
    return Member.fromDict({
      ...member,

      name: member.name || '',
      displayName: util.nonEmptyStringOrNull(member.display_name),
      color: util.nonEmptyStringOrNull(member.color),
      birthday: member.birthday ? dayjs(member.birthday) : null,
      pronouns: util.nonEmptyStringOrNull(member.pronouns),
      description: util.nonEmptyStringOrNull(member.description),

      avatarUrl: util.nonEmptyStringOrNull(member.avatar_url),
      webhookAvatarUrl: util.nonEmptyStringOrNull(member.webhook_avatar_url),
      bannerUrl: util.nonEmptyStringOrNull(member.banner),

      proxyTags: (member.proxy_tags || []).map((t) => ProxyTag.fromPKApi(t)),
      keepProxy: member.keep_proxy || null,
      tts: member.tts || null,
      autoproxyEnabled: member.autoproxy_enabled || null,
      messageCount: member.message_count || null,

      createdAt: dayjs(member.created),
      lastMessageAt: member.last_message_timestamp
        ? dayjs(member.last_message_timestamp)
        : null,

      updatedAt: dayjs(),
    });
  }
}
