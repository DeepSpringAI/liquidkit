/* ============================================================================
   Does the current browser actually *honour* an SVG `url(#…)` reference inside
   `backdrop-filter`? Chromium (and therefore Electron) does; WebKit/Safari and
   Gecko/Firefox parse it but silently ignore it — they render the plain frosted
   blur regardless. On those engines the whole displacement pipeline (map data
   URI, DOMParser, filter injection) is wasted work, so we skip it and let the
   element fall back to the frosted look it was already showing.

   There is no reliable feature query for this: `CSS.supports('backdrop-filter',
   'url(#x)')` tests *grammar*, not *rendering*, and returns true on Safari and
   Firefox. So we use an engine heuristic with a safe default — when in doubt,
   assume the engine is supported (identical to today's behaviour).
   ========================================================================== */

let cached: boolean | undefined

/**
 * Whether the SVG-displacement glass engine is worth running here. `true` on
 * Chromium/Edge/Opera/Electron; `false` on Safari and Firefox; `true` for any
 * unknown engine and during SSR. Computed once, then memoised.
 */
export function isGlassEngineSupported(): boolean {
  if (cached !== undefined) return cached
  // SSR / non-browser: assume supported and DON'T cache, so the first real
  // browser call computes properly.
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return true
  }
  const ua = navigator.userAgent
  // Chromium-family (incl. Electron, Edge `Edg`, Opera `OPR`) reports "Chrome".
  const isChromium = /Chrome|Chromium|CriOS|Edg|OPR/.test(ua)
  const isFirefox = /Firefox|FxiOS/.test(ua)
  // Safari puts "Safari" in the UA but so does Chrome; exclude Chromium first.
  const isSafari = /Safari/.test(ua) && !isChromium
  // Unknown engines fall through to `true`.
  cached = isChromium ? true : !(isSafari || isFirefox)
  return cached
}

/** Test-only: clear the memoised result so a different UA can be probed. */
export function __resetGlassSupportCache(): void {
  cached = undefined
}
