import { forwardRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { useScrollDirection } from '../../utils/useScrollDirection'
import './TabBar.css'

export interface TabBarItem {
  id: string
  icon: ReactNode
  label?: ReactNode
  /** Small badge (a count or a dot) on the icon. */
  badge?: ReactNode
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabBarItem[]
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  /** Collapse labels & shrink when the page scrolls down (iOS 26 scroll-reactive bar). @default false */
  condense?: boolean
  /** Floating capsule vs. an edge-to-edge bar. @default true */
  floating?: boolean
  /** @default 'auto' */
  tint?: GlassTint
  /** @default 3 */
  elevation?: 0 | 1 | 2 | 3
}

/** The iOS 26 floating tab bar: a glass capsule of icon+label tabs that can
 *  condense as the page scrolls. */
export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(function TabBar(
  {
    items,
    value,
    defaultValue,
    onChange,
    condense = false,
    floating = true,
    tint = 'auto',
    elevation = 3,
    className,
    style,
    ...rest
  },
  ref,
) {
  const controlled = value != null
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id)
  const active = controlled ? value : internal
  const idx = Math.max(
    0,
    items.findIndex((i) => i.id === active),
  )
  const { direction, atTop } = useScrollDirection()
  const condensed = condense && direction === 'down' && !atTop

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
      pill={floating}
      radius={floating ? undefined : 0}
      tint={tint}
      elevation={elevation}
      {...rest}
      className={cx(
        'lk-tabbar',
        floating && 'lk-tabbar--floating',
        condensed && 'is-condensed',
        className,
      )}
      style={style}
    >
      <div className="lk-tabbar__items" role="tablist">
        {items.map((it) => {
          const isActive = it.id === active
          return (
            <button
              key={it.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              aria-label={typeof it.label === 'string' ? it.label : undefined}
              className={cx('lk-tabbar__item', isActive && 'is-active')}
              onClick={() => select(it.id)}
              onKeyDown={onKeyDown}
            >
              <span className="lk-tabbar__icon">
                {it.icon}
                {it.badge != null && <span className="lk-tabbar__badge">{it.badge}</span>}
              </span>
              {it.label != null && <span className="lk-tabbar__label">{it.label}</span>}
            </button>
          )
        })}
      </div>
    </LiquidGlass>
  )
})
