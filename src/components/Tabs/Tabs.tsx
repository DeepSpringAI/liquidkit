import { forwardRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Tabs.css'

export interface TabItem {
  id: string
  label: ReactNode
  icon?: ReactNode
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

/** A segmented control / tabs with a sliding glass indicator (equal-width segments). */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, defaultValue, onChange, size = 'md', className, style, ...rest },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id)
  const active = controlled ? value : internal
  const idx = Math.max(
    0,
    items.findIndex((i) => i.id === active),
  )

  const select = (id: string) => {
    if (!controlled) setInternal(id)
    onChange?.(id)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next = idx
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % items.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (idx - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else return
    e.preventDefault()
    const id = items[next]?.id
    if (!id) return
    select(id)
    const list = e.currentTarget.closest('[role="tablist"]')
    list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <LiquidGlass
      ref={ref as never}
      pill
      elevation={1}
      sheen={false}
      {...rest}
      className={cx('lk-tabs', `lk-tabs--${size}`, className)}
      style={style}
    >
      <div
        className="lk-tabs__track"
        role="tablist"
        style={{ '--lk-tabs-count': items.length } as CSSProperties}
      >
        <span
          className="lk-tabs__indicator"
          style={{ '--lk-tabs-x': `${idx * 100}%` } as CSSProperties}
        />
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={it.id === active}
            tabIndex={it.id === active ? 0 : -1}
            className={cx('lk-tabs__tab', it.id === active && 'is-active')}
            onClick={() => select(it.id)}
            onKeyDown={onKeyDown}
          >
            {it.icon && <span className="lk-tabs__icon">{it.icon}</span>}
            {it.label}
          </button>
        ))}
      </div>
    </LiquidGlass>
  )
})
