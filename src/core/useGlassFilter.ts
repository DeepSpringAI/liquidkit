import { useEffect, useState } from 'react'
import { useSize } from '../utils/useSize'
import { acquireGlassFilter, releaseGlassFilter } from './glassFilterRegistry'
import { quantizeSize } from './quantize'
import type { GlassFilterParams } from './displacement'

export interface UseGlassFilterOptions {
  enabled?: boolean
  bezel: number
  scale: number
  dispersion: number
}

export interface UseGlassFilterResult<T extends HTMLElement> {
  /** Attach to the glass element so its size can be tracked. */
  ref: (node: T | null) => void
  /** `url(#id)` to drop into `backdrop-filter`, or null when not ready. */
  filterUrl: string | null
}

/**
 * Tracks an element's size and maintains a matching refraction filter in the
 * shared registry. Returns a callback ref + the `url(#…)` to apply.
 */
export function useGlassFilter<T extends HTMLElement = HTMLElement>(
  opts: UseGlassFilterOptions,
): UseGlassFilterResult<T> {
  const { enabled = true, bezel, scale, dispersion } = opts
  const [size, ref] = useSize<T>()
  const [filterId, setFilterId] = useState<string | null>(null)

  const w = size?.width ?? 0
  const h = size?.height ?? 0
  const ready = enabled && w >= 2 && h >= 2

  // Bucket the size so many near-identical surfaces share one cached <filter>
  // and a sub-bucket resize doesn't re-acquire. Quantize only once ready, so
  // the raw <2px guard above still gates unmeasured/zero-size elements.
  const qw = ready ? quantizeSize(w) : 0
  const qh = ready ? quantizeSize(h) : 0

  useEffect(() => {
    if (!ready) {
      setFilterId(null)
      return
    }
    const params: GlassFilterParams = { width: qw, height: qh, bezel, scale, dispersion }
    const id = acquireGlassFilter(params)
    setFilterId(id)
    return () => releaseGlassFilter(params)
  }, [ready, qw, qh, bezel, scale, dispersion])

  return {
    ref,
    filterUrl: enabled && filterId ? `url(#${filterId})` : null,
  }
}
