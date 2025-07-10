import { vi, it, describe, expect } from 'vitest';

import ApiClient from 'src/lib/PluralKit/ApiClient';
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
      id: 'exmpl',
      own: true,
      members: ['member-1'],
      groups: { 'group-1': ['member-1'] },
      fronters: [],
    };
    const client = mockedApi('fake-token', [system]);
    const spy = vi.spyOn(client, 'getMembers');

    const pk = new PluralKit(client);

    // cache the system members
    await pk.getOwnMembers();

    spy.mockClear();
    await Promise.all([pk.getOwnMembers(), pk.getOwnMembers()]);

    // ApiClient::getMembers should never be called because results should be cached
    expect(spy).not.toHaveBeenCalled();
  });

  it('clears own system data when token gets cleared', async function () {
    const client = new ApiClient({ token: 'fake-token' });
    // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
    vi.spyOn(client, 'getSystem').mockImplementation(async () =>
      mockSystem('exmpl'),
    );
    const pk = new PluralKit(client);

    expect(await pk.getOwnSystem()).toMatchObject({ id: 'exmpl' });

    console.debug('test, set-token');
    await pk.setToken(null);

    expect(await pk.getOwnSystem()).toBeNull();
  });

  it('clears own system data when new token gets set', async function () {
    const client = new ApiClient();
    // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
    vi.spyOn(client, 'getSystem').mockImplementation(async () =>
      client.getToken()
        ? mockSystem('exmpl', { description: 'private' })
        : mockSystem('exmpl'),
    );
    vi.spyOn(client, 'getMembers').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? [
              mockMember('member-publ', {
                system: 'exmpl',
                description: 'private',
              }),
              mockMember('member-priv', {
                system: 'exmpl',
              }),
            ]
          : [mockMember('member-publ', { system: 'exmpl' })],
    );
    vi.spyOn(client, 'getGroups').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? [
              mockGroup('group-publ', {
                system: 'exmpl',
                description: 'private',
              }),
              mockGroup('group-priv', { system: 'exmpl' }),
            ]
          : [mockGroup('group-publ', { system: 'exmpl' })],
    );
    vi.spyOn(client, 'getGroupMembers').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async (id) => {
        switch (id) {
          case 'group-publ':
            return client.getToken()
              ? [
                  mockMember('member-publ', {
                    system: 'exmpl',
                    description: 'private',
                  }),
                ]
              : [mockMember('member-publ', { system: 'exmpl' })];
          case 'group-priv':
            if (!client.getToken()) {
              throw new Error(`private group without token`);
            }
            return [mockMember('member-priv', { system: 'exmpl' })];
          default:
            throw new Error(`unknown group ${id}`);
        }
      },
    );
    vi.spyOn(client, 'getFronters').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await -- base method is async
      async () =>
        client.getToken()
          ? mockFronters('fronters-1', 'exmpl', ['member-publ', 'member-priv'])
          : mockFronters('fronters-1', 'exmpl', ['member-publ']),
    );

    const pk = new PluralKit(client);

    const systemBefore = await pk.getSystem('exmpl');
    const membersBefore = await pk.getMembers('exmpl');
    const frontersBefore = (await pk.getFronters('exmpl')).members;
    const groupsBefore = await pk.getGroups('exmpl');
    const groupMembersBefore = await Promise.all(
      groupsBefore.map((g) => pk.getGroupMembers(g.id)),
    );

    await pk.setToken('exmpl-token');

    expect(await pk.getSystem('exmpl')).not.toEqual(systemBefore);
    expect(await pk.getMembers('exmpl')).not.toEqual(membersBefore);
    expect((await pk.getFronters('exmpl')).members).not.toEqual(frontersBefore);
    expect(await pk.getGroups('exmpl')).not.toEqual(groupsBefore);
    expect(
      await Promise.all(
        (await pk.getGroups('exmpl')).map((g) => pk.getGroupMembers(g.id)),
      ),
    ).not.toEqual(groupMembersBefore);
  });
});
