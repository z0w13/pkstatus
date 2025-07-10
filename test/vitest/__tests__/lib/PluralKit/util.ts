import { vi } from 'vitest';

import dayjs from 'dayjs';
import { Fronters } from 'src/models/Fronters';
import { IMember, Member } from 'src/models/Member';
import { ISystem, System } from 'src/models/System';
import { AxiosError } from 'axios';
import { Group, IGroup } from 'src/models/Group';
import ApiClient from 'src/lib/PluralKit/ApiClient';

export class ManuallyStartedApiClient extends ApiClient {
  protected override async processQueue(): Promise<void> {}

  public async drainQueue(): Promise<void> {
    console.debug(`manually draining queue of size ${this.queue.length}`);
    await super.processQueue();
    console.debug('queue drained');
  }
}

export function mockSystem(
  id: string,
  additionalProps: Partial<ISystem> = {},
): System {
  return System.fromDict({
    id,
    uuid: `uuid-${id}`,

    name: additionalProps.name ?? `system-${id}`,
    description: additionalProps.description ?? null,
    tag: additionalProps.tag ?? null,
    pronouns: additionalProps.pronouns ?? null,

    avatarUrl: additionalProps.avatarUrl ?? null,
    bannerUrl: additionalProps.bannerUrl ?? null,
    color: additionalProps.color ?? null,

    createdAt: additionalProps.createdAt ?? dayjs(0),
    updatedAt: additionalProps.createdAt ?? dayjs(0),
  });
}

export function mockMember(
  id: string,
  additionalProps: Partial<IMember> = {},
): Member {
  return Member.fromDict({
    id,
    uuid: additionalProps.uuid ?? `uuid-${id}`,

    system: additionalProps.system ?? 'no-system',
    name: additionalProps.name ?? null,
    displayName: additionalProps.displayName ?? null,
    color: additionalProps.color ?? null,

    birthday: additionalProps.birthday ?? null,
    pronouns: additionalProps.pronouns ?? null,
    description: additionalProps.description ?? null,

    avatarUrl: additionalProps.avatarUrl ?? null,
    bannerUrl: additionalProps.bannerUrl ?? null,
    webhookAvatarUrl: additionalProps.webhookAvatarUrl ?? null,
    proxyTags: additionalProps.proxyTags ?? [],
    keepProxy: additionalProps.keepProxy ?? null,
    tts: additionalProps.tts ?? null,
    autoproxyEnabled: additionalProps.autoproxyEnabled ?? null,
    messageCount: additionalProps.messageCount ?? null,

    createdAt: additionalProps.createdAt ?? dayjs(0),
    lastMessageAt: additionalProps.lastMessageAt ?? null,

    updatedAt: additionalProps.createdAt ?? dayjs(0),
  });
}

export function mockGroup(id: string, additionalProps: Partial<IGroup>): Group {
  return Group.fromDict({
    id,
    uuid: additionalProps.uuid ?? `uuid-${id}`,

    system: additionalProps.system ?? 'unknown-system',
    name: additionalProps.name ?? `group-${id}`,

    displayName: additionalProps.displayName ?? null,
    description: additionalProps.description ?? null,

    icon: additionalProps.icon ?? null,
    banner: additionalProps.banner ?? null,
    color: additionalProps.color ?? null,

    members: [],
    createdAt: dayjs(0),
  });
}

export function mockFronters(
  id: string,
  system: string,
  members: Array<string>,
): Fronters {
  return new Fronters(
    system,
    true,
    dayjs(0),
    members.map((m) => mockMember(m, { system })),
  );
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
): ApiClient {
  const ownId = systems.find((s) => s.own)?.id;
  const systemMap = Object.fromEntries(systems.map((s) => [s.id, s]));

  const api = vi.mockObject(new ApiClient());
  // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
  api.getSystem.mockImplementation(async (id) => {
    if (id == '@me' && ownId) {
      id = ownId;
    }

    if (!id || !systemMap[id]) {
      throw new AxiosError('Not Found', '404');
    }

    return mockSystem(id);
  });

  // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
  api.getMembers.mockImplementation(async (id) => {
    if (id == '@me' && ownId) {
      id = ownId;
    }

    if (!id || !systemMap[id]) {
      throw new AxiosError('Not Found', '404');
    }

    return systemMap[id].members.map((m) => mockMember(m));
  });

  return api;
}
