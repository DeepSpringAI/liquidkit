import { createRef } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { CodeBlock, tokenize, normalizeLanguage } from '../../index'

const SNIPPET = `const greeting = 'hello'\n// a comment\nexport function main() {\n  return 42\n}`

describe('CodeBlock', () => {
  it('renders the source, the language label and a copy button', () => {
    const { container } = render(<CodeBlock code={SNIPPET} language="ts" />)
    expect(container.querySelector('.lk-code__code')?.textContent).toBe(SNIPPET)
    expect(screen.getByText('ts')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy()
  })

  it('prefers an explicit title over the language, and can drop the copy button', () => {
    render(<CodeBlock code={SNIPPET} language="ts" title="server.ts" copyable={false} />)
    expect(screen.getByText('server.ts')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Copy code' })).toBeNull()
  })

  it('trims trailing whitespace so a stray fence newline never adds a blank line', () => {
    const { container } = render(<CodeBlock code={`a = 1\n\n  \n`} language="python" />)
    expect(container.querySelector('.lk-code__code')?.textContent).toBe('a = 1')
  })

  it('highlights comments, strings and keywords with palette-scoped token classes', () => {
    const { container } = render(<CodeBlock code={SNIPPET} language="ts" />)
    expect(container.querySelector('.lk-tok--comment')?.textContent).toBe('// a comment')
    expect(container.querySelector('.lk-tok--string')?.textContent).toBe("'hello'")
    expect(container.querySelectorAll('.lk-tok--keyword').length).toBeGreaterThan(0)
  })

  it('renders a line-number gutter on request', () => {
    const { container } = render(<CodeBlock code={SNIPPET} language="ts" showLineNumbers />)
    const gutter = container.querySelector('.lk-code__gutter')
    expect(gutter?.children.length).toBe(5)
    expect(gutter?.getAttribute('aria-hidden')).toBe('true')
  })

  describe('copying', () => {
    beforeEach(() => {
      Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    })

    it('writes the source to the clipboard and confirms', async () => {
      render(<CodeBlock code={SNIPPET} language="ts" />)
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SNIPPET)
      await waitFor(() => expect(screen.getByText('Copied')).toBeTruthy())
    })

    it('survives a rejected clipboard write instead of crashing the tree', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'))
      Object.assign(navigator, { clipboard: { writeText } })
      render(<CodeBlock code={SNIPPET} language="ts" />)
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
      await waitFor(() => expect(writeText).toHaveBeenCalled())
      expect(screen.getByText('Copy')).toBeTruthy()
    })
  })

  describe('collapsing', () => {
    const long = Array.from({ length: 30 }, (_, index) => `line ${index}`).join('\n')

    it('collapses past maxLines and expands on click', () => {
      const { container } = render(<CodeBlock code={long} maxLines={8} />)
      expect(container.querySelector('.lk-code--collapsed')).toBeTruthy()
      const toggle = screen.getByRole('button', { name: 'Show all 30 lines' })
      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      fireEvent.click(toggle)
      expect(container.querySelector('.lk-code--collapsed')).toBeNull()
      expect(screen.getByRole('button', { name: 'Show less' })).toBeTruthy()
    })

    it('leaves a block shorter than maxLines alone', () => {
      const { container } = render(<CodeBlock code={SNIPPET} maxLines={40} />)
      expect(container.querySelector('.lk-code--collapsed')).toBeNull()
      expect(screen.queryByRole('button', { name: /show all/i })).toBeNull()
    })
  })

  it('applies wrap / bare modifiers and forwards className, ref and extra props', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <CodeBlock ref={ref} code="x" wrap hideHeader className="mine" data-testid="cb" />,
    )
    const root = container.querySelector('.lk-code')
    expect(root?.classList.contains('lk-code--wrap')).toBe(true)
    expect(root?.classList.contains('lk-code--bare')).toBe(true)
    expect(root?.classList.contains('mine')).toBe(true)
    expect(root?.getAttribute('data-testid')).toBe('cb')
    expect(ref.current).toBe(root)
    // Headerless still offers copy — it just floats over the code instead of sitting in a bar.
    expect(container.querySelector('.lk-code__bar')).toBeNull()
    expect(container.querySelector('.lk-code__float')).toBeTruthy()
  })
})

describe('tokenize', () => {
  it('round-trips: concatenated token values equal the input', () => {
    const value = tokenize(SNIPPET, 'ts')
      .map((token) => token.value)
      .join('')
    expect(value).toBe(SNIPPET)
  })

  it('uses per-language comment syntax', () => {
    expect(tokenize('# hi\nx = 1', 'python')[0]).toEqual({ type: 'comment', value: '# hi' })
    expect(tokenize('-- hi\nSELECT 1', 'sql')[0]).toEqual({ type: 'comment', value: '-- hi' })
    // `#` is not a comment in a curly-brace language, so it must not swallow the line.
    expect(tokenize('# hi', 'ts')[0].type).not.toBe('comment')
  })

  it('matches SQL keywords case-insensitively but leaves shell capitals as plain identifiers', () => {
    expect(tokenize('SELECT name FROM t', 'sql')[0]).toEqual({ type: 'keyword', value: 'SELECT' })
    expect(tokenize('MyVar=1', 'bash')[0].type).toBe('ident')
  })

  it('leaves plaintext entirely untouched', () => {
    expect(tokenize('const not code', 'text')).toEqual([{ type: 'text', value: 'const not code' }])
    expect(tokenize('', 'text')).toEqual([])
  })

  it('terminates on an unterminated string instead of swallowing the rest of the input', () => {
    // Half-streamed code hits this on almost every frame.
    const tokens = tokenize("const a = 'oops\nconst b = 2", 'ts')
    expect(tokens.map((t) => t.value).join('')).toBe("const a = 'oops\nconst b = 2")
    expect(tokens.some((t) => t.type === 'keyword' && t.value === 'const')).toBe(true)
  })

  it('normalises language aliases', () => {
    expect(normalizeLanguage('SH')).toBe('bash')
    expect(normalizeLanguage('py')).toBe('python')
    expect(normalizeLanguage(undefined)).toBe('')
  })
})
