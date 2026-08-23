import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Composer } from '@hamidrezazargham/liquidkit'

function Typed({
  onSubmit = () => {},
  ...rest
}: { onSubmit?: () => void } & Record<string, unknown>) {
  const [value, setValue] = useState('')
  return (
    <Composer
      value={value}
      onValueChange={setValue}
      onSubmit={onSubmit}
      placeholder="Ask anything"
      {...rest}
    />
  )
}

describe('Composer', () => {
  it('sends on Enter and keeps Shift+Enter for a newline', () => {
    const onSubmit = vi.fn()
    render(<Typed onSubmit={onSubmit} />)
    const field = screen.getByRole('textbox', { name: 'Message' })

    fireEvent.change(field, { target: { value: 'What is the holiday policy?' } })
    fireEvent.keyDown(field, { key: 'Enter', shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()

    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('leaves Enter alone when it is asked to', () => {
    const onSubmit = vi.fn()
    render(<Typed onSubmit={onSubmit} submitOnEnter={false} />)

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Message' }), { key: 'Enter' })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('carries controls and an action on the bar itself', () => {
    render(
      <Typed
        controls={<button type="button">GPT-5.1 Codex</button>}
        action={<button type="submit">Send</button>}
        notice="Nothing is connected yet."
      />,
    )

    expect(screen.getByRole('button', { name: 'GPT-5.1 Codex' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
    expect(screen.getByText('Nothing is connected yet.')).toBeInTheDocument()
  })

  it('grows the field with its content and stops at the ceiling', () => {
    // jsdom has no layout, so scrollHeight is stubbed: the point under test is
    // the clamp, not the measurement.
    const heights = [20, 400]
    let call = 0
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(
      () => heights[Math.min(call++, heights.length - 1)],
    )

    render(<Typed />)
    const field = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    expect(field.style.height).toBe('34px')

    fireEvent.change(field, { target: { value: 'a\nb\nc\nd\ne\nf\ng\nh' } })
    expect(field.style.height).toBe('140px')
    expect(field.style.overflowY).toBe('auto')

    vi.restoreAllMocks()
  })
})
