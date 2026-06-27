import type { ReactNode } from 'react'
import { NavBar, type NavLink } from '../components/NavBar/NavBar'
import { cx } from '../utils/cx'
import './templates.css'

export interface LandingHeroProps {
  brand?: ReactNode
  links?: NavLink[]
  navActions?: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  /** Rendered behind everything (image/video/gradient). */
  background?: ReactNode
  /** Extra content rendered below the actions. */
  children?: ReactNode
  className?: string
}

/** A full-viewport landing hero: floating nav + centered headline + CTAs. */
export function LandingHero({
  brand,
  links,
  navActions,
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  background,
  children,
  className,
}: LandingHeroProps) {
  return (
    <section className={cx('lk-tpl', 'lk-landing', className)}>
      <div className="lk-tpl__bg" aria-hidden="true">
        {background}
      </div>
      {(brand || links || navActions) && (
        <div className="lk-landing__nav">
          <NavBar brand={brand} links={links} actions={navActions} />
        </div>
      )}
      <div className="lk-landing__content">
        {eyebrow && <span className="lk-landing__eyebrow">{eyebrow}</span>}
        <h1 className="lk-landing__title">{title}</h1>
        {subtitle && <p className="lk-landing__subtitle">{subtitle}</p>}
        {(primaryAction || secondaryAction) && (
          <div className="lk-landing__actions">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
