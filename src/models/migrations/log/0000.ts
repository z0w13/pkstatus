import { z } from 'zod';

export const LogV0 = z.object({
  lines: z.array(
    z.object({
      message: z.string(),
      time: z.number(),
    }),
  ),
});
export type LogV0 = z.infer<typeof LogV0>;
