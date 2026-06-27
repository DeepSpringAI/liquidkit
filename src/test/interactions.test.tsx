import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  Card,
  List,
  Menu,
  Modal,
  Select,
  Switch,
  Tabs,
  ThemeProvider,
  ToastProvider,
  useTheme,
  useToast,
} from '../index'

describe('Switch', () => {
  it('toggles aria-checked and fires onChange', () => {
    const onChange = vi.fn()
    render(<Switch onChange={onChange} aria-label="Wi-Fi" />)
    const btn = screen.getByRole('switch')
    expect(btn).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(btn)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(btn).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards className (wrapper), ref (button) and arbitrary props', () => {
    const ref = createRef<HTMLButtonElement>()
    const { container } = render(
      <Switch ref={ref} className="my-switch" data-testid="sw" aria-label="x" />,
    )
    expect(container.querySelector('.lk-switch.my-switch')).toBeTruthy()
    expect(ref.current?.tagName).toBe('BUTTON')
    expect(screen.getByRole('switch')).toHaveAttribute('data-testid', 'sw')
  })
})

describe('Tabs', () => {
  const items = [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' },
  ]

  it('changes selection on click', () => {
    const onChange = vi.fn()
    render(<Tabs items={items} onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
  })

  it('arrow keys move selection (roving tabindex)', () => {
    render(<Tabs items={items} defaultValue="a" />)
    const tabA = screen.getByRole('tab', { name: 'A' })
    expect(tabA).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(tabA, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Select', () => {
  const options = [
    { value: '1', label: 'One' },
    { value: '2', label: 'Two' },
  ]

  it('opens, selects an option and closes', () => {
    const onChange = vi.fn()
    render(<Select options={options} onChange={onChange} />)
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'Two' }))
    expect(onChange).toHaveBeenCalledWith('2')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens from the trigger with ArrowDown', () => {
    render(<Select options={options} />)
    const trigger = screen.getByRole('button')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})

describe('Menu', () => {
  it('opens and selects an item', () => {
    const onSelect = vi.fn()
    render(
      <Menu trigger={<button>Open</button>} items={[{ id: 'edit', label: 'Edit', onSelect }]} />,
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }))
    expect(onSelect).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('renders checkable items as menuitemcheckbox', () => {
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[{ id: 'wrap', label: 'Wrap', checked: true }]}
      />,
    )
    fireEvent.click(screen.getByText('Open'))
    const item = screen.getByRole('menuitemcheckbox', { name: 'Wrap' })
    expect(item).toHaveAttribute('aria-checked', 'true')
  })
})

describe('Modal', () => {
  it('is a labelled modal dialog, traps initial focus and closes on Esc', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Confirm">
        <button>Inside</button>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Confirm')
    // focus moved into the dialog
    expect(dialog.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false}>
        <span>x</span>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('Toast', () => {
  function Harness({ variant }: { variant?: 'glass' | 'error' }) {
    const { toast } = useToast()
    return <button onClick={() => toast({ title: 'Hi', variant, duration: 0 })}>show</button>
  }

  it('shows a polite status toast', () => {
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('show'))
    expect(screen.getByRole('status')).toHaveTextContent('Hi')
  })

  it('uses role=alert for the error variant', () => {
    render(
      <ToastProvider>
        <Harness variant="error" />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('show'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('ThemeProvider', () => {
  function Probe() {
    const { theme, toggle } = useTheme()
    return (
      <button onClick={toggle} data-state={theme}>
        toggle
      </button>
    )
  }

  it('toggles the resolved theme on the wrapper', () => {
    const { container } = render(
      <ThemeProvider defaultMode="light">
        <Probe />
      </ThemeProvider>,
    )
    const root = container.querySelector('.lk-root')!
    expect(root).toHaveAttribute('data-theme', 'light')
    fireEvent.click(screen.getByText('toggle'))
    expect(root).toHaveAttribute('data-theme', 'dark')
  })

  it('throws when useTheme is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/)
    spy.mockRestore()
  })
})

describe('prop forwarding', () => {
  it('Card and List forward className and ref', () => {
    const cardRef = createRef<HTMLDivElement>()
    const listRef = createRef<HTMLDivElement>()
    const { container } = render(
      <>
        <Card ref={cardRef} className="c">
          x
        </Card>
        <List ref={listRef} className="l">
          <span>row</span>
        </List>
      </>,
    )
    expect(container.querySelector('.lk-card.c')).toBeTruthy()
    expect(container.querySelector('.lk-list.l')).toBeTruthy()
    expect(cardRef.current).toBeInstanceOf(HTMLElement)
    expect(listRef.current).toBeInstanceOf(HTMLDivElement)
  })
})
