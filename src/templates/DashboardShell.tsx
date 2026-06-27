import type { ReactNode } from 'react'
import { LiquidGlass } from '../core/LiquidGlass'
import { cx } from '../utils/cx'
import './templates.css'

export interface DashboardShellProps {
  /** Sidebar content (brand, nav, footer). */
  sidebar: ReactNode
  /** Optional top bar within the main column. */
  header?: ReactNode
  children: ReactNode
  background?: ReactNode
  /** Sidebar width in px. @default 268 */
  sidebarWidth?: number
  className?: string
}

/** An app dashboard layout: glass sidebar panel + main content column. */
export function DashboardShell({
  sidebar,
  header,
  children,
  background,
  sidebarWidth = 268,
  className,
}: DashboardShellProps) {
  return (
    <div className={cx('lk-tpl', 'lk-dash', className)}>
      <div className="lk-tpl__bg" aria-hidden="true">
        {background}
      </div>
      <LiquidGlass
        radius={28}
        elevation={2}
        className="lk-dash__sidebar"
        style={{ flexBasis: sidebarWidth }}
      >
        <div className="lk-dash__sidebar-inner">{sidebar}</div>
      </LiquidGlass>
      <div className="lk-dash__main">
        {header && <div className="lk-dash__header">{header}</div>}
        <div className="lk-dash__content">{children}</div>
      </div>
    </div>
  )
}
