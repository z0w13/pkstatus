import { getVersion } from 'src/models/migrations/util';
import { migrateLegacyToV1 } from './0001';
import { migrateV1ToV2, SystemsV2 } from './0002';

const Migrations = [migrateLegacyToV1, migrateV1ToV2];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): SystemsV2 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return SystemsV2.parse(curData);
}
