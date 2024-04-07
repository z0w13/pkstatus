import { z } from 'zod';
import { SystemsV1 } from './0001';

export const SystemsV2 = z.object({
  version: z.number(),
  systems: z.array(z.string()),
});
export type SystemsV2 = z.infer<typeof SystemsV2>;

export function migrateV1ToV2(data: unknown): SystemsV2 {
  const systems = SystemsV1.parse(data);

  return SystemsV2.parse({
    version: 2,
    systems: systems.systems.map((m) => m.id),
  });
}
