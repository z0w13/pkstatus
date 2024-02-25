import { SettingsV1, migrateLegacyToV1 } from './0001';
import { getVersion } from 'src/models/migrations/util';

const Migrations = [migrateLegacyToV1];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SettingsV1 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SettingsV1.parse(curData);
}
