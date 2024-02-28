import { migrateLegacyToV1 } from './0001';
import { migrateV1ToV2 } from './0002';
import { SettingsV3, migrateV2ToV3 } from './0003';
import { getVersion } from 'src/models/migrations/util';

const Migrations = [migrateLegacyToV1, migrateV1ToV2, migrateV2ToV3];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV3 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV3.parse(curData);
}
