export type ClassValue = string | false | null | undefined

/** Tiny classname joiner. */
export function cx(...parts: ClassValue[]): string {
  let out = ''
  for (const p of parts) {
    if (!p) continue
    out += out ? ' ' + p : p
  }
  return out
}
