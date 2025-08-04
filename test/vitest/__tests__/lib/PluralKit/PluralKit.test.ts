import { vi, it, describe, expect } from 'vitest';

import { StrictTypedClient } from 'pkapi-ts';
import SystemID from 'pkapi-ts/models/SystemID';

import PluralKit from 'src/lib/PluralKit/PluralKit';

import {
  mockedApi,
  mockFronters,
  mockGroup,
  mockMember,
  mockSystem,
} from 'test/vitest/__tests__/lib/PluralKit/util';

describe('PluralKit', function () {
  it('caches results', async function () {
    const system = {
      id: SystemID.parse('exmpl'),
      own: true,
      members: ['member-1'],
      groups: { 'group-1': ['member-1'] },
      fronters: [],
    };
    const client = mockedApi('fake-token', [system]);
    const spy = vi.spyOn(client, 'getSystemMembers');

    const pk = new PluralKit(client);

    // cache the system members
    await pk.getOwnMembers();

    spy.mockClear();
    await Promise.all([pk.getOwnMembers(), pk.getOwnMembers()]);

    // ApiClient::getMembers should never be called because results should be cached
    expect(spy).not.toHaveBeenCalled();
  });

  it('clears own system data when token gets cleared', async function () {
    const client = new StrictTypedClient('fake-token');
    // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
    vi.spyOn(client, 'getSystem').mockImplementation(async () =>
      mockSystem('exmpl'),
    );
    const pk = new PluralKit(client);

    expect(await pk.getOwnSystem()).toMatchObject({
      id: SystemID.parse('exmpl'),
    });

    console.debug('test, set-token');
    await pk.setToken(null);

    expect(await pk.getOwnSystem()).toBeNull();
  });

  it('clears own system data when new token gets set', async function () {
    const client = new StrictTypedClient();
    // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
    vi.spyOn(client, 'getSystem').mockImplementation(async () =>
      client.getToken()
        ? mockSystem('exmpl', { description: 'private' })
        : mockSystem('exmpl'),
    );
    vi.spyOn(client, 'getSystemMembers').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? [
              mockMember('mempub', {
                system: SystemID.parse('exmpl'),
                description: 'private',
              }),
              mockMember('memprv', {
                system: SystemID.parse('exmpl'),
              }),
            ]
          : [mockMember('mempub', { system: SystemID.parse('exmpl') })],
    );
    vi.spyOn(client, 'getGroups').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? [
              mockGroup('grpub', 'public group', {
                system: SystemID.parse('exmpl'),
                description: 'private',
              }),
              mockGroup('grprv', 'private group', {
                system: SystemID.parse('exmpl'),
              }),
            ]
          : [
              mockGroup('grpub', 'public group', {
                system: SystemID.parse('exmpl'),
              }),
            ],
    );
    vi.spyOn(client, 'getGroupMembers').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async (id) => {
        switch (id) {
          case 'grpub':
            return client.getToken()
              ? [
                  mockMember('mempub', {
                    system: SystemID.parse('exmpl'),
                    description: 'private',
                  }),
                ]
              : [
                  mockMember('mempub', {
                    system: SystemID.parse('exmpl'),
                  }),
                ];
          case 'grprv':
            if (!client.getToken()) {
              throw new Error(`private group without token`);
            }
            return [mockMember('memprv', { system: SystemID.parse('exmpl') })];
          default:
            throw new Error(`unknown group ${id}`);
        }
      },
    );
    vi.spyOn(client, 'getFronters').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? mockFronters(
              '8b5eac7a-b019-416f-a9ad-89f62225a817',
              SystemID.parse('exmpl'),
              ['mempub', 'memprv'],
            )
          : mockFronters(
              '8b5eac7a-b019-416f-a9ad-89f62225a817',
              SystemID.parse('exmpl'),
              ['mempub'],
            ),
    );

    const pk = new PluralKit(client);

    const systemBefore = await pk.getSystem(SystemID.parse('exmpl'));
    const membersBefore = await pk.getMembers(SystemID.parse('exmpl'));
    const frontersBefore = (await pk.getFronters(SystemID.parse('exmpl')))
      .members;
    const groupsBefore = await pk.getGroups(SystemID.parse('exmpl'));
    const groupMembersBefore = await Promise.all(
      groupsBefore.map((g) => pk.getGroupMembers(g.id)),
    );

    await pk.setToken('exmpl-token');

    expect(await pk.getSystem(SystemID.parse('exmpl'))).not.toEqual(
      systemBefore,
    );
    expect(await pk.getMembers(SystemID.parse('exmpl'))).not.toEqual(
      membersBefore,
    );
    expect((await pk.getFronters(SystemID.parse('exmpl'))).members).not.toEqual(
      frontersBefore,
    );
    expect(await pk.getGroups(SystemID.parse('exmpl'))).not.toEqual(
      groupsBefore,
    );
    expect(
      await Promise.all(
        (await pk.getGroups(SystemID.parse('exmpl'))).map((g) =>
          pk.getGroupMembers(g.id),
        ),
      ),
    ).not.toEqual(groupMembersBefore);
  });
});
