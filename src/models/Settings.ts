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
          showUpdateTime: z.boolean().default(false),
          showLastSwitch: z.boolean().default(false),
          iconSize: z.number().default(24),
        })
        .default({}),
      list: z
        .object({
          showUpdateTime: z.boolean().default(false),
          showLastSwitch: z.boolean().default(false),
          iconSize: z.number().default(24),
        })
        .default({}),
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