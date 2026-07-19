/* ============================================================================
   Liquid Glass refraction — SVG filter generation.

   The trick: a `feDisplacementMap` bends the element's *backdrop* using a
   generated displacement map. In the map the Red channel encodes horizontal
   shift and Green encodes vertical shift, where 128 == "no displacement".
   The map is flat (128,128) through the interior and ramps toward the rim
   inside a `bezel` band, so the backdrop only refracts near the edges — the
   convex-lens look of real glass.

   Chromatic dispersion (the rainbow fringe) is produced by displacing the R,
   G and B channels of the backdrop by slightly different amounts and
   recombining them.
   ========================================================================== */

export interface DisplacementMapOptions {
  width: number
  height: number
  /** px width of the refracting edge band */
  bezel: number
}

export interface GlassFilterParams extends DisplacementMapOptions {
  /** refraction strength (feDisplacementMap scale) */
  scale: number
  /** chromatic dispersion split in px; 0 disables the 3-channel pass */
  dispersion: number
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/**
 * Build the R/G displacement map as an `data:image/svg+xml` URI.
 * Red ramps 0→128→128→255 across X (edge-concentrated); Green does the same
 * across Y. Screen-blending the two channels yields rgb(x, y, 0).
 */
export function displacementMapDataUri(opts: DisplacementMapOptions): string {
  const { width: w, height: h } = opts
  const bx = clamp(opts.bezel / Math.max(w, 1), 0.001, 0.49).toFixed(4)
  const by = clamp(opts.bezel / Math.max(h, 1), 0.001, 0.49).toFixed(4)
  const ex = (1 - parseFloat(bx)).toFixed(4)
  const ey = (1 - parseFloat(by)).toFixed(4)

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs>` +
    `<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="rgb(0,0,0)"/>` +
    `<stop offset="${bx}" stop-color="rgb(128,0,0)"/>` +
    `<stop offset="${ex}" stop-color="rgb(128,0,0)"/>` +
    `<stop offset="1" stop-color="rgb(255,0,0)"/>` +
    `</linearGradient>` +
    `<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="rgb(0,0,0)"/>` +
    `<stop offset="${by}" stop-color="rgb(0,128,0)"/>` +
    `<stop offset="${ey}" stop-color="rgb(0,128,0)"/>` +
    `<stop offset="1" stop-color="rgb(0,255,0)"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="${w}" height="${h}" fill="url(#x)"/>` +
    `<rect width="${w}" height="${h}" fill="url(#y)" style="mix-blend-mode:screen"/>` +
    `</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Build the `<filter>` markup (string) for a glass element of the given size.
 * Caller injects this into a shared <svg><defs> and references `#${id}` from
 * `backdrop-filter: url(#id)`.
 */
export function glassFilterMarkup(id: string, p: GlassFilterParams): string {
  const map = displacementMapDataUri(p)
  const feImage =
    `<feImage href="${map}" x="0" y="0" width="${p.width}" height="${p.height}" ` +
    `result="map" preserveAspectRatio="none"/>`

  let body: string
  if (p.dispersion > 0) {
    const s = p.scale
    const d = p.dispersion
    const keepR = '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
    const keepG = '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'
    const keepB = '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
    body =
      feImage +
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s + d}" xChannelSelector="R" yChannelSelector="G" result="dR"/>` +
      `<feColorMatrix in="dR" type="matrix" values="${keepR}" result="R"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s}" xChannelSelector="R" yChannelSelector="G" result="dG"/>` +
      `<feColorMatrix in="dG" type="matrix" values="${keepG}" result="G"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s - d}" xChannelSelector="R" yChannelSelector="G" result="dB"/>` +
      `<feColorMatrix in="dB" type="matrix" values="${keepB}" result="B"/>` +
      `<feBlend in="R" in2="G" mode="screen" result="RG"/>` +
      `<feBlend in="RG" in2="B" mode="screen"/>`
  } else {
    body =
      feImage +
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${p.scale}" xChannelSelector="R" yChannelSelector="G"/>`
  }

  // Size-aware filter region. `feDisplacementMap` shifts the backdrop by at most
  // ~(scale+dispersion)/2 px and the frost blur reaches a little further, so a
  // margin of `scale + dispersion + K` px on each side fully contains the output.
  // Expressed as a fraction of the box (objectBoundingBox — immune to the
  // content-box/padding-box gap that a px `userSpaceOnUse` region would clip),
  // clamped to the previous 0.35 so small/heavy surfaces keep the old 170% region
  // exactly while large panels shrink toward ~110% — a much smaller GPU texture.
  const K = 4
  const marginX = clamp((p.scale + p.dispersion + K) / Math.max(p.width, 1), 0.001, 0.35)
  const marginY = clamp((p.scale + p.dispersion + K) / Math.max(p.height, 1), 0.001, 0.35)
  const x = (-marginX * 100).toFixed(3)
  const y = (-marginY * 100).toFixed(3)
  const w = (100 + 200 * marginX).toFixed(3)
  const h = (100 + 200 * marginY).toFixed(3)

  // sRGB so 128 stays the neutral midpoint; userSpaceOnUse so px sizes match.
  return (
    `<filter id="${id}" color-interpolation-filters="sRGB" ` +
    `x="${x}%" y="${y}%" width="${w}%" height="${h}%" ` +
    `filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">${body}</filter>`
  )
}

/** Stable cache key for a set of filter params. */
export function glassFilterKey(p: GlassFilterParams): string {
  return `${p.width}x${p.height}_b${p.bezel}_s${p.scale}_d${p.dispersion}`
}
