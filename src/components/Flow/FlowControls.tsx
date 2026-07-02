import { LiquidGlass } from '../../core/LiquidGlass'
import { IconButton } from '../Button/IconButton'
import { PlusIcon, MinusIcon } from '../../icons'
import { cx } from '../../utils/cx'
import { useFlow } from './FlowContext'
import './FlowControls.css'

export type FlowControlsPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export interface FlowControlsProps {
  /** Corner to pin to inside the canvas. @default 'bottom-left' */
  position?: FlowControlsPosition
  /** Zoom step per click. @default 1.25 */
  step?: number
  className?: string
}

/** Fit-to-view glyph (frame corners) — local to the control, not a library icon. */
function FitIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
    </svg>
  )
}

/** Zoom in / out / fit-to-view controls for a FlowCanvas. */
export function FlowControls({
  position = 'bottom-left',
  step = 1.25,
  className,
}: FlowControlsProps) {
  const { zoomBy, fitView } = useFlow()
  return (
    <LiquidGlass
      pill
      elevation={2}
      className={cx('lk-flow-controls', `lk-flow-controls--${position}`, className)}
    >
      <div className="lk-flow-controls__row">
        <IconButton aria-label="Zoom in" variant="ghost" onClick={() => zoomBy(step)}>
          <PlusIcon size={18} />
        </IconButton>
        <IconButton aria-label="Zoom out" variant="ghost" onClick={() => zoomBy(1 / step)}>
          <MinusIcon size={18} />
        </IconButton>
        <IconButton aria-label="Fit to view" variant="ghost" onClick={() => fitView()}>
          <FitIcon />
        </IconButton>
      </div>
    </LiquidGlass>
  )
}
