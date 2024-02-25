import { z } from 'zod';
import dayjs from 'dayjs';
import { SystemV0 } from './0000';

export const SystemV1 = z.object({
  id: z.string(),
  uuid: z.string(),

  name: z.string().default(''),
  description: z.string().default(''),
  tag: z.string().default(''),
  pronouns: z.string().default(''),

  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  color: z.string().nullable(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type SystemV1 = z.infer<typeof SystemV1>;

export const SystemsV1 = z.object({
  version: z.number(),
  systems: z.array(SystemV1),
});
export type SystemsV1 = z.infer<typeof SystemsV1>;

export function migrateLegacyToV1(data: unknown): SystemsV1 {
  const systems = z.object({ systems: z.record(SystemV0) }).parse(data).systems;
  return {
    version: 1,
    systems: Object.values(systems).map((sys) =>
      SystemV1.parse({
        id: sys.id,
        uuid: sys.uuid,

        name: sys.name || '',
        description: sys.description || '',
        tag: sys.tag || '',
        pronouns: sys.pronouns || '',

        avatarUrl: sys.avatar_url || null,
        bannerUrl: sys.banner || null,
        color: sys.color || null,

        createdAt: dayjs(sys.created).toISOString(),
        updatedAt: dayjs(sys.lastUpdated).toISOString(),
      }),
    ),
  };
}
