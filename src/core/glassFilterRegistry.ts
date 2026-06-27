import {
  glassFilterKey,
  glassFilterMarkup,
  type GlassFilterParams,
} from './displacement'

/* ============================================================================
   A process-wide registry of <filter> elements. Many glass components share
   one hidden <svg><defs> in the document; identical (size + params) filters are
   deduped and reference-counted so we never inject thousands of nodes.
   ========================================================================== */

const SVG_NS = 'http://www.w3.org/2000/svg'

interface Entry {
  id: string
  count: number
  node: SVGFilterElement
}

let root: SVGSVGElement | null = null
let defs: SVGDefsElement | null = null
let seq = 0
const entries = new Map<string, Entry>()

function ensureRoot(): SVGDefsElement | null {
  if (typeof document === 'undefined') return null
  if (defs) return defs

  root = document.createElementNS(SVG_NS, 'svg')
  root.setAttribute('aria-hidden', 'true')
  root.setAttribute('focusable', 'false')
  root.dataset.lkGlassDefs = ''
  // Keep it in the layout but invisible and non-interactive.
  Object.assign(root.style, {
    position: 'absolute',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>)

  defs = document.createElementNS(SVG_NS, 'defs')
  root.appendChild(defs)
  document.body.appendChild(root)
  return defs
}

function parseFilter(markup: string): SVGFilterElement | null {
  const doc = new DOMParser().parseFromString(
    `<svg xmlns="${SVG_NS}">${markup}</svg>`,
    'image/svg+xml',
  )
  const filter = doc.documentElement.firstElementChild
  if (!filter) return null
  return document.importNode(filter, true) as SVGFilterElement
}

/** Acquire (or create) a shared filter; returns its element id. */
export function acquireGlassFilter(params: GlassFilterParams): string | null {
  const target = ensureRoot()
  if (!target) return null

  const key = glassFilterKey(params)
  const existing = entries.get(key)
  if (existing) {
    existing.count += 1
    return existing.id
  }

  const id = `lk-glass-${seq++}`
  const node = parseFilter(glassFilterMarkup(id, params))
  if (!node) return null
  target.appendChild(node)
  entries.set(key, { id, count: 1, node })
  return id
}

/** Release a previously acquired filter; removes it once unused. */
export function releaseGlassFilter(params: GlassFilterParams): void {
  const key = glassFilterKey(params)
  const entry = entries.get(key)
  if (!entry) return
  entry.count -= 1
  if (entry.count <= 0) {
    entry.node.remove()
    entries.delete(key)
  }
}

export type { GlassFilterParams }
