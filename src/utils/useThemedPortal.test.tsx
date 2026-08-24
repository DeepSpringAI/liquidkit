import { describe, it, expect } from 'vitest'
import { render, act, waitFor } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { useThemedPortal } from './useThemedPortal'
import { ToastProvider } from '../components/Toast/Toast'

function Probe({ seen }: { seen: (HTMLElement | null)[] }) {
  const el = useThemedPortal()
  seen.push(el)
  return null
}

describe('useThemedPortal', () => {
  it('has no container on the first render, so the client tree starts where the server left it', () => {
    const seen: (HTMLElement | null)[] = []
    render(<Probe seen={seen} />)
    expect(seen[0]).toBeNull()
    expect(seen[seen.length - 1]).not.toBeNull()
  })

  it('mirrors the theme attributes onto the container and takes it away on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-palette', 'aurora')
    const seen: (HTMLElement | null)[] = []
    const { unmount } = render(<Probe seen={seen} />)

    await waitFor(() => expect(document.querySelector('.lk-portal')).not.toBeNull())
    const container = document.querySelector('.lk-portal') as HTMLElement
    expect(container.parentElement).toBe(document.body)
    expect(container.getAttribute('data-theme')).toBe('dark')
    expect(container.getAttribute('data-palette')).toBe('aurora')

    unmount()
    expect(document.querySelector('.lk-portal')).toBeNull()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-palette')
  })

  it('hydrates a portal-owning provider without a mismatch', async () => {
    const tree = (
      <ToastProvider>
        <p>content</p>
      </ToastProvider>
    )
    const html = renderToString(tree)
    expect(html).not.toContain('lk-toasts')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    const recoverable: unknown[] = []
    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError: (e) => recoverable.push(e) })
    })

    expect(recoverable).toEqual([])
    await waitFor(() => expect(document.querySelector('.lk-toasts')).not.toBeNull())
    container.remove()
  })
})
