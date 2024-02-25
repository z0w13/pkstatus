import { z } from 'zod';

export function getVersion(data: unknown): number {
  return z
    .object({
      version: z.number().default(0),
    })
    .parse(data).version;
}
