import { z } from 'zod';
import { SettingsV7 } from './0007';

export const SettingsV8 = SettingsV7.extend({
  settings: SettingsV7.shape.settings.extend({
    showCardDetails: z.boolean().default(true),
  }),
});
export type SettingsV8 = z.infer<typeof SettingsV8>;

export function migrateV7ToV8(data: unknown): SettingsV8 {
  const settings = SettingsV7.parse(data);
  return SettingsV8.parse({
    ...settings,
    version: 8,
  });
}
