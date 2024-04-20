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
          squareIcons: z.boolean().default(true),
          showIcons: z.boolean().default(true),
          forceMobileUi: z.boolean().default(false),
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
  switcher: z
    .object({
      lastSortMethod: z.enum(['by-name', 'by-last-message']).default('by-name'),
      excludeGroups: z.array(z.string()).default([]),
    })
    .default({}),
  systemUpdateInterval: z.number().default(3600),
  fronterUpdateInterval: z.number().default(300),
  detectPronouns: z.boolean().default(true),
  showCardDetails: z.boolean().default(true),
  checkUpdates: z.boolean().default(true),
  ignoreVersion: z.string().nullable().default(null),
  token: z.string().nullable().default(null),
  dark: z.boolean().default(false),
});
export type Settings = z.infer<typeof Settings>;

export function defaultSettings(): Settings {
  return Settings.parse({});
}
