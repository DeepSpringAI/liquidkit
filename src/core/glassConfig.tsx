import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

/* ============================================================================
   App-wide glass configuration. One place to tune the Liquid Glass engine for
   the whole tree — chiefly for performance on constrained devices. It is
   entirely optional: `useGlassConfig()` returns sane defaults when no provider
   is mounted, so components work exactly as before without one.
   ========================================================================== */

/**
 * Fidelity tier for the glass engine.
 * - `high` (default) — full fidelity; **identical** to not setting a tier.
 * - `balanced` — drop the 3-pass chromatic dispersion to a single displacement
 *   pass (removes only the rainbow edge fringe; keeps refraction + frost). ~3×
 *   cheaper displacement.
 * - `low` — `balanced` plus reduced blur and refraction, for the weakest
 *   devices. Still glass, just gentler.
 */
export type GlassPerformanceTier = 'high' | 'balanced' | 'low'

export interface GlassConfig {
  /** Fidelity tier. @default 'high' (no visual change) */
  performance: GlassPerformanceTier
  /**
   * Release the GPU-expensive `backdrop-filter` on surfaces scrolled out of the
   * viewport and restore it before they scroll back. Invisible; bounds memory
   * to what's on screen. @default true
   */
  pauseOffscreen: boolean
  /**
   * App-wide refraction override. `true`/`false` forces the engine on/off for
   * every surface; `undefined` defers to each component's own `glass` prop.
   * @default undefined
   */
  glass?: boolean
}

export const DEFAULT_GLASS_CONFIG: GlassConfig = {
  performance: 'high',
  pauseOffscreen: true,
}

// Seeded with defaults so `useContext` returns them when no provider is mounted.
const GlassConfigContext = createContext<GlassConfig>(DEFAULT_GLASS_CONFIG)

export interface GlassConfigProviderProps {
  children: ReactNode
  /** Fidelity tier. @default 'high' */
  performance?: GlassPerformanceTier
  /** Pause off-screen surfaces. @default true */
  pauseOffscreen?: boolean
  /** App-wide refraction override. @default undefined (defer to components) */
  glass?: boolean
}

/**
 * Provide app-wide glass configuration. Optional — omit it and every surface
 * uses {@link DEFAULT_GLASS_CONFIG} (full fidelity). Nesting providers is fine;
 * the nearest one wins.
 */
export function GlassConfigProvider({
  children,
  performance = 'high',
  pauseOffscreen = true,
  glass,
}: GlassConfigProviderProps) {
  const value = useMemo<GlassConfig>(
    () => ({ performance, pauseOffscreen, glass }),
    [performance, pauseOffscreen, glass],
  )
  return <GlassConfigContext.Provider value={value}>{children}</GlassConfigContext.Provider>
}

/** Read the active glass configuration. Never throws; returns defaults with no provider. */
export function useGlassConfig(): GlassConfig {
  return useContext(GlassConfigContext)
}

export interface ResolvedGlassTier {
  scale: number
  dispersion: number
  /** Multiplier to apply to the backdrop blur radius (1 = unchanged). */
  blurScale: number
}

/**
 * Map a `(scale, dispersion)` pair through a performance tier. `high` is the
 * identity — the default path is byte-for-byte unchanged.
 */
export function resolveGlassTier(
  tier: GlassPerformanceTier,
  scale: number,
  dispersion: number,
): ResolvedGlassTier {
  switch (tier) {
    case 'balanced':
      // Single displacement pass (dispersion 0 → the cheap branch), full frost.
      return { scale, dispersion: 0, blurScale: 1 }
    case 'low':
      return { scale: Math.round(scale * 0.8), dispersion: 0, blurScale: 0.75 }
    case 'high':
    default:
      return { scale, dispersion, blurScale: 1 }
  }
}
