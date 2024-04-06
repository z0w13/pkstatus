import { z } from 'zod';
import { SettingsV9 } from './0009';

export const SettingsV10 = SettingsV9.extend({
  settings: SettingsV9.shape.settings.extend({
    status: SettingsV9.shape.settings.shape.status.extend({
      table: SettingsV9.shape.settings.shape.status.shape.table.extend({
        showIcons: z.boolean().default(true),
      }),
    }),
  }),
});
export type SettingsV10 = z.infer<typeof SettingsV10>;

export function migrateV9ToV10(data: unknown): SettingsV10 {
  const settings = SettingsV9.parse(data);
  return SettingsV10.parse({
    ...settings,
    version: 10,
  });
}
