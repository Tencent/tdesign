export function localeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
