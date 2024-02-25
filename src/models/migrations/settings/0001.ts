import { z } from 'zod';
import { SettingsV0 } from './0000';

export const SettingsV1 = z.object({
  version: z.number(),
  settings: SettingsV0,
});
export type SettingsV1 = z.infer<typeof SettingsV1>;

export function migrateLegacyToV1(data: unknown): SettingsV1 {
  const settings = SettingsV0.parse(data);
  return SettingsV1.parse({
    settings,
    version: 1,
  });
}
