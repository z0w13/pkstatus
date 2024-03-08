import dayjs from 'dayjs';
import { IMember as ApiMember } from 'pkapi.js';

import { ProxyTag } from 'src/models/ProxyTag';
import * as util from 'src/util';

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
      lastMessageAt: dayjs(member.last_message_timestamp),

      updatedAt: dayjs(),
    });
  }
}
