import { z } from 'zod';
import { LogV0 } from './0000';

export const LogV1 = LogV0.extend({
  version: z.number(),
  lines: z.array(
    LogV0.shape.lines.element.extend({
      error: z.nullable(z.string()),
      stack: z.nullable(z.string()),
    }),
  ),
});
export type LogV1 = z.infer<typeof LogV1>;

export function migrateLegacyToV1(data: unknown): LogV1 {
  const log = LogV0.parse(data);
  console.log(log.lines.map((l) => ({ ...l, error: null, stack: null })));
  return LogV1.parse({
    lines: log.lines.map((l) => ({ ...l, error: null, stack: null })),
    version: 1,
  } satisfies LogV1);
}
