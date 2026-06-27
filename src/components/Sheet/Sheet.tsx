import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { LiquidGlass } from '../../core/LiquidGlass'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/mergeRefs'
import { useFocusTrap } from '../../utils/useFocusTrap'
import './Sheet.css'

export type Detent = number | 'medium' | 'large'

export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean
  onClose?: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** Snap heights, smallest→largest. Values ≤1 are viewport fractions, >1 are px. @default ['medium', 'large'] */
  detents?: Detent[]
  /** Initial detent index. @default 0 */
  defaultDetent?: number
  /** Dismiss when tapping the scrim. @default true */
  closeOnBackdrop?: boolean
  /** Show the drag handle (and allow dragging between detents). @default true */
  grabber?: boolean
}

function resolveDetent(d: Detent, vh: number): number {
  if (d === 'medium') return vh * 0.5
  if (d === 'large') return vh * 0.92
  return d <= 1 ? vh * d : d
}

/** The iOS sheet: a bottom panel that springs up and snaps between detents. */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    open,
    onClose,
    title,
    children,
    footer,
    detents = ['medium', 'large'],
    defaultDetent = 0,
    closeOnBackdrop = true,
    grabber = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800))
  const [detentIdx, setDetentIdx] = useState(defaultDetent)
  const [dragH, setDragH] = useState<number | null>(null)
  const drag = useRef<{ startY: number; startH: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(panelRef, open)

  const resolved = useMemo(
    () => detents.map((d) => resolveDetent(d, vh)).sort((a, b) => a - b),
    [detents, vh],
  )
  const height = dragH ?? resolved[Math.min(detentIdx, resolved.length - 1)]

  useEffect(() => {
    if (!open) return
    setDetentIdx(defaultDetent)
    setVh(window.innerHeight)
    const onResize = () => setVh(window.innerHeight)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose, defaultDetent])

  if (!open || typeof document === 'undefined') return null

  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { startY: e.clientY, startH: height }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return
    const next = drag.current.startH + (drag.current.startY - e.clientY)
    setDragH(Math.max(80, Math.min(resolved[resolved.length - 1] + 40, next)))
  }
  const onPointerUp = () => {
    if (!drag.current) return
    const h = dragH ?? height
    drag.current = null
    setDragH(null)
    if (h < resolved[0] * 0.6) {
      onClose?.()
      return
    }
    let nearest = 0
    let best = Infinity
    resolved.forEach((r, i) => {
      const d = Math.abs(r - h)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setDetentIdx(nearest)
  }

  return createPortal(
    <div className="lk-sheet">
      {/* Backdrop is a pointer affordance only; keyboard users dismiss via Esc. */}
      <div
        className="lk-sheet__scrim"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <LiquidGlass
        ref={mergeRefs(panelRef, ref) as never}
        elevation={3}
        sheen={false}
        {...rest}
        className={cx('lk-sheet__panel', dragH != null && 'is-dragging', className)}
        style={
          {
            height,
            borderRadius: 'var(--lk-radius-sheet) var(--lk-radius-sheet) 0 0',
            ...style,
          } as CSSProperties
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
      >
        <div
          className="lk-sheet__grabarea"
          onPointerDown={grabber ? onPointerDown : undefined}
          onPointerMove={grabber ? onPointerMove : undefined}
          onPointerUp={grabber ? onPointerUp : undefined}
        >
          {grabber && <span className="lk-sheet__grabber" />}
          {title != null && (
            <h3 className="lk-sheet__title" id={titleId}>
              {title}
            </h3>
          )}
        </div>
        <div className="lk-sheet__body">{children}</div>
        {footer != null && <div className="lk-sheet__footer">{footer}</div>}
      </LiquidGlass>
    </div>,
    document.body,
  )
})
