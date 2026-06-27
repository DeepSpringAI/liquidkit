import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Card } from '../Card/Card'
import { Button } from '../Button/Button'
import { CheckIcon } from '../../icons/icons'
import { cx } from '../../utils/cx'
import './PricingCard.css'

export interface PricingFeature {
  text: ReactNode
  included?: boolean
}

export interface PricingCardProps {
  name: ReactNode
  price: ReactNode
  period?: ReactNode
  description?: ReactNode
  features: Array<string | PricingFeature>
  ctaLabel?: ReactNode
  onSelect?: () => void
  /** Highlight as the featured tier. */
  popular?: boolean
  badgeLabel?: ReactNode
  className?: string
  style?: CSSProperties
}

/** A glass pricing-tier card with feature list and CTA. */
export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(function PricingCard(
  {
    name,
    price,
    period = '/mo',
    description,
    features,
    ctaLabel = 'Choose plan',
    onSelect,
    popular = false,
    badgeLabel = 'Popular',
    className,
    style,
  },
  ref,
) {
  return (
    <Card
      ref={ref}
      radius={26}
      elevation={popular ? 3 : 2}
      tint={popular ? 'accent' : 'auto'}
      padding="lg"
      className={cx('lk-pricing', popular && 'lk-pricing--popular', className)}
      style={{ width: 280, ...style }}
    >
      {popular && <span className="lk-pricing__badge">{badgeLabel}</span>}
      <p className="lk-pricing__name">{name}</p>
      <p className="lk-pricing__price">
        {price}
        {period && <span className="lk-pricing__period">{period}</span>}
      </p>
      {description && <p className="lk-pricing__desc">{description}</p>}

      <ul className="lk-pricing__features">
        {features.map((f, i) => {
          const feat: PricingFeature = typeof f === 'string' ? { text: f, included: true } : f
          const included = feat.included !== false
          return (
            <li
              key={i}
              className={cx('lk-pricing__feature', !included && 'is-excluded')}
            >
              <span className="lk-pricing__check">
                <CheckIcon size={15} />
              </span>
              {feat.text}
            </li>
          )
        })}
      </ul>

      <Button block variant={popular ? 'accent' : 'glass'} onClick={onSelect}>
        {ctaLabel}
      </Button>
    </Card>
  )
})
