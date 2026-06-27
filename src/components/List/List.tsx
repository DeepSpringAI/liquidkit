import { forwardRef } from 'react'
import type { ElementType, HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { ChevronRightIcon } from '../../icons'
import { cx } from '../../utils/cx'
import './List.css'

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Section header above the group (uppercase footnote, iOS style). */
  header?: ReactNode
  /** Section footer caption below the group. */
  footer?: ReactNode
  /** Rounded inset card with side margins (iOS "Inset Grouped"). @default true */
  inset?: boolean
  /** @default 'auto' */
  tint?: GlassTint
  /** @default 1 */
  elevation?: 0 | 1 | 2 | 3
  /** Render a glass surface. Set false for an opaque grouped background. @default true */
  glass?: boolean
}

/** A grouped, inset list — the iOS Settings surface. Fill it with {@link ListRow}s. */
export const List = forwardRef<HTMLDivElement, ListProps>(function List(
  {
    children,
    header,
    footer,
    inset = true,
    tint = 'auto',
    elevation = 1,
    glass = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const group = <div className="lk-list__group">{children}</div>

  return (
    <div
      ref={ref}
      {...rest}
      className={cx('lk-list', inset && 'lk-list--inset', className)}
      style={style}
    >
      {header != null && <div className="lk-list__header">{header}</div>}
      {glass ? (
        <LiquidGlass
          radius={inset ? 18 : 0}
          tint={tint}
          elevation={elevation}
          sheen={false}
          className="lk-list__surface"
        >
          {group}
        </LiquidGlass>
      ) : (
        <div className="lk-list__surface lk-list__surface--solid">{group}</div>
      )}
      {footer != null && <div className="lk-list__footer">{footer}</div>}
    </div>
  )
})

export interface ListRowProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  /** Override the element. Defaults to `a` with `href`, `button` with `onClick`, else `div`. */
  as?: ElementType
  /** Leading element — typically an icon. Rendered in a rounded tile when `leadingFill` is set. */
  leading?: ReactNode
  /** Background color for the leading icon tile (the iOS Settings square). */
  leadingFill?: string
  title?: ReactNode
  /** Secondary line under the title. */
  subtitle?: ReactNode
  /** Trailing value text, in the secondary label color. */
  detail?: ReactNode
  /** Trailing element — a Switch, Badge, etc. */
  trailing?: ReactNode
  /** Show a disclosure chevron. Defaults on for interactive rows without a trailing/detail. */
  chevron?: boolean
  href?: string
  onClick?: MouseEventHandler
}

/** A single row in a {@link List}: leading tile, title/subtitle, trailing detail or control. */
export const ListRow = forwardRef<HTMLElement, ListRowProps>(function ListRow(
  {
    as,
    leading,
    leadingFill,
    title,
    subtitle,
    detail,
    trailing,
    chevron,
    href,
    onClick,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const interactive = !!(href || onClick)
  const Comp: ElementType = as ?? (href ? 'a' : onClick ? 'button' : 'div')
  const showChevron = chevron ?? (interactive && trailing == null && detail == null)
  const typeAttr = Comp === 'button' ? { type: 'button' as const } : {}

  return (
    <Comp
      ref={ref as never}
      {...rest}
      href={href}
      onClick={onClick}
      className={cx(
        'lk-listrow',
        leading != null && 'lk-listrow--has-leading',
        interactive && 'lk-listrow--interactive',
        className,
      )}
      style={style}
      {...typeAttr}
    >
      {leading != null && (
        <span
          className={cx('lk-listrow__leading', leadingFill && 'lk-listrow__leading--filled')}
          style={leadingFill ? { background: leadingFill } : undefined}
        >
          {leading}
        </span>
      )}
      <span className="lk-listrow__main">
        {title != null && <span className="lk-listrow__title">{title}</span>}
        {subtitle != null && <span className="lk-listrow__subtitle">{subtitle}</span>}
        {children}
      </span>
      {detail != null && <span className="lk-listrow__detail">{detail}</span>}
      {trailing != null && <span className="lk-listrow__trailing">{trailing}</span>}
      {showChevron && (
        <span className="lk-listrow__chevron">
          <ChevronRightIcon size={16} />
        </span>
      )}
    </Comp>
  )
})
