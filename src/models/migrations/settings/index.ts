import { migrateLegacyToV1 } from './0001';
import { migrateV1ToV2 } from './0002';
import { migrateV2ToV3 } from './0003';
import { migrateV3ToV4 } from './0004';
import { migrateV4ToV5 } from './0005';
import { migrateV5ToV6 } from './0006';
import { migrateV6ToV7 } from './0007';
import { migrateV7ToV8 } from './0008';
import { migrateV8ToV9 } from './0009';
import { migrateV9ToV10 } from './0010';
import { migrateV10ToV11 } from './0011';
import { migrateV11ToV12 } from './0012';
import { migrateV12ToV13, SettingsV13 } from './0013';
import { getVersion } from 'src/models/migrations/util';

const Migrations = [
  migrateLegacyToV1,
  migrateV1ToV2,
  migrateV2ToV3,
  migrateV3ToV4,
  migrateV4ToV5,
  migrateV5ToV6,
  migrateV6ToV7,
  migrateV7ToV8,
  migrateV8ToV9,
  migrateV9ToV10,
  migrateV10ToV11,
  migrateV11ToV12,
  migrateV12ToV13,
];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV13 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV13.parse(curData);
}
