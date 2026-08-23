import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './AppFrame.css'

export interface AppFrameProps {
  /** The fixed column on the leading edge — usually a `<Sidebar>`. */
  sidebar: ReactNode
  /** The work area, filled by one `<Section>` at a time. */
  children: ReactNode
  /**
   * The spacing module the frame is built from: its own padding on all four
   * sides, and the gap between the two columns. The work area's inner gutter is
   * that module times φ, so the three distances a user actually sees form one
   * ladder — 12 · 19.4 · 31.4 at the default.
   * @default 12
   */
  gutter?: number
  /** Frame height. @default '100dvh' */
  height?: string
  /**
   * Stop the document itself from scrolling, so the only thing that moves is
   * the one region inside the frame that is meant to. Turn it off to embed the
   * frame in a page that scrolls — a docs demo, a preview.
   * @default true
   */
  lockDocument?: boolean
  /**
   * The narrowest viewport the frame is rendered at. Below it the frame is not
   * squeezed, it is replaced by `belowMinWidth`.
   * @default 820
   */
  minWidth?: number
  /** What to show instead of the frame below `minWidth`. */
  belowMinWidth?: ReactNode
  className?: string
  style?: CSSProperties
}

/** True once the viewport is at least `minWidth` wide, and live from then on. */
function useAtLeast(minWidth: number): boolean {
  // Assume wide: the server cannot measure, and a frame that appears and is
  // then replaced reads better than a notice that flashes on every desktop.
  const [wide, setWide] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const onChange = () => setWide(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [minWidth])

  return wide
}

/** Holds the document still for as long as a locking frame is on screen. */
function useDocumentLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.add('lk-frame-locked')
    return () => root.classList.remove('lk-frame-locked')
  }, [locked])
}

function DefaultNotice() {
  return (
    <div className="lk-frame-notice__inner">
      <p className="lk-frame-notice__title">Best viewed on desktop</p>
      <p className="lk-frame-notice__body">
        This window is too narrow for the workspace. Widen it, or open the app on a larger screen.
      </p>
    </div>
  )
}

/**
 * The viewport-locked application frame: one fixed column of furniture, one
 * work area, painted once and never scrolled.
 *
 * It owns three things a page cannot own for itself — that the document does
 * not scroll, that the two columns sit on the golden-ratio spacing ladder, and
 * that a viewport too narrow for either is told so rather than shown a crushed
 * copy of both.
 */
export function AppFrame({
  sidebar,
  children,
  gutter = 12,
  height = '100dvh',
  lockDocument = true,
  minWidth = 820,
  belowMinWidth,
  className,
  style,
}: AppFrameProps) {
  const wide = useAtLeast(minWidth)
  useDocumentLock(lockDocument && wide)

  if (!wide) {
    return (
      <div className="lk-frame-notice" style={{ minHeight: height }}>
        {belowMinWidth ?? <DefaultNotice />}
      </div>
    )
  }

  return (
    <div
      className={cx('lk-frame', className)}
      style={{ '--lk-frame-gutter': `${gutter}px`, height, ...style } as CSSProperties}
    >
      <div className="lk-frame__rail">{sidebar}</div>
      <div className="lk-frame__main">{children}</div>
    </div>
  )
}
