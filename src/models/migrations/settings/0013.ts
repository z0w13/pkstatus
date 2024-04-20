import { z } from 'zod';
import { SettingsV12 } from './0012';

export const SettingsV13 = SettingsV12.extend({
  settings: SettingsV12.shape.settings.extend({
    switcher: SettingsV12.shape.settings.shape.switcher.extend({
      excludeGroups: z.array(z.string()).default([]),
    }),
  }),
});
export type SettingsV13 = z.infer<typeof SettingsV13>;

export function migrateV12ToV13(data: unknown): SettingsV13 {
  const settings = SettingsV12.parse(data);
  return SettingsV13.parse({
    ...settings,
    version: 13,
  });
}
