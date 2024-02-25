import { z } from 'zod';

export const SystemV0 = z.object({
  id: z.string(),
  uuid: z.string(),

  name: z.string().nullish(),
  description: z.string().nullish(),
  tag: z.string().nullish(),
  pronouns: z.string().nullish(),

  avatar_url: z.string().nullish(),
  banner: z.string().nullish(),
  color: z.string().nullish(),

  created: z.string().datetime(),
  privacy: z.object({}).nullish(),

  note: z.string(),
  lastUpdated: z.number(),
});
export type SystemV0 = z.infer<typeof SystemV0>;
