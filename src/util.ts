export function nonEmptyStringOrNull(input: unknown): string | null {
  if (typeof input === 'string') {
    return input.trim().length > 0 ? input.trim() : null;
  }

  return null;
}
