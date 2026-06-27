import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Dock.css'

export interface DockItem {
  id: string
  icon: ReactNode
  label?: string
  href?: string
  onClick?: () => void
}

export type DockOrientation = 'vertical' | 'horizontal'
export type DockSize = 'sm' | 'md' | 'lg'

export interface DockProps {
  items: DockItem[]
  activeId?: string
  onSelect?: (id: string) => void
  /** @default 'vertical' */
  orientation?: DockOrientation
  /** @default 'md' */
  size?: DockSize
  /** @default 'auto' */
  tint?: GlassTint
  /** @default 2 */
  elevation?: 0 | 1 | 2 | 3
  /** Render the glass container. Set false when embedding inside another surface. @default true */
  glass?: boolean
  className?: string
}

function DockButton({
  item,
  active,
  onSelect,
}: {
  item: DockItem
  active: boolean
  onSelect?: (id: string) => void
}) {
  const className = cx('lk-dock__item', active && 'is-active')
  const handle = () => {
    item.onClick?.()
    onSelect?.(item.id)
  }
  const content = <span className="lk-dock__icon">{item.icon}</span>

  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        title={item.label}
        onClick={handle}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={item.label}
      aria-current={active ? 'true' : undefined}
      title={item.label}
      onClick={handle}
    >
      {content}
    </button>
  )
}

/** A glass navigation dock/rail (vertical or horizontal). */
export const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  { items, activeId, onSelect, orientation = 'vertical', size = 'md', tint = 'auto', elevation = 2, glass = true, className },
  ref,
) {
  const itemsEl = (
    <nav className="lk-dock__items">
      {items.map((it) => (
        <DockButton key={it.id} item={it} active={it.id === activeId} onSelect={onSelect} />
      ))}
    </nav>
  )

  if (!glass) {
    return (
      <div
        ref={ref}
        className={cx('lk-dock', 'lk-dock--bare', `lk-dock--${size}`, className)}
        data-orientation={orientation}
      >
        {itemsEl}
      </div>
    )
  }

  return (
    <LiquidGlass
      ref={ref as never}
      pill
      tint={tint}
      elevation={elevation}
      className={cx('lk-dock', `lk-dock--${size}`, className)}
      data-orientation={orientation}
    >
      {itemsEl}
    </LiquidGlass>
  )
})
