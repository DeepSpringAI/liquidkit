import { forwardRef, memo } from 'react'
import type { AllHTMLAttributes, CSSProperties, ElementType } from 'react'
import { cx } from '../utils/cx'
import { mergeRefs } from '../utils/mergeRefs'
import { useInView } from '../utils/useInView'
import { useGlassFilter } from './useGlassFilter'
import { useGlassConfig, resolveGlassTier } from './glassConfig'
import { isGlassEngineSupported } from './glassSupport'
import './LiquidGlass.css'

export type GlassTint = 'auto' | 'light' | 'dark' | 'clear' | 'accent'
export type GlassMaterial = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'clear'

export interface LiquidGlassProps extends Omit<AllHTMLAttributes<HTMLElement>, 'as'> {
  /** Element/component to render as. @default 'div' */
  as?: ElementType
  /**
   * Apple-style material thickness — sets the frost (blur) and auto-tint
   * opacity. `clear` is the most transparent, `thick` the most opaque.
   * Composes with `tint` (which controls color). Omit to use the base tokens.
   */
  material?: GlassMaterial
  /** Corner radius in px. @default 22 */
  radius?: number
  /** Fully rounded (pill / circle). Overrides `radius`. */
  pill?: boolean
  /** Backdrop blur in px. Overrides `material`. Defaults to the `--lk-glass-blur` token. */
  blur?: number
  /** Refraction strength (displacement scale). @default 46 */
  refraction?: number
  /** Chromatic dispersion split in px; 0 disables the rainbow fringe. @default 5 */
  dispersion?: number
  /** Width of the refracting edge band in px. @default 14 */
  bezel?: number
  /** Surface tint. @default 'auto' */
  tint?: GlassTint
  /** Drop-shadow depth. @default 2 */
  elevation?: 0 | 1 | 2 | 3
  /** Diagonal specular sheen. @default true */
  sheen?: boolean
  /** Enable true refraction. When false, falls back to a frosted blur. @default true */
  glass?: boolean
  /** Add hover/press affordance. */
  interactive?: boolean
}

const DEFAULT = {
  radius: 28,
  bezel: 14,
  refraction: 46,
  dispersion: 2,
} as const

const LiquidGlassInner = forwardRef<HTMLElement, LiquidGlassProps>(function LiquidGlass(
  {
    as: Comp = 'div',
    material,
    radius = DEFAULT.radius,
    pill = false,
    blur,
    refraction = DEFAULT.refraction,
    dispersion = DEFAULT.dispersion,
    bezel = DEFAULT.bezel,
    tint = 'auto',
    elevation = 2,
    sheen = true,
    glass = true,
    interactive = false,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const config = useGlassConfig()
  // App-wide override (if any) wins over the per-instance prop; the capability
  // gate skips the SVG engine on browsers that ignore url() backdrop-filters
  // (they keep the frosted fallback they already showed). The performance tier
  // is the identity at the default 'high', so nothing changes unless opted in.
  const glassOn = (config.glass ?? glass) && isGlassEngineSupported()
  const tier = resolveGlassTier(config.performance, refraction, dispersion)

  // Pause the (GPU-expensive) backdrop-filter while scrolled out of view.
  const [inView, inViewRef] = useInView<HTMLElement>(config.pauseOffscreen)

  const { ref, filterUrl } = useGlassFilter<HTMLElement>({
    enabled: glassOn && inView,
    bezel,
    scale: tier.scale,
    dispersion: tier.dispersion,
  })

  const blurBase = blur != null ? `${blur}px` : 'var(--lk-glass-blur)'
  const blurCss = tier.blurScale === 1 ? blurBase : `calc(${blurBase} * ${tier.blurScale})`
  // Off-screen surfaces drop the whole backdrop-filter (freeing the GPU texture);
  // clearing to '' would fall back to the CSS blur and keep the texture alive.
  const backdrop = inView
    ? [
        filterUrl,
        `blur(${blurCss})`,
        'saturate(var(--lk-glass-saturate))',
        'brightness(var(--lk-glass-brightness))',
      ]
        .filter(Boolean)
        .join(' ')
    : 'none'

  return (
    <Comp
      ref={mergeRefs(forwardedRef, ref, inViewRef)}
      className={cx('lk-glass', interactive && 'lk-glass--interactive', className)}
      data-tint={tint}
      data-material={material}
      data-elevation={elevation}
      style={{ borderRadius: pill ? 999 : radius, ...style }}
      {...rest}
    >
      <span
        className="lk-glass__refraction"
        aria-hidden="true"
        style={
          {
            backdropFilter: backdrop,
            WebkitBackdropFilter: backdrop,
          } as CSSProperties
        }
      />
      <span className="lk-glass__tint" aria-hidden="true" />
      <span className="lk-glass__bevel" aria-hidden="true" />
      {sheen && <span className="lk-glass__sheen" aria-hidden="true" />}
      <span className="lk-glass__content">{children}</span>
    </Comp>
  )
})
LiquidGlassInner.displayName = 'LiquidGlass'

/**
 * The core Liquid Glass surface. Renders a translucent element that refracts
 * and disperses whatever is behind it, with a specular bevel and sheen. Every
 * other LiquidKit component composes this primitive.
 *
 * Memoized so a parent re-render doesn't cascade into every glass surface on
 * the page (each one rebuilds a backdrop-filter — the expensive part).
 */
export const LiquidGlass = memo(LiquidGlassInner)
