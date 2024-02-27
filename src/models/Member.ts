import dayjs from 'dayjs';
import { IMember as ApiMember } from 'pkapi.js';

import { nonEmptyStringOrNull } from 'src/util';
import { ProxyTag } from 'src/models/ProxyTag';

interface IMember {
  id: string;
  uuid: string;

  name: string;
  displayName: string | null;
  color: string | null;
  birthday: dayjs.Dayjs | null;
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

  createdAt: dayjs.Dayjs;
  lastMessageAt: dayjs.Dayjs;

  updatedAt: dayjs.Dayjs;
}

export class Member implements IMember {
  constructor(
    public id: string,
    public uuid: string,

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
    public lastMessageAt: dayjs.Dayjs,

    public updatedAt: dayjs.Dayjs,
  ) {}

  static fromDict(values: IMember): Member {
    return new Member(
      values.id,
      values.uuid,

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
    return Member.fromDict({
      ...member,

      name: member.name || '',
      displayName: nonEmptyStringOrNull(member.color),
      color: nonEmptyStringOrNull(member.color),
      birthday: member.birthday ? dayjs(member.birthday) : null,
      pronouns: nonEmptyStringOrNull(member.pronouns),
      description: nonEmptyStringOrNull(member.description),

      avatarUrl: nonEmptyStringOrNull(member.avatar_url),
      webhookAvatarUrl: nonEmptyStringOrNull(member.webhook_avatar_url),
      bannerUrl: nonEmptyStringOrNull(member.banner),

      proxyTags: (member.proxy_tags || []).map((t) => ProxyTag.fromPKApi(t)),
      keepProxy: member.keep_proxy || null,
      tts: member.tts || null,
      autoproxyEnabled: member.autoproxy_enabled || null,
      messageCount: member.message_count || null,

      createdAt: dayjs(member.created),
      lastMessageAt: dayjs(member.last_message_timestamp),

      updatedAt: dayjs(),
    });
  }
}
