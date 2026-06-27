import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import './NavBar.css'

export interface NavLink {
  label: ReactNode
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface NavBarProps {
  brand?: ReactNode
  links?: NavLink[]
  actions?: ReactNode
  /** Pill shape. @default true */
  pill?: boolean
  className?: string
}

/** A floating glass top navigation bar. */
export const NavBar = forwardRef<HTMLDivElement, NavBarProps>(function NavBar(
  { brand, links = [], actions, pill = true, className },
  ref,
) {
  return (
    <LiquidGlass
      ref={ref as never}
      pill={pill}
      radius={pill ? 999 : 18}
      elevation={2}
      className={cx('lk-navbar', className)}
    >
      <div className="lk-navbar__inner">
        {brand && <div className="lk-navbar__brand">{brand}</div>}
        {links.length > 0 && (
          <nav className="lk-navbar__links">
            {links.map((l, i) =>
              l.href ? (
                <a
                  key={i}
                  href={l.href}
                  className={cx('lk-navbar__link', l.active && 'is-active')}
                  onClick={l.onClick}
                >
                  {l.label}
                </a>
              ) : (
                <button
                  key={i}
                  type="button"
                  className={cx('lk-navbar__link', l.active && 'is-active')}
                  onClick={l.onClick}
                >
                  {l.label}
                </button>
              ),
            )}
          </nav>
        )}
        {actions && <div className="lk-navbar__actions">{actions}</div>}
      </div>
    </LiquidGlass>
  )
})
