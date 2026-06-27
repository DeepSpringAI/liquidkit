import { forwardRef } from 'react'
import type { ReactNode, SVGProps } from 'react'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width/height in px (or any CSS length). @default 24 */
  size?: number | string
}

/** Build a 24×24 stroke icon component from path nodes. */
export function createIcon(node: ReactNode, displayName: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ size = 24, ...props }, ref) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props['aria-label'] ? undefined : true}
        {...props}
      >
        {node}
      </svg>
    )
  })
  Icon.displayName = displayName
  return Icon
}
