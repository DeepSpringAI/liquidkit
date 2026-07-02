import { cx } from '../../utils/cx'
import type { FlowSide } from './types'

export interface FlowPortProps {
  side: FlowSide
  /** Dims the port until the node is hovered/selected. @default false */
  muted?: boolean
  className?: string
}

/**
 * A connection point on a node edge. Visual-only in the data-driven canvas —
 * connectors are declared as data, not drawn by dragging ports (yet).
 */
export function FlowPort({ side, muted = false, className }: FlowPortProps) {
  return (
    <span
      aria-hidden="true"
      className={cx('lk-flow-port', `lk-flow-port--${side}`, muted && 'is-muted', className)}
    />
  )
}
