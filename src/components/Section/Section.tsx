import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Section.css'

export interface SectionProps {
  children: ReactNode
  /** Space between the header, the body and the footer. @default 12 */
  gap?: number
  className?: string
  style?: CSSProperties
}

export interface SectionHeaderProps {
  /** The work area's `h1`. Leave it out and pass `children` for a wordmark. */
  title?: ReactNode
  /** One quiet line under the title. */
  subtitle?: ReactNode
  /** A small tracked uppercase label above the title. */
  eyebrow?: ReactNode
  /** Chips, filters or controls, pushed to the trailing edge. */
  actions?: ReactNode
  /** Replaces the title block entirely — this is where a wordmark goes. */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface SectionToolbarProps {
  /** Controls at the leading edge — a back/forward pair, typically. */
  leading?: ReactNode
  /** Where the reader is, as plain text. Not a heading: nothing is named twice. */
  children?: ReactNode
  /** The trailing edge: a field, then the one button everything else is behind. */
  actions?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface SectionBodyProps {
  children: ReactNode
  /**
   * Whether this is the region that scrolls. Turn it off when the section owns
   * a more specific scroller inside it (a transcript, a virtualised list) — the
   * body then clips instead, so the frame still cannot grow.
   * @default true
   */
  scroll?: boolean
  className?: string
  style?: CSSProperties
}

export interface SectionFooterProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A work area's one layout: a header row that never scrolls, a body that does,
 * and an optional footer docked to the bottom of the frame.
 *
 * The rule this exists to enforce is that a section is exactly one scroll
 * region. A heading that scrolls away, column headers that leave with their
 * rows and a composer pushed off the bottom by its own transcript are all the
 * same bug, and it is the one this shape cannot express.
 */
export function Section({ children, gap = 12, className, style }: SectionProps) {
  return (
    <section
      className={cx('lk-section', className)}
      style={{ '--lk-section-gap': `${gap}px`, ...style } as CSSProperties}
    >
      {children}
    </section>
  )
}

/** The header row: one pattern, every section. */
export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
  className,
  style,
}: SectionHeaderProps) {
  return (
    <header className={cx('lk-section__header', className)} style={style}>
      <div className="lk-section__heading">
        {children ?? (
          <>
            {eyebrow != null && <p className="lk-section__eyebrow">{eyebrow}</p>}
            {title != null && <h1 className="lk-section__title">{title}</h1>}
            {subtitle != null && <p className="lk-section__subtitle">{subtitle}</p>}
          </>
        )}
      </div>
      {actions != null && <div className="lk-section__actions">{actions}</div>}
    </header>
  )
}

/**
 * The header row a *browser* wears: one slim line of chrome — where you are,
 * how to get back, and one button holding everything you can do here.
 *
 * It is the same row as `SectionHeader`, minus the announcement. A screen whose
 * content already names itself — a folder, a list, a search result — does not
 * need a 22 px heading repeating that name, and the space a title and a lede
 * take is space the content wanted. Actions collapse into an overflow menu
 * rather than spreading across the corner, so the row stays the same shape no
 * matter how many of them there are.
 */
export function SectionToolbar({
  leading,
  children,
  actions,
  className,
  style,
}: SectionToolbarProps) {
  return (
    <header className={cx('lk-section__toolbar', className)} style={style}>
      {leading != null && <div className="lk-section__leading">{leading}</div>}
      {children != null && <div className="lk-section__where">{children}</div>}
      {actions != null && <div className="lk-section__actions">{actions}</div>}
    </header>
  )
}

/** The single scrolling region. */
export function SectionBody({ children, scroll = true, className, style }: SectionBodyProps) {
  return (
    <div
      className={cx('lk-section__body', !scroll && 'lk-section__body--clip', className)}
      style={style}
    >
      {children}
    </div>
  )
}

/** Docked to the bottom of the frame, never pushed down by the body. */
export function SectionFooter({ children, className, style }: SectionFooterProps) {
  return (
    <div className={cx('lk-section__footer', className)} style={style}>
      {children}
    </div>
  )
}
