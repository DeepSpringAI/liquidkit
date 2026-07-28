import { forwardRef, memo, useMemo } from 'react'
import type { AllHTMLAttributes, CSSProperties, ElementType } from 'react'
import { cx } from '../utils/cx'
import { mergeRefs } from '../utils/mergeRefs'
import { useInView } from '../utils/useInView'
import { warnDeprecated } from '../utils/deprecate'
import { useGlassConfig, resolveGlassTier } from './glassConfig'
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
  /** Corner radius in px. @default 28 */
  radius?: number
  /** Fully rounded (pill / circle). Overrides `radius`. */
  pill?: boolean
  /** Backdrop blur in px. Overrides `material`. Defaults to the `--lk-glass-blur` token. */
  blur?: number
  /** Surface tint. @default 'auto' */
  tint?: GlassTint
  /** Drop-shadow depth. @default 2 */
  elevation?: 0 | 1 | 2 | 3
  /** Diagonal specular sheen. @default true */
  sheen?: boolean
  /** Add hover/press affordance. */
  interactive?: boolean
  /**
   * @deprecated No longer does anything. The SVG displacement engine was removed
   * — glass surfaces are a frosted blur. Safe to delete; will be removed in the
   * next major.
   */
  refraction?: number
  /** @deprecated No longer does anything. See {@link LiquidGlassProps.refraction}. */
  dispersion?: number
  /** @deprecated No longer does anything. See {@link LiquidGlassProps.refraction}. */
  bezel?: number
  /** @deprecated No longer does anything. See {@link LiquidGlassProps.refraction}. */
  glass?: boolean
}

const DEFAULT_RADIUS = 28

const LiquidGlassInner = forwardRef<HTMLElement, LiquidGlassProps>(function LiquidGlass(
  {
    as: Comp = 'div',
    material,
    radius = DEFAULT_RADIUS,
    pill = false,
    blur,
    tint = 'auto',
    elevation = 2,
    sheen = true,
    interactive = false,
    refraction,
    dispersion,
    bezel,
    glass,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  if (refraction != null || dispersion != null || bezel != null || glass != null) {
    warnDeprecated(
      'refraction-props',
      'The `refraction`, `dispersion`, `bezel` and `glass` props no longer do anything — ' +
        'the displacement engine was removed and glass surfaces render as a frosted blur. ' +
        'Remove them; they will be deleted in the next major.',
    )
  }

  const config = useGlassConfig()
  const tier = resolveGlassTier(config.performance)

  // Pause the (GPU-expensive) backdrop-filter while scrolled out of view.
  const [inView, inViewRef] = useInView<HTMLElement>(config.pauseOffscreen)

  const blurBase = blur != null ? `${blur}px` : 'var(--lk-glass-blur)'
  const blurCss = tier.blurScale === 1 ? blurBase : `calc(${blurBase} * ${tier.blurScale})`
  // Off-screen surfaces drop the whole backdrop-filter (freeing the GPU texture);
  // clearing to '' would fall back to the CSS blur and keep the texture alive.
  const backdrop = inView
    ? `blur(${blurCss}) saturate(var(--lk-glass-saturate)) brightness(var(--lk-glass-brightness))`
    : 'none'

  // Memoised so the callback ref keeps ONE identity across renders. An inline `mergeRefs(...)` is a
  // new function every render, which makes React detach (ref(null)) and re-attach (ref(node)) on each
  // one — tearing down and rebuilding the observer every time. Any re-render then feeds the next,
  // which is how a glass surface could spin into "Maximum update depth exceeded" (e.g. opening a
  // second Menu flyout, or a growing field inside a glass bar).
  const setRefs = useMemo(() => mergeRefs(forwardedRef, inViewRef), [forwardedRef, inViewRef])

  return (
    <Comp
      ref={setRefs}
      className={cx('lk-glass', interactive && 'lk-glass--interactive', className)}
      data-tint={tint}
      data-material={material}
      data-elevation={elevation}
      style={{ borderRadius: pill ? 999 : radius, ...style }}
      {...rest}
    >
      {/* Class name kept for compatibility — it is the frost layer now. */}
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
 * The core Liquid Glass surface: a translucent element that frosts whatever sits
 * behind it, with a specular bevel and sheen. Every other LiquidKit component
 * composes this primitive.
 *
 * Memoized so a parent re-render doesn't cascade into every glass surface on
 * the page (each one rebuilds a backdrop-filter — the expensive part).
 */
export const LiquidGlass = memo(LiquidGlassInner)
