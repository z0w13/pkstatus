import {
  nonEmptyStringOrNull,
  containsPronouns,
  getPronouns,
  stripPronouns,
} from 'src/util';
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

describe('containsPronouns', function () {
  describe('it returns true if text contains pronouns', function () {
    it.each([
      'She/her are my pronouns',
      'Hello my pronouns are he/him',
      "This is xyz, their pronouns are she/them and they're non-binary",
    ])("'%s' == true", (input) => expect(containsPronouns(input)).toBe(true));
  });

  describe('it returns false if text contains no pronouns', function () {
    it.each([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Maecenas at magna faucibus, finibus felis non, aliquet enim.',
      'Vivamus a sapien at diam aliquet eleifend.',
      'Nulla venenatis enim sit amet justo congue, vel rhoncus leo sagittis.',
    ])("'%s' == false", (input) => expect(containsPronouns(input)).toBe(false));
  });
});

describe('getPronouns', function () {
  it('returns null without pronouns in the text', function () {
    expect(getPronouns('Example Name')).toBeNull();
  });

  describe('extracts pronouns from the text', function () {
    it.each([
      { input: 'Foo (She/Her)', expected: 'She/Her' },
      { input: 'Bar [He/They]', expected: 'He/They' },
      { input: 'Baz {They/It}', expected: 'They/It' },
      { input: 'Qux Fae/Faer', expected: 'Fae/Faer' },
    ])('$input -> $expected', ({ input, expected }) =>
      expect(getPronouns(input)).toBe(expected),
    );
  });
});
describe('stripPronouns', function () {
  describe('it returns the string without pronouns', function () {
    it.each([
      { input: 'Foo (She/Her)', expected: 'Foo' },
      { input: 'Bar [He/They]', expected: 'Bar' },
      { input: 'Baz {They/It}', expected: 'Baz' },
      { input: 'Qux Fae/Faer', expected: 'Qux' },
      { input: 'Quux', expected: 'Quux' },
    ])('$input -> $expected', ({ input, expected }) =>
      expect(stripPronouns(input)).toBe(expected),
    );
  });
});
