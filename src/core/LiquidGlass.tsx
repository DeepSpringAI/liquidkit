import { forwardRef } from 'react'
import type { AllHTMLAttributes, CSSProperties, ElementType } from 'react'
import { cx } from '../utils/cx'
import { mergeRefs } from '../utils/mergeRefs'
import { useGlassFilter } from './useGlassFilter'
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
  radius: 22,
  bezel: 14,
  refraction: 46,
  dispersion: 2,
} as const

/**
 * The core Liquid Glass surface. Renders a translucent element that refracts
 * and disperses whatever is behind it, with a specular bevel and sheen.
 * Every other LiquidKit component composes this primitive.
 */
export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(
  function LiquidGlass(
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
    const { ref, filterUrl } = useGlassFilter<HTMLElement>({
      enabled: glass,
      bezel,
      scale: refraction,
      dispersion,
    })

    const blurCss = blur != null ? `${blur}px` : 'var(--lk-glass-blur)'
    const backdrop = [
      filterUrl,
      `blur(${blurCss})`,
      'saturate(var(--lk-glass-saturate))',
      'brightness(var(--lk-glass-brightness))',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Comp
        ref={mergeRefs(forwardedRef, ref)}
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
  },
)
