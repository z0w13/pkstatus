import { z } from 'zod';
import { LogV1 } from './0001';

export const LogV2 = LogV1.extend({
  version: z.number(),
  lines: z.array(
    LogV1.shape.lines.element.extend({
      level: z.enum(['debug', 'info', 'warn', 'error']),
    }),
  ),
});
export type LogV2 = z.infer<typeof LogV2>;

export function migrateV1ToV2(data: unknown): LogV2 {
  const log = LogV1.parse(data);
  console.log(log.lines.map((l) => ({ ...l, error: null, stack: null })));
  return LogV2.parse({
    lines: log.lines.map((l) => ({ level: 'warn', ...l })),
    version: 1,
  } satisfies LogV2);
}
