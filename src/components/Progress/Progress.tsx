import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import './Progress.css'

export interface ProgressProps {
  /** Ignored while `indeterminate`. */
  value?: number
  max?: number
  /**
   * Work whose end is not known yet: the bar sweeps and the ring spins instead
   * of filling. Reports no percentage, because there is none to report.
   */
  indeterminate?: boolean
  /** @default 'bar' */
  variant?: 'bar' | 'ring'
  /** bar height or ring diameter in px */
  size?: number
  /** ring stroke thickness in px @default 8 */
  thickness?: number
  showValue?: boolean
  accent?: string
  glow?: boolean
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

/** A glass progress indicator — linear bar or circular ring, determinate or not. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    max = 100,
    indeterminate = false,
    variant = 'bar',
    size,
    thickness = 8,
    showValue = false,
    accent,
    glow = false,
    className,
    style,
    ...aria
  },
  ref,
) {
  const pct = Math.max(0, Math.min(1, value / max))
  const pctText = Math.round(pct * 100)
  const vars = (accent ? { '--lk-progress-accent': accent } : {}) as CSSProperties
  // An indeterminate bar has no value to report: aria-valuenow is left off
  // entirely, which is what tells a screen reader the end is unknown.
  const valueAria = indeterminate
    ? {}
    : { 'aria-valuenow': pctText, 'aria-valuemin': 0, 'aria-valuemax': 100 }

  if (variant === 'ring') {
    const d = size ?? 72
    const r = (d - thickness) / 2
    const c = 2 * Math.PI * r
    return (
      <div
        ref={ref}
        className={cx(
          'lk-progress-ring',
          indeterminate && 'is-indeterminate',
          glow && 'is-glow',
          className,
        )}
        style={{ width: d, height: d, ...vars, ...style }}
        role="progressbar"
        {...valueAria}
        {...aria}
      >
        <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
          <circle
            className="lk-progress-ring__track"
            cx={d / 2}
            cy={d / 2}
            r={r}
            strokeWidth={thickness}
            fill="none"
          />
          <circle
            className="lk-progress-ring__fill"
            cx={d / 2}
            cy={d / 2}
            r={r}
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={indeterminate ? `${c * 0.28} ${c}` : c}
            strokeDashoffset={indeterminate ? 0 : c * (1 - pct)}
            strokeLinecap="round"
            transform={`rotate(-90 ${d / 2} ${d / 2})`}
          />
        </svg>
        {showValue && !indeterminate && <span className="lk-progress-ring__label">{pctText}%</span>}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cx(
        'lk-progress',
        indeterminate && 'is-indeterminate',
        glow && 'is-glow',
        className,
      )}
      style={{ height: size ?? 8, ...vars, ...style }}
      role="progressbar"
      {...valueAria}
      {...aria}
    >
      <div
        className="lk-progress__fill"
        style={indeterminate ? undefined : { width: `${pct * 100}%` }}
      />
    </div>
  )
})
