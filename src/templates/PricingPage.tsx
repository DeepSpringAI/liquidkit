import type { ReactNode } from 'react'
import { NavBar, type NavLink } from '../components/NavBar/NavBar'
import { PricingCard, type PricingCardProps } from '../components/PricingCard/PricingCard'
import { Switch } from '../components/Switch/Switch'
import { cx } from '../utils/cx'
import './templates.css'

export interface PricingPageProps {
  brand?: ReactNode
  links?: NavLink[]
  navActions?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  tiers: PricingCardProps[]
  /** Optional billing-period toggle. */
  billing?: {
    yearly: boolean
    onChange: (yearly: boolean) => void
    label?: ReactNode
  }
  background?: ReactNode
  className?: string
}

/** A pricing page: nav + heading + optional billing toggle + tier grid. */
export function PricingPage({
  brand,
  links,
  navActions,
  title = 'Pricing',
  subtitle,
  tiers,
  billing,
  background,
  className,
}: PricingPageProps) {
  return (
    <section className={cx('lk-tpl', 'lk-pricingpage', className)}>
      <div className="lk-tpl__bg" aria-hidden="true">
        {background}
      </div>
      {(brand || links || navActions) && (
        <div className="lk-pricingpage__nav">
          <NavBar brand={brand} links={links} actions={navActions} />
        </div>
      )}
      <div className="lk-pricingpage__head">
        <h1 className="lk-pricingpage__title">{title}</h1>
        {subtitle && <p className="lk-pricingpage__subtitle">{subtitle}</p>}
        {billing && (
          <div className="lk-pricingpage__billing">
            <Switch
              checked={billing.yearly}
              onChange={billing.onChange}
              label={billing.label ?? 'Yearly billing'}
            />
          </div>
        )}
      </div>
      <div className="lk-pricingpage__grid">
        {tiers.map((tier, i) => (
          <PricingCard key={i} {...tier} />
        ))}
      </div>
    </section>
  )
}
