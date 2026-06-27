import { useState, type FormEvent, type ReactNode } from 'react'
import { Card } from '../components/Card/Card'
import { Input } from '../components/Input/Input'
import { Button } from '../components/Button/Button'
import { cx } from '../utils/cx'
import './templates.css'

export interface WaitlistPageProps {
  badge?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  placeholder?: string
  ctaLabel?: ReactNode
  onSubmit?: (email: string) => void
  /** Social links / icons under the form. */
  socials?: ReactNode
  /** Large faint text behind the card. */
  watermark?: ReactNode
  background?: ReactNode
  className?: string
}

/** A "coming soon" waitlist screen with an email capture card. */
export function WaitlistPage({
  badge,
  title = 'Coming soon',
  subtitle = 'Sign up to get notified when we launch.',
  placeholder = 'Enter your email',
  ctaLabel = 'Join waitlist',
  onSubmit,
  socials,
  watermark,
  background,
  className,
}: WaitlistPageProps) {
  const [email, setEmail] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <section className={cx('lk-tpl', 'lk-waitlist', className)}>
      <div className="lk-tpl__bg" aria-hidden="true">
        {background}
      </div>
      {watermark && (
        <div className="lk-waitlist__watermark" aria-hidden="true">
          {watermark}
        </div>
      )}
      <div className="lk-waitlist__center">
        {badge && <div className="lk-waitlist__badge">{badge}</div>}
        <h1 className="lk-waitlist__title">{title}</h1>
        <Card radius={28} elevation={3} padding="lg" className="lk-waitlist__card">
          {subtitle && <p className="lk-waitlist__subtitle">{subtitle}</p>}
          <form className="lk-waitlist__form" onSubmit={submit}>
            <Input
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lk-waitlist__input"
              pill
            />
            <Button type="submit" variant="accent" pill>
              {ctaLabel}
            </Button>
          </form>
        </Card>
        {socials && <div className="lk-waitlist__socials">{socials}</div>}
      </div>
    </section>
  )
}
