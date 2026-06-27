import { forwardRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Tabs.css'

export interface TabItem {
  id: string
  label: ReactNode
  icon?: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
}

/** A segmented control / tabs with a sliding glass indicator (equal-width segments). */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, defaultValue, onChange, size = 'md', className, style },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id)
  const active = controlled ? value : internal
  const idx = Math.max(0, items.findIndex((i) => i.id === active))

  const select = (id: string) => {
    if (!controlled) setInternal(id)
    onChange?.(id)
  }

  return (
    <LiquidGlass
      ref={ref as never}
      pill
      elevation={1}
      sheen={false}
      className={cx('lk-tabs', `lk-tabs--${size}`, className)}
      style={style}
    >
      <div
        className="lk-tabs__track"
        role="tablist"
        style={{ '--lk-tabs-count': items.length } as CSSProperties}
      >
        <span className="lk-tabs__indicator" style={{ transform: `translateX(${idx * 100}%)` }} />
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={it.id === active}
            className={cx('lk-tabs__tab', it.id === active && 'is-active')}
            onClick={() => select(it.id)}
          >
            {it.icon && <span className="lk-tabs__icon">{it.icon}</span>}
            {it.label}
          </button>
        ))}
      </div>
    </LiquidGlass>
  )
})
