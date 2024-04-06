import { z } from 'zod';
import { SettingsV8 } from './0008';

export const SettingsV9 = SettingsV8.extend({
  settings: SettingsV8.shape.settings.extend({
    status: SettingsV8.shape.settings.shape.status.extend({
      table: SettingsV8.shape.settings.shape.status.shape.table.extend({
        squareIcons: z.boolean().default(true),
      }),
    }),
  }),
});
export type SettingsV9 = z.infer<typeof SettingsV9>;

export function migrateV8ToV9(data: unknown): SettingsV9 {
  const settings = SettingsV8.parse(data);
  return SettingsV9.parse({
    ...settings,
    version: 9,
  });
}
