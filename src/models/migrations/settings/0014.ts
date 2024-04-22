import { z } from 'zod';
import { SettingsV13 } from './0013';

export const SettingsV14 = SettingsV13.extend({
  settings: SettingsV13.shape.settings.extend({
    lookup: z.object({
      memberLayout: z.enum(['list', 'table']).default('list'),
    }),
  }),
});
export type SettingsV14 = z.infer<typeof SettingsV14>;

export function migrateV13ToV14(data: unknown): SettingsV14 {
  const settings = SettingsV13.parse(data);
  return SettingsV14.parse({
    settings: {
      ...settings.settings,
      lookup: {},
    },
    version: 14,
  });
}
