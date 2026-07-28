import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

/* ============================================================================
   App-wide glass configuration. One place to tune the Liquid Glass surface for
   the whole tree — chiefly for performance on constrained devices. It is
   entirely optional: `useGlassConfig()` returns sane defaults when no provider
   is mounted, so components work exactly as before without one.
   ========================================================================== */

/**
 * Fidelity tier for glass surfaces.
 * - `high` (default) — full frost; **identical** to not setting a tier.
 * - `balanced` — same as `high` today. Kept so existing code keeps working and
 *   so there is a middle rung to tune again later.
 * - `low` — reduced blur radius, for the weakest devices. Still glass, just
 *   gentler (and a much cheaper composite).
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
   * @deprecated No longer does anything. It switched the SVG displacement engine
   * on or off app-wide, and that engine has been removed.
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
  /** @deprecated No longer does anything — the displacement engine was removed. */
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
  /** Multiplier to apply to the backdrop blur radius (1 = unchanged). */
  blurScale: number
}

/**
 * Map a performance tier to its blur multiplier. `high` is the identity — the
 * default path is byte-for-byte unchanged.
 */
export function resolveGlassTier(tier: GlassPerformanceTier): ResolvedGlassTier {
  return { blurScale: tier === 'low' ? 0.75 : 1 }
}
