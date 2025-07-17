import { describe, expect, it } from 'vitest';

import { isValidUpdateTarget } from 'src/lib/updateChecker';

describe('isValidUpdateTarget', function () {
  it('considers release -> release a valid update target', function () {
    expect(isValidUpdateTarget('1.0.0', '1.1.0')).toBe(true);
  });

  it('considers prerelease -> release a valid update target', function () {
    expect(isValidUpdateTarget('1.0.0-rc1', '1.0.0')).toBe(true);
  });

  it('considers prerelease -> prerelease a valid update target', function () {
    expect(isValidUpdateTarget('1.0.0-rc1', '1.0.0-rc2')).toBe(true);
  });

  it('considers release -> prerelease an invalid update target', function () {
    expect(isValidUpdateTarget('1.0.0', '1.0.0-rc1')).toBe(false);
  });
});
