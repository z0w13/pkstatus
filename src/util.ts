import dayjs from 'dayjs';

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { version } from '../package.json';
import { APIError } from 'pkapi.js';

export function isDev(): boolean {
  return (process.env.DEV as unknown as boolean) || version.includes('-dev');
}
export function getVersion(): string {
  const append = isDev() && !version.includes('-dev') ? '-dev' : '';
  return 'v' + version + append;
}

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

export interface FormatIdOpts {
  sep?: boolean;
  caps?: boolean;
}
export function formatId(id: string, { sep, caps }: FormatIdOpts = {}): string {
  id = caps ? id.toUpperCase() : id.toLowerCase();

  if (id.length == 7 && id.at(3) == '-') {
    return sep ? id : id.replace('-', '');
  }

  if (id.length == 6 && sep) {
    return `${id.substring(0, 3)}-${id.substring(3, 6)}`;
  }

  if (id.length == 5 || id.length == 6) {
    return id;
  }

  throw new Error(
    `PluralKit ID is either 5 or 6 characters long, ${id} is ${id.length} characters long`,
  );
}

export function is404(e: unknown): e is APIError {
  return e instanceof APIError && e.status == '404';
}
