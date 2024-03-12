export default {
  systems: [
    'uuid',
    '&id',

    'name',
    'description',
    'tag',
    'pronouns',

    'avatarUrl',
    'bannerUrl',
    'color',

    'createdAt',
    'updatedAt',
  ].join(','),

  members: [
    'uuid',
    '&id',
    'system',

    'name',
    'displayName',
    'color',
    'birthday',
    'pronouns',
    'description',

    'avatarUrl',
    'bannerUrl',
    'webhookAvatarUrl',

    'proxyTags',
    'keepProxy',
    'tts',
    'autoproxyEnabled',
    'messageCount',

    'createdAt',
    'lastMessageAt',

    'updatedAt',
  ].join(','),
};
