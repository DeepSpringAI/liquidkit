import type { CSSProperties, ReactNode } from 'react'
import { LiquidGlass, type GlassTint } from '../core/LiquidGlass'
import { cx } from '../utils/cx'
import './templates.css'

export interface MacWindowProps {
  children: ReactNode
  /** Title shown centered in the title bar. */
  title?: ReactNode
  /** Leading toolbar content, after the traffic lights (back/forward, view switches…). */
  toolbarLeading?: ReactNode
  /** Trailing toolbar content (search, share, add…). */
  toolbarTrailing?: ReactNode
  /** A source-list sidebar rendered on the left inside the window. */
  sidebar?: ReactNode
  /** Sidebar width in px. @default 220 */
  sidebarWidth?: number
  /** Wallpaper / desktop rendered behind the window. */
  background?: ReactNode
  /** Window width in px. @default 940 */
  width?: number
  /** Window height in px. @default 600 */
  height?: number
  /** Glass tint for the window chrome. @default 'auto' */
  tint?: GlassTint
  /** Called when the red traffic light is clicked. */
  onClose?: () => void
  className?: string
  style?: CSSProperties
}

/**
 * A macOS 26 window — translucent chrome, traffic-light controls, a unified
 * toolbar and an optional source-list sidebar. Drop {@link Sidebar},
 * {@link Table}, {@link List} or {@link Toolbar} inside to build desktop screens.
 */
export function MacWindow({
  children,
  title,
  toolbarLeading,
  toolbarTrailing,
  sidebar,
  sidebarWidth = 220,
  background,
  width = 940,
  height = 600,
  tint = 'auto',
  onClose,
  className,
  style,
}: MacWindowProps) {
  return (
    <div className={cx('lk-macwin-stage', className)} style={style}>
      {background != null && (
        <div className="lk-macwin__desktop" aria-hidden="true">
          {background}
        </div>
      )}
      <LiquidGlass
        radius={14}
        elevation={3}
        tint={tint}
        sheen={false}
        className="lk-macwin"
        style={{ width, height }}
      >
        <div className="lk-macwin__titlebar">
          <span className="lk-macwin__lights">
            <button
              type="button"
              className="lk-macwin__light lk-macwin__light--close"
              aria-label="Close"
              onClick={onClose}
            />
            <span className="lk-macwin__light lk-macwin__light--min" aria-hidden="true" />
            <span className="lk-macwin__light lk-macwin__light--zoom" aria-hidden="true" />
          </span>
          {toolbarLeading && <span className="lk-macwin__toolbar">{toolbarLeading}</span>}
          {title != null && <span className="lk-macwin__title">{title}</span>}
          <span className="lk-macwin__spacer" />
          {toolbarTrailing && (
            <span className="lk-macwin__toolbar lk-macwin__toolbar--end">{toolbarTrailing}</span>
          )}
        </div>
        <div className="lk-macwin__body">
          {sidebar != null && (
            <aside className="lk-macwin__sidebar" style={{ flexBasis: sidebarWidth }}>
              {sidebar}
            </aside>
          )}
          <div className="lk-macwin__content">{children}</div>
        </div>
      </LiquidGlass>
    </div>
  )
}
