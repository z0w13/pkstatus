import { vi, expect } from 'vitest';

expect.extend({
  async toResolveAfterAtLeast(
    received: Promise<unknown>,
    timePassedMs: number,
  ) {
    const timeBefore = Date.now();
    let resolvedAt: number | null = null;

    received.then(() => (resolvedAt = Date.now()));
    await vi.advanceTimersToNextTimerAsync();

    if (resolvedAt === null) {
      return {
        pass: false,
        message: () => `expected to resolve, but it never did`,
      };
    }

    const actualTimePassed = resolvedAt - timeBefore;
    if (!resolvedAt || resolvedAt - timeBefore < timePassedMs) {
      return {
        pass: false,
        message: () =>
          `expected to resolve after at least ${timePassedMs}ms, but it resolved in ${actualTimePassed}ms`,
      };
    }

    return {
      pass: true,
      message: () => `resolved after ${actualTimePassed}ms`,
    };
  },
});
