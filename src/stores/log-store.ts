import { z } from 'zod';
import { defineStore, StateTree } from 'pinia';

import { LatestVersion, migrate } from 'src/models/migrations/log';

const STORE_NAME = 'log';

export const LogEntry = z.object({
  message: z.string(),
  error: z.nullable(z.string()),
  stack: z.nullable(z.string()),
  time: z.number(),
});
export type LogEntry = z.infer<typeof LogEntry>;

const State = z.object({
  lines: z.array(LogEntry),
});
type State = z.infer<typeof State>;

export const useLogStore = defineStore(STORE_NAME, {
  state: (): State => ({
    lines: [],
  }),
  actions: {
    log(message: string, error: string | null, stack: string | null) {
      while (this.lines.length > 50) {
        this.lines.shift();
      }
      this.lines.push({
        message,
        error,
        stack,
        time: new Date().valueOf(),
      });
    },
    clear() {
      this.lines = [];
    },
  },
  persist: {
    serializer: {
      serialize: function (value: StateTree): string {
        return JSON.stringify({
          version: LatestVersion,
          lines: value.lines,
        });
      },

      deserialize: function (value: string): State {
        return State.parse({ lines: migrate(JSON.parse(value)).lines });
      },
    },
    afterHydrate: (ctx) => ctx.store.$persist(),
  },
});
