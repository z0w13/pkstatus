import { vi } from 'vitest';

import { StrictTypedClient } from 'pkapi-ts';
import { HTTPError } from 'pkapi-ts/errors';
import SystemID from 'pkapi-ts/models/SystemID';
import ApiSystem from 'pkapi-ts/models/System';
import ApiMember from 'pkapi-ts/models/Member';
import ApiGroup from 'pkapi-ts/models/Group';
import { SwitchWithMembers } from 'pkapi-ts/models/Switch';

export function mockSystem(
  id: string,
  additionalProps: Partial<ApiMember> = {},
): ApiSystem {
  return ApiSystem.parse({
    id,
    uuid: '8b5eac7a-b019-416f-a9ad-89f62225a815',
    name: null,
    color: null,
    banner: null,
    pronouns: null,
    tag: null,
    description: null,
    avatarUrl: null,
    created: new Date(),
    privacy: {
      namePrivacy: null,
      avatarPrivacy: null,
      descriptionPrivacy: null,
      bannerPrivacy: null,
      pronounPrivacy: null,
      memberListPrivacy: null,
      groupListPrivacy: null,
      frontPrivacy: null,
      frontHistoryPrivacy: null,
    },
    ...additionalProps,
  });
}

export function mockMember(
  id: string,
  additionalProps: Partial<ApiMember> = {},
): ApiMember {
  return ApiMember.parse({
    id,
    uuid: '8b5eac7a-b019-416f-a9ad-89f62225a816',
    autoproxyEnabled: null,
    tts: false,
    keepProxy: false,
    name: null,
    displayName: null,
    pronouns: null,
    color: null,
    banner: null,
    avatarUrl: null,
    webhookAvatarUrl: null,
    description: null,
    proxyTags: [],
    messageCount: null,
    lastMessageTimestamp: null,
    birthday: null,
    created: new Date(),
    privacy: {
      visibility: null,
      namePrivacy: null,
      descriptionPrivacy: null,
      bannerPrivacy: null,
      birthdayPrivacy: null,
      pronounPrivacy: null,
      avatarPrivacy: null,
      metadataPrivacy: null,
      proxyPrivacy: null,
    },
    ...additionalProps,
  });
}

export function mockGroup(
  id: string,
  name: string,
  additionalProps: Partial<ApiGroup>,
): ApiGroup {
  return ApiGroup.parse({
    id,
    name,
    uuid: '8b5eac7a-b019-416f-a9ad-89f62225a818',
    displayName: null,
    description: null,
    icon: null,
    banner: null,
    color: null,
    privacy: {
      namePrivacy: null,
      descriptionPrivacy: null,
      bannerPrivacy: null,
      iconPrivacy: null,
      listPrivacy: null,
      metadataPrivacy: null,
      visibility: null,
    },
    created: null,
    ...additionalProps,
  });
}

export function mockFronters(
  id: string,
  system: SystemID,
  members: Array<string>,
): SwitchWithMembers {
  return SwitchWithMembers.parse({
    id,
    members: members.map((m) => mockMember(m, { system })),
    timestamp: new Date(),
  });
}

export function mockedApi(
  token: string | undefined,
  systems: Array<{
    id: string;
    own: boolean;
    members: string[];
    groups: Record<string, Array<string>>;
    fronters: string[];
  }>,
): StrictTypedClient {
  const ownId = systems.find((s) => s.own)?.id;
  const systemMap = Object.fromEntries(systems.map((s) => [s.id, s]));

  const api = vi.mockObject(new StrictTypedClient(token));
  // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
  api.getSystem.mockImplementation(async (id) => {
    if (id == '@me' && ownId) {
      id = SystemID.parse(ownId);
    }

    if (!id || !systemMap[id]) {
      throw new HTTPError(404, 'Not Found');
    }

    return mockSystem(id);
  });

  // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
  api.getSystemMembers.mockImplementation(async (id) => {
    if (id == '@me' && ownId) {
      id = SystemID.parse(ownId);
    }

    if (!id || !systemMap[id]) {
      throw new HTTPError(404, 'Not Found');
    }

    return systemMap[id].members.map((m) => mockMember(m));
  });

  return api;
}
