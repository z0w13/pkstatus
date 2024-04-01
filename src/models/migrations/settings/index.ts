import { migrateLegacyToV1 } from './0001';
import { migrateV1ToV2 } from './0002';
import { migrateV2ToV3 } from './0003';
import { migrateV3ToV4 } from './0004';
import { migrateV4ToV5 } from './0005';
import { migrateV5ToV6 } from './0006';
import { migrateV6ToV7 } from './0007';
import { migrateV7ToV8, SettingsV8 } from './0008';
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
];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV8 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV8.parse(curData);
}
