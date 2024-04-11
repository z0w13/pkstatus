import dayjs from 'dayjs';

export function nonEmptyStringOrNull(input: unknown): string | null {
  if (typeof input === 'string') {
    return input.trim().length > 0 ? input.trim() : null;
  }

  return null;
}

export function dayjsNull(input: string | null): dayjs.Dayjs | null {
  return input !== null ? dayjs(input) : null;
}

export function isEpochDate(date: Date | dayjs.Dayjs): boolean {
  return date.valueOf() === 0;
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

export function caseInsensitiveIncludes(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

interface GetName {
  getName(stripPronouns: boolean): string;
}
export function getNameSort(stripPronouns: boolean) {
  return function (a: GetName, b: GetName): number {
    return a
      .getName(stripPronouns)
      .toLocaleLowerCase()
      .localeCompare(b.getName(stripPronouns).toLocaleLowerCase());
  };
}
