import { z } from 'zod';
import { SettingsV3 } from './0003';

export const SettingsV4 = z.object({
  version: z.number(),
  settings: SettingsV3.shape.settings.extend({
    status: SettingsV3.shape.settings.shape.status.extend({
      list: SettingsV3.shape.settings.shape.status.shape.list.extend({
        squareIcons: z.boolean().default(false),
      }),
    }),
  }),
});
export type SettingsV4 = z.infer<typeof SettingsV4>;

export function migrateV3ToV4(data: unknown): SettingsV4 {
  const settings = SettingsV3.parse(data);
  return SettingsV4.parse({
    ...settings,
    version: 4,
  });
}
