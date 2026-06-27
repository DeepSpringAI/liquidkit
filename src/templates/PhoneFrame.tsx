import type { CSSProperties, ReactNode, Ref } from 'react'
import { BatteryIcon, SignalIcon, WifiIcon } from '../icons'
import { cx } from '../utils/cx'
import './templates.css'

export interface PhoneFrameProps {
  children: ReactNode
  /** Time shown at the left of the status bar. @default '9:41' */
  time?: ReactNode
  /** Wallpaper / background layer rendered behind the screen content. */
  background?: ReactNode
  /**
   * Status-bar & home-indicator color. `'auto'` follows the theme label color;
   * use `'light'` over dark wallpapers (lock screen, control center). @default 'auto'
   */
  statusBar?: 'auto' | 'light' | 'dark'
  /** Screen width in px (the device scales around it). @default 380 */
  width?: number
  /** Scroll the screen content vertically. @default true */
  scroll?: boolean
  /** Ref to the scrolling screen element — pass to a NavigationBar's `scrollTarget`. */
  contentRef?: Ref<HTMLDivElement>
  /** Hide the bottom home indicator. */
  hideHomeIndicator?: boolean
  /** Hide the status bar (time + signal/wifi/battery). */
  hideStatusBar?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * An iPhone device frame — bezel, Dynamic Island, status bar and home indicator —
 * wrapping any screen content. Pair it with {@link NavigationBar}, {@link List},
 * {@link TabBar} and {@link Tile} to mock full iOS 26 screens.
 */
export function PhoneFrame({
  children,
  time = '9:41',
  background,
  statusBar = 'auto',
  width = 380,
  scroll = true,
  contentRef,
  hideHomeIndicator = false,
  hideStatusBar = false,
  className,
  style,
}: PhoneFrameProps) {
  return (
    <div
      className={cx('lk-phone', className)}
      data-statusbar={statusBar}
      style={{ '--lk-phone-w': `${width}px`, ...style } as CSSProperties}
    >
      <div className="lk-phone__screen">
        {background != null && (
          <div className="lk-phone__wallpaper" aria-hidden="true">
            {background}
          </div>
        )}

        {!hideStatusBar && (
          <div className="lk-phone__statusbar" aria-hidden="true">
            <span className="lk-phone__time">{time}</span>
            <span className="lk-phone__status-icons">
              <SignalIcon size={17} />
              <WifiIcon size={17} />
              <BatteryIcon size={25} />
            </span>
          </div>
        )}

        <div className="lk-phone__island" aria-hidden="true" />

        <div ref={contentRef} className={cx('lk-phone__content', scroll && 'is-scroll')}>
          {children}
        </div>

        {!hideHomeIndicator && <div className="lk-phone__home" aria-hidden="true" />}
      </div>
    </div>
  )
}
