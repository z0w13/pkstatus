import { z } from 'zod';
import { SettingsV2 } from './0002';

export const SettingsV3 = z.object({
  version: z.number(),
  settings: SettingsV2.shape.settings.extend({
    status: SettingsV2.shape.settings.shape.status.extend({
      lastLayout: z.enum(['table', 'list', 'tile']).default('tile'),
    }),
  }),
});
export type SettingsV3 = z.infer<typeof SettingsV3>;

export function migrateV2ToV3(data: unknown): SettingsV3 {
  const settings = SettingsV2.parse(data);
  return SettingsV3.parse({
    ...settings,
    version: 3,
  });
}
