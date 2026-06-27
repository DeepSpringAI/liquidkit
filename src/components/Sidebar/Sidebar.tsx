import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './Sidebar.css'

export interface SidebarItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  href?: string
  onClick?: () => void
}

export interface SidebarSection {
  title?: ReactNode
  items: SidebarItem[]
}

export interface SidebarProps {
  sections: SidebarSection[]
  activeId?: string
  onSelect?: (id: string) => void
  /** Content pinned above the nav (app title, search…). */
  header?: ReactNode
  /** Content pinned to the bottom (an account row…). */
  footer?: ReactNode
  /** @default 248 */
  width?: number
  /** @default 'auto' */
  tint?: GlassTint
  /** Glass surface. Set false for an opaque sidebar. @default true */
  glass?: boolean
  className?: string
  style?: CSSProperties
}

function SidebarRow({
  item,
  active,
  onSelect,
}: {
  item: SidebarItem
  active: boolean
  onSelect?: (id: string) => void
}) {
  const className = cx('lk-sidebar__item', active && 'is-active')
  const handle = () => {
    item.onClick?.()
    onSelect?.(item.id)
  }
  const inner = (
    <>
      {item.icon != null && <span className="lk-sidebar__icon">{item.icon}</span>}
      <span className="lk-sidebar__label">{item.label}</span>
      {item.badge != null && <span className="lk-sidebar__badge">{item.badge}</span>}
    </>
  )
  if (item.href) {
    return (
      <a href={item.href} className={className} aria-current={active ? 'page' : undefined} onClick={handle}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={className} aria-current={active ? 'true' : undefined} onClick={handle}>
      {inner}
    </button>
  )
}

/** The macOS source-list sidebar: sectioned nav with an accent selection. */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { sections, activeId, onSelect, header, footer, width = 248, tint = 'auto', glass = true, className, style },
  ref,
) {
  const body = (
    <>
      {header != null && <div className="lk-sidebar__header">{header}</div>}
      <nav className="lk-sidebar__nav">
        {sections.map((s, i) => (
          <div className="lk-sidebar__section" key={i}>
            {s.title != null && <div className="lk-sidebar__title">{s.title}</div>}
            {s.items.map((it) => (
              <SidebarRow key={it.id} item={it} active={it.id === activeId} onSelect={onSelect} />
            ))}
          </div>
        ))}
      </nav>
      {footer != null && <div className="lk-sidebar__footer">{footer}</div>}
    </>
  )

  if (!glass) {
    return (
      <div ref={ref} className={cx('lk-sidebar', 'lk-sidebar--bare', className)} style={{ width, ...style }}>
        {body}
      </div>
    )
  }

  return (
    <LiquidGlass
      ref={ref as never}
      radius={20}
      tint={tint}
      sheen={false}
      elevation={2}
      className={cx('lk-sidebar', className)}
      style={{ width, ...style }}
    >
      {body}
    </LiquidGlass>
  )
})
