import { nonEmptyStringOrNull } from 'src/util';
import { describe, expect, it, test } from 'vitest';

describe('Test nonEmptyStringOrNull', function () {
  describe('returns null on non-string inputs', function () {
    it.each([null, false, {}, 0])('%j == null', (input) =>
      expect(nonEmptyStringOrNull(input)).toBeNull(),
    );
  });
  it('it returns null on empty strings', function () {
    expect(nonEmptyStringOrNull('')).toBeNull();
  });
  describe('it returns null on whitespace only strings', function () {
    test.each([' ', '   ', ' \t ', '\t'])('%j == null', (input) =>
      expect(nonEmptyStringOrNull(input)).toBeNull(),
    );
  });
});
