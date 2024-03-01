export function nonEmptyStringOrNull(input: unknown): string | null {
  if (typeof input === 'string') {
    return input.trim().length > 0 ? input.trim() : null;
  }

  return null;
}

const PronounRegex = new RegExp('(\\w+\\/\\w+)');
export function containsPronouns(input: string): boolean {
  return PronounRegex.test(input);
}

export function getPronouns(input: string): string | null {
  return PronounRegex.exec(input)?.at(0) || null;
}

const WrappedPronounsRegex = new RegExp(
  '([\\[\\{\\(]?)' + PronounRegex.source + '([\\)\\]\\}]?)',
  'g',
);
export function stripPronouns(input: string): string {
  return input.replaceAll(WrappedPronounsRegex, '').trim();
}
