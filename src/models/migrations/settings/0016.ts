import { z } from 'zod';
import { SettingsV15 } from './0015';

export const SettingsV16 = SettingsV15.extend({
  settings: SettingsV15.shape.settings.extend({
    id: z
      .object({
        sep: z.boolean().default(false),
        caps: z.boolean().default(false),
      })
      .default({}),
  }),
});
export type SettingsV16 = z.infer<typeof SettingsV16>;

export function migrateV15ToV16(data: unknown): SettingsV16 {
  const settings = SettingsV15.parse(data);
  return SettingsV16.parse({
    ...settings,
    version: 16,
  });
}
