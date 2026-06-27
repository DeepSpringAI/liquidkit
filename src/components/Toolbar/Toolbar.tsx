import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { ChevronDownIcon } from '../../icons/icons'
import './Toolbar.css'

export interface ToolbarItem {
  id: string
  icon: ReactNode
  label?: string
  /** Render as a prominent accent action (filled + optional glow). */
  primary?: boolean
  /** Show a dropdown chevron. */
  dropdown?: boolean
  active?: boolean
  onClick?: () => void
}

export interface ToolbarProps {
  items: ToolbarItem[]
  /** Glow ring on primary items. @default true */
  glow?: boolean
  /** @default 'auto' */
  tint?: GlassTint
  /** @default 2 */
  elevation?: 0 | 1 | 2 | 3
  className?: string
}

/** A horizontal floating glass toolbar with optional glowing primary action. */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { items, glow = true, tint = 'auto', elevation = 2, className },
  ref,
) {
  return (
    <LiquidGlass
      ref={ref as never}
      pill
      tint={tint}
      elevation={elevation}
      className={cx('lk-toolbar', className)}
    >
      <div className="lk-toolbar__items">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={cx(
              'lk-toolbar__item',
              it.primary && 'lk-toolbar__item--primary',
              it.primary && glow && 'lk-toolbar__item--glow',
              it.active && 'is-active',
            )}
            aria-label={it.label}
            aria-pressed={it.active}
            title={it.label}
            onClick={it.onClick}
          >
            <span className="lk-toolbar__icon">{it.icon}</span>
            {it.dropdown && (
              <span className="lk-toolbar__chevron">
                <ChevronDownIcon size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
    </LiquidGlass>
  )
})
