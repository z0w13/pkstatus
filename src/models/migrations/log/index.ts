import { getVersion } from 'src/models/migrations/util';

import { LogV1, migrateLegacyToV1 } from './0001';

const Migrations = [migrateLegacyToV1];
export const LatestVersion = Migrations.length;

export function migrate(data: unknown): LogV1 {
  const version = getVersion(data);
  const toApply = Migrations.slice(version);

  let curData = data;
  for (const apply of toApply) {
    curData = apply(curData);
  }

  return LogV1.parse(curData);
}
