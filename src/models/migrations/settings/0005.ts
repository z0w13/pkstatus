import { z } from 'zod';
import { SettingsV4 } from './0004';

export const SettingsV5 = SettingsV4.extend({
  settings: SettingsV4.shape.settings.extend({
    detectPronouns: z.boolean().default(true),
  }),
});
export type SettingsV5 = z.infer<typeof SettingsV5>;

export function migrateV4ToV5(data: unknown): SettingsV5 {
  const settings = SettingsV4.parse(data);
  return SettingsV5.parse({
    ...settings,
    version: 5,
  });
}
