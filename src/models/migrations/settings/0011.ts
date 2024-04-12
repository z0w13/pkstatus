import { z } from 'zod';
import { SettingsV10 } from './0010';

export const SettingsV11 = SettingsV10.extend({
  settings: SettingsV10.shape.settings.extend({
    checkUpdates: z.boolean().default(true),
    ignoreVersion: z.string().nullable().default(null),
  }),
});
export type SettingsV11 = z.infer<typeof SettingsV11>;

export function migrateV10ToV11(data: unknown): SettingsV11 {
  const settings = SettingsV10.parse(data);
  return SettingsV11.parse({
    ...settings,
    version: 11,
  });
}
