import { z } from 'zod';
import { SettingsV14 } from './0014';

export const SettingsV15 = SettingsV14.extend({
  settings: SettingsV14.shape.settings.extend({
    lookup: SettingsV14.shape.settings.shape.lookup.extend({
      colorAccent: z.boolean().default(true),
    }),
  }),
});
export type SettingsV15 = z.infer<typeof SettingsV15>;

export function migrateV14ToV15(data: unknown): SettingsV15 {
  const settings = SettingsV14.parse(data);
  return SettingsV15.parse({
    ...settings,
    version: 15,
  });
}
