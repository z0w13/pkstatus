import { describe, expect, it } from 'vitest';
import { migrate as migrateSystems } from 'src/models/migrations/system/index';
import { migrate as migrateSettings } from 'src/models/migrations/settings/index';
import { Settings } from 'src/models/Settings';
import { z } from 'zod';

const settingsV0 = {
  status: {
    tile: {
      showSystemDescription: false,
      showFronterDescription: false,
      showUpdateTime: true,
      showLastSwitch: true,
      tileSize: 250,
    },
    table: { showUpdateTime: false, showLastSwitch: false, iconSize: 24 },
    list: { showUpdateTime: true, showLastSwitch: true, iconSize: 106 },
  },
  systemUpdateInterval: 23310,
  fronterUpdateInterval: 2040,
  dark: true,
};

const systemsV0 = {
  systems: {
    dfsse: {
      id: 'dfsse',
      uuid: '8b170721-c126-44f3-b2f5-893775eb0a74',
      name: 'System A',
      description: 'Aaaaaa',
      tag: 'A System',
      pronouns: 'He/They',
      avatar_url: 'https://example.com/image.jpg',
      banner: 'https://example.com/banner.jpg',
      color: 'E9AC2D',
      created: '2021-11-02T21:47:10.006Z',
      privacy: null,
      note: '',
      lastUpdated: 1708875067314,
    },
    dufdn: {
      id: 'dufdn',
      uuid: '54049a50-6a26-4573-80e7-2c2b15bb9993',
      name: 'System B',
      description: 'Bbbbbb',
      tag: 'B System',
      pronouns: 'she/they',
      avatar_url: 'https://example.com/image_b.jpg',
      banner: null,
      color: null,
      created: '2022-07-06T21:53:49.236Z',
      privacy: null,
      note: '',
      lastUpdated: 1708875068303,
    },
    timzc: {
      id: 'satqs',
      uuid: '649dfc42-c772-4eb2-af25-2cd812d52a9d',
      name: 'System C',
      description: null,
      tag: null,
      pronouns: null,
      avatar_url: null,
      banner: null,
      color: null,
      created: '2024-02-23T18:51:29.019Z',
      privacy: null,
      note: '',
      lastUpdated: 1708875069334,
    },
  },
};

describe('Test migration system', function () {
  it('Migrates systems successfully', function () {
    z.array(z.string()).parse(migrateSystems(systemsV0).systems);
  });
  it('Migrates settings successfully', function () {
    const migrated = migrateSettings(settingsV0);
    const parsed = Settings.strict().parse(migrated.settings);

    expect(migrated.settings.dark).toBe(settingsV0.dark);
    expect(migrated.version).toBe(16);
    expect(migrated.settings).toStrictEqual(parsed);
  });
});
