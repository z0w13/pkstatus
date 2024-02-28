import { z } from 'zod';
import { SettingsV0 } from './0000';
import { SettingsV1 } from './0001';

export const SettingsV2 = z.object({
  version: z.number(),
  settings: SettingsV0.extend({
    status: SettingsV0.shape.status.extend({
      table: SettingsV0.shape.status.shape.table.extend({
        verticalPosition: z.enum(['start', 'center', 'end']).default('center'),
        horizontalPosition: z
          .enum(['start', 'center', 'end'])
          .default('center'),
      }),
    }),
  }),
});
export type SettingsV2 = z.infer<typeof SettingsV2>;

export function migrateV1ToV2(data: unknown): SettingsV1 {
  const settings = SettingsV1.parse(data);
  return SettingsV2.parse({
    ...settings,
    version: 2,
  });
}
