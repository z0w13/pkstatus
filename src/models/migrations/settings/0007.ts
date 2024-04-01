import { z } from 'zod';
import { SettingsV6 } from './0006';

export const SettingsV7 = SettingsV6.extend({
  settings: SettingsV6.shape.settings.extend({
    status: SettingsV6.shape.settings.shape.status.extend({
      table: SettingsV6.shape.settings.shape.status.shape.table.extend({
        forceMobileUi: z.boolean().default(false),
      }),
    }),
  }),
});
export type SettingsV7 = z.infer<typeof SettingsV7>;

export function migrateV6ToV7(data: unknown): SettingsV7 {
  const settings = SettingsV6.parse(data);
  return SettingsV7.parse({
    ...settings,
    version: 7,
  });
}
