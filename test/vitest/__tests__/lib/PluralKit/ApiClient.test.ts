import axios from 'axios';
import dayjs from 'dayjs';

import { describe, expect, it } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';

import { ManuallyStartedApiClient } from 'test/vitest/__tests__/lib/PluralKit/util';

describe('ApiClient', function () {
  it('uses the correct token for pending requests even if it changes', async function () {
    const axiosInstance = axios.create({});
    const axiosMock = new AxiosMockAdapter(axiosInstance);
    axiosMock
      .onGet('systems/exmpl', {
        headers: expect.objectContaining({ Authorization: 'new-token' }),
      })
      .reply(200, {
        id: 'exmpl',
        uuid: 'uuid-exmpl',
        created: dayjs(0).toISOString(),
      });

    const client = new ManuallyStartedApiClient({
      token: 'fake-token',
      axiosInstance,
    });

    const prom = client.getSystem('exmpl');
    client.setToken('new-token');

    await client.drainQueue();
    const system = await prom;

    expect(system).toMatchObject({ id: 'exmpl' });
  });

  it('prioritizes non-get requests', async function () {
    const axiosInstance = axios.create({});
    const axiosMock = new AxiosMockAdapter(axiosInstance);
    axiosMock.onGet('/systems/exmpl').reply(200, {
      id: 'exmpl',
      uuid: 'uuid-exmpl',
      created: dayjs(0).toISOString(),
    });
    axiosMock.onPost('/systems/exmpl/switches').reply(200, {
      id: 'switch-1',
      timestamp: dayjs(0).toISOString(),
      members: ['member-1', 'member-2'],
    });

    const client = new ManuallyStartedApiClient({
      token: 'fake-token',
      axiosInstance,
    });

    const prom = Promise.all([
      client.request('GET', '/systems/exmpl'),
      client.request('POST', '/systems/exmpl/switches', {
        members: ['member-1', 'member-2'],
      }),
    ]);

    await client.drainQueue();
    await prom;

    expect(axiosMock.history.length).toBe(2);
    expect(axiosMock.history[0].method).toBe('post');
    expect(axiosMock.history[1].method).toBe('get');
  });

  it('deduplicates GET requests', async function () {
    const axiosInstance = axios.create({});
    const axiosMock = new AxiosMockAdapter(axiosInstance);
    axiosMock.onGet('/systems/exmpl').reply(200, {
      id: 'exmpl',
      uuid: 'uuid-exmpl',
      created: dayjs(0).toISOString(),
    });
    const client = new ManuallyStartedApiClient({
      token: 'fake-token',
      axiosInstance,
    });

    const prom = Promise.all([
      client.getSystem('exmpl'),
      client.getSystem('exmpl'),
    ]);

    await client.drainQueue();
    await prom;

    expect(axiosMock.history.length).toBe(1);
  });
});
