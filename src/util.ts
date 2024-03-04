export function nonEmptyStringOrNull(input: unknown): string | null {
  if (typeof input === 'string') {
    return input.trim().length > 0 ? input.trim() : null;
  }

  return null;
}

const PronounRegex = new RegExp(
  '[\\{\\[\\(\\<](?<pronouns>\\w+\\/\\w+)[\\>\\)\\}\\]]',
);
export function containsPronouns(input: string): boolean {
  return PronounRegex.test(input);
}

export function getPronouns(input: string): string | null {
  return PronounRegex.exec(input)?.groups?.pronouns || null;
}

export function stripPronouns(input: string, delimiter = ''): string {
  const regex = new RegExp(PronounRegex, 'g');
  const replaced = input.replaceAll(regex, delimiter).trim();

  if (delimiter.length > 0 && replaced.endsWith(delimiter)) {
    return replaced.slice(0, -delimiter.length).trim();
  }

  return replaced;
}
