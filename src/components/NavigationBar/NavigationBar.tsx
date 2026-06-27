import { forwardRef } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { LiquidGlass, type GlassTint } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { useScrollDirection } from '../../utils/useScrollDirection'
import './NavigationBar.css'

export interface NavigationBarProps {
  title: ReactNode
  /** Show the large title that collapses to an inline title on scroll. @default true */
  largeTitle?: boolean
  /** Leading content (e.g. a back button). */
  leading?: ReactNode
  /** Trailing content (actions). */
  trailing?: ReactNode
  /** A row rendered under the title — typically a SearchField. */
  search?: ReactNode
  /** scrollY past which the large title collapses. @default 8 */
  collapseAt?: number
  /** Scroll container to react to. Defaults to the window. */
  scrollTarget?: RefObject<HTMLElement | null>
  /** @default 'auto' */
  tint?: GlassTint
  className?: string
  style?: CSSProperties
}

/** The iOS large-title navigation bar: a glass header whose large title
 *  collapses into an inline title as the content scrolls. */
export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(function NavigationBar(
  { title, largeTitle = true, leading, trailing, search, collapseAt = 8, scrollTarget, tint = 'auto', className, style },
  ref,
) {
  const { scrollY } = useScrollDirection({ target: scrollTarget, topOffset: collapseAt })
  const collapsed = largeTitle ? scrollY > collapseAt : true

  return (
    <LiquidGlass
      as="header"
      ref={ref as never}
      radius={0}
      tint={tint}
      sheen={false}
      elevation={0}
      className={cx('lk-navigationbar', collapsed && 'is-collapsed', className)}
      style={style}
    >
      <div className="lk-navigationbar__top">
        <div className="lk-navigationbar__side lk-navigationbar__leading">{leading}</div>
        <div className="lk-navigationbar__inline-title">{title}</div>
        <div className="lk-navigationbar__side lk-navigationbar__trailing">{trailing}</div>
      </div>
      {largeTitle && <h1 className="lk-navigationbar__large">{title}</h1>}
      {search != null && <div className="lk-navigationbar__search">{search}</div>}
    </LiquidGlass>
  )
})
