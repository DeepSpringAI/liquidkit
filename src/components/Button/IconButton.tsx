import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Button, type ButtonProps } from './Button'

export interface IconButtonProps extends Omit<
  ButtonProps,
  'iconOnly' | 'leftIcon' | 'rightIcon' | 'children'
> {
  /** Required for accessibility — names the action for screen readers. */
  'aria-label': string
  /** The icon to render. */
  children: ReactNode
}

/** A circular/square icon-only button. Defaults to a circular pill. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { pill = true, children, ...props },
  ref,
) {
  return (
    <Button ref={ref} iconOnly pill={pill} {...props}>
      {children}
    </Button>
  )
})
