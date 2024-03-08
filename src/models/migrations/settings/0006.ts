import { z } from 'zod';
import { SettingsV5 } from './0005';

export const SettingsV6 = SettingsV5.extend({
  settings: SettingsV5.shape.settings.extend({
    token: z.string().nullable().default(null),
  }),
});
export type SettingsV6 = z.infer<typeof SettingsV6>;

export function migrateV5ToV6(data: unknown): SettingsV6 {
  const settings = SettingsV5.parse(data);
  return SettingsV6.parse({
    ...settings,
    version: 6,
  });
}
