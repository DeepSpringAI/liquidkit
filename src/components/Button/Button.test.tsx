import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import { IconButton } from './IconButton'

describe('Button', () => {
  it('renders its label and fires onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Press' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a plain button for the ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass('lk-btn--ghost')
  })

  it('respects disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Nope' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('IconButton', () => {
  it('exposes its aria-label', () => {
    render(
      <IconButton aria-label="Add">
        <svg />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})
