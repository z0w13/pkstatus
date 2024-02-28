import { migrateLegacyToV1 } from './0001';
import { SettingsV2, migrateV1ToV2 } from './0002';
import { getVersion } from 'src/models/migrations/util';

const Migrations = [migrateLegacyToV1, migrateV1ToV2];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV2 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV2.parse(curData);
}
