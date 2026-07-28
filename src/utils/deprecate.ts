const warned = new Set<string>()

/**
 * Warn once per message, in development only. Bundlers drop the whole call in
 * production builds because the `process.env.NODE_ENV` check folds to `false`.
 */
export function warnDeprecated(key: string, message: string): void {
  if (process.env.NODE_ENV === 'production') return
  if (warned.has(key)) return
  warned.add(key)
  console.warn(`[liquidkit] ${message}`)
}

/** Test seam: forget which warnings have already fired. */
export function __resetDeprecationWarnings(): void {
  warned.clear()
}
