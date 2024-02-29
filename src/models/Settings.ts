import { z } from 'zod';

export const Settings = z.object({
  status: z
    .object({
      tile: z
        .object({
          showSystemDescription: z.boolean().default(false),
          showFronterDescription: z.boolean().default(false),
          showUpdateTime: z.boolean().default(false),
          showLastSwitch: z.boolean().default(false),
          tileSize: z.number().default(250),
        })
        .default({}),
      table: z
        .object({
          verticalPosition: z
            .enum(['start', 'center', 'end'])
            .default('center'),
          horizontalPosition: z
            .enum(['start', 'center', 'end'])
            .default('center'),
          showUpdateTime: z.boolean().default(false),
          showLastSwitch: z.boolean().default(false),
          iconSize: z.number().default(24),
        })
        .default({}),
      list: z
        .object({
          showUpdateTime: z.boolean().default(false),
          showLastSwitch: z.boolean().default(false),
          squareIcons: z.boolean().default(false),
          iconSize: z.number().default(24),
        })
        .default({}),
      lastLayout: z.enum(['table', 'list', 'tile']).default('tile'),
    })
    .default({}),
  systemUpdateInterval: z.number().default(3600),
  fronterUpdateInterval: z.number().default(300),
  dark: z.boolean().default(false),
});
export type Settings = z.infer<typeof Settings>;

export function defaultSettings(): Settings {
  return Settings.parse({});
}
