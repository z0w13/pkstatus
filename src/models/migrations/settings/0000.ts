import { z } from 'zod';

export const SettingsV0 = z.object({
  status: z.object({
    tile: z.object({
      showSystemDescription: z.boolean(),
      showFronterDescription: z.boolean(),
      showUpdateTime: z.boolean(),
      showLastSwitch: z.boolean(),
      tileSize: z.number(),
    }),
    table: z.object({
      showUpdateTime: z.boolean(),
      showLastSwitch: z.boolean(),
      iconSize: z.number(),
    }),
    list: z.object({
      showUpdateTime: z.boolean(),
      showLastSwitch: z.boolean(),
      iconSize: z.number(),
    }),
  }),
  systemUpdateInterval: z.number(),
  fronterUpdateInterval: z.number(),
  dark: z.boolean(),
});
export type SettingsV0 = z.infer<typeof SettingsV0>;
