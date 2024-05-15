import { useServices } from 'src/lib/Services';
import { describe, expect, it } from 'vitest';

describe('Services', function () {
  it('returns the same instance', function () {
    expect(useServices()).toBe(useServices());
  });
});
