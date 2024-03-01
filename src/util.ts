export function nonEmptyStringOrNull(input: unknown): string | null {
  if (typeof input === 'string') {
    return input.trim().length > 0 ? input.trim() : null;
  }

  return null;
}

const PronounRegex = new RegExp('(\\w+)\\/(\\w+)');
export function containsPronouns(input: string): boolean {
  return PronounRegex.test(input);
}
