import { migrateLegacyToV1 } from './0001';
import { migrateV1ToV2 } from './0002';
import { migrateV2ToV3 } from './0003';
import { getVersion } from 'src/models/migrations/util';
import { SettingsV4, migrateV3ToV4 } from './0004';

const Migrations = [
  migrateLegacyToV1,
  migrateV1ToV2,
  migrateV2ToV3,
  migrateV3ToV4,
];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV4 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV4.parse(curData);
}
