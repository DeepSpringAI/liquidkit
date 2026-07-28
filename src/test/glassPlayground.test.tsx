import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '../index'
import { GlassPlayground } from '../../docs/ui/GlassPlayground'

/**
 * The docs playground is the one place a reader can change the glass parameters
 * live, so its wiring (slider → surface → generated source) is worth pinning.
 */
// jsdom's synthetic pointer events don't carry clientX / clientY, so build a
// plain Event with those props (same trick the FlowCanvas suite uses).
function pointer(type: string, props: Record<string, number>): Event {
  const e = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(e, props)
  return e
}

/** The generated source is syntax-highlighted into spans, so read it as text. */
const generatedCode = (container: HTMLElement) => container.querySelector('pre')?.textContent ?? ''

const renderPlayground = () =>
  render(
    <ThemeProvider>
      <GlassPlayground />
    </ThemeProvider>,
  )

describe('GlassPlayground', () => {
  it('renders a glass surface with a knob for every frost parameter', () => {
    const { container } = renderPlayground()
    expect(container.querySelector('.doc-pg-panel')).toBeTruthy()
    for (const label of ['Blur', 'Radius', 'Width', 'Height']) {
      expect(screen.getByLabelText(label)).toBeTruthy()
    }
  })

  it('offers no controls for the removed displacement engine', () => {
    renderPlayground()
    for (const gone of ['Refraction', 'Dispersion', 'Bezel']) {
      expect(screen.queryByLabelText(gone)).toBeNull()
    }
  })

  it('reflects a blur change in the readout and the generated code', () => {
    const { container } = renderPlayground()
    fireEvent.change(screen.getByLabelText('Blur'), { target: { value: '27' } })
    expect(screen.getByText(/blur 27/)).toBeTruthy()
    expect(generatedCode(container)).toContain('blur={27}')
  })

  it('applies a preset to every parameter at once', () => {
    renderPlayground()
    fireEvent.click(screen.getByRole('button', { name: 'Heavy frost' }))
    expect(screen.getByLabelText('Blur')).toHaveValue('28')
  })

  it('resets back to the defaults', () => {
    renderPlayground()
    fireEvent.change(screen.getByLabelText('Blur'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByLabelText('Blur')).toHaveValue('10')
  })

  it('disables the radius knob while pill is on', () => {
    renderPlayground()
    expect(screen.getByLabelText('Radius')).not.toBeDisabled()
    fireEvent.click(screen.getByRole('switch', { name: /pill/i }))
    expect(screen.getByLabelText('Radius')).toBeDisabled()
  })

  it('drops sheen from the code when the switch is off', () => {
    const { container } = renderPlayground()
    expect(generatedCode(container)).not.toContain('sheen={false}')
    fireEvent.click(screen.getByRole('switch', { name: /sheen/i }))
    expect(generatedCode(container)).toContain('sheen={false}')
  })

  it('swaps the backdrop', () => {
    const { container } = renderPlayground()
    const stage = container.querySelector('.doc-pg-backdrop')!
    expect(stage.getAttribute('data-backdrop')).toBe('grid')

    fireEvent.click(screen.getByRole('button', { name: 'Grid' }))
    fireEvent.click(within(document.body).getByRole('option', { name: 'Spectrum' }))

    expect(container.querySelector('.doc-pg-backdrop')!.getAttribute('data-backdrop')).toBe(
      'spectrum',
    )
  })

  it('moves the panel when dragged across the stage', () => {
    const { container } = renderPlayground()
    const stage = container.querySelector('.doc-pg-stage') as HTMLElement
    const panel = container.querySelector('.doc-pg-panel') as HTMLElement
    stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 400 }) as DOMRect

    fireEvent(panel, pointer('pointerdown', { clientX: 400, clientY: 200, pointerId: 1 }))
    fireEvent(panel, pointer('pointermove', { clientX: 600, clientY: 300, pointerId: 1 }))
    fireEvent(panel, pointer('pointerup', { pointerId: 1 }))

    expect(panel.style.left).toBe('75%')
    expect(panel.style.top).toBe('75%')
  })
})
