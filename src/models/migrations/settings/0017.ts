import { z } from 'zod';
import { SettingsV16 } from './0016';
import { LOG_MAX_LINES, LOG_MIN_LINES } from 'src/models/Settings';

export const SettingsV17 = SettingsV16.extend({
  settings: SettingsV16.shape.settings.extend({
    log: z
      .object({
        level: z.enum(['debug', 'info', 'warn', 'error']).default('warn'),
        lines: z
          .number()
          .int()
          .min(LOG_MIN_LINES)
          .max(LOG_MAX_LINES)
          .default(100),
      })
      .default({}),
  }),
});
export type SettingsV17 = z.infer<typeof SettingsV17>;

export function migrateV16ToV17(data: unknown): SettingsV17 {
  const settings = SettingsV16.parse(data);
  return SettingsV17.parse({
    ...settings,
    version: 17,
  });
}
