import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeProvider, ToastProvider } from '../index'
import { componentDocs } from '../../docs/registry'

/**
 * Every documented example must survive being server-rendered and then hydrated.
 *
 * The smoke suite next door renders on the client only, into an empty div. That
 * can never observe a server/client divergence, because there is no server pass
 * to disagree with — which is how `useThemedPortal` shipped a `typeof document`
 * branch inside render that returned null on the server and a real element on
 * the client's first render. Every consumer of this library is a browser app,
 * and one of them (TheMachine) server-renders; there React threw the whole
 * document away and re-rendered it, which in Next.js also recreates every
 * <script> in <head> — and React never executes a script it created on the
 * client.
 *
 * React reports a mismatch through `onRecoverableError` and then silently
 * recovers, so nothing crashes and nothing turns red. That is exactly why this
 * has to be asserted rather than observed.
 */

const containers: HTMLElement[] = []

afterEach(() => {
  for (const c of containers.splice(0)) c.remove()
})

function tree(demo: React.ReactNode) {
  return (
    <ThemeProvider>
      <ToastProvider>{demo}</ToastProvider>
    </ThemeProvider>
  )
}

describe('component catalog hydration', () => {
  it('covers the same catalog the smoke suite does', () => {
    expect(componentDocs.length).toBeGreaterThanOrEqual(30)
  })

  for (const doc of componentDocs) {
    for (const example of doc.examples) {
      it(`${doc.name} — ${example.title}`, async () => {
        const node = tree(example.demo)

        // 1. the server pass must not throw (no window/document during render)
        let html = ''
        expect(() => {
          html = renderToString(node)
        }).not.toThrow()

        // 2. the client's first render must agree with it
        const container = document.createElement('div')
        container.innerHTML = html
        document.body.appendChild(container)
        containers.push(container)

        const recoverable: Error[] = []
        await act(async () => {
          hydrateRoot(container, node, {
            onRecoverableError: (error) => {
              recoverable.push(error as Error)
            },
          })
        })

        expect(recoverable.map((e) => e.message)).toEqual([])
      })
    }
  }
})
