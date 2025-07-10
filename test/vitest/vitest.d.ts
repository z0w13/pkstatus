import 'vitest';

declare module 'vitest' {
  interface Matchers<T = unknown> {
    toResolveAfterAtLeast(value: number): Promise<T>;
  }
}
