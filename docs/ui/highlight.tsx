import { Fragment } from 'react'

type TokenType = 'comment' | 'string' | 'keyword' | 'type' | 'ident' | 'number' | 'punct' | 'text'

interface Token {
  type: TokenType
  value: string
}

const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'new',
  'typeof',
  'interface',
  'type',
  'extends',
  'as',
  'default',
  'true',
  'false',
  'null',
  'undefined',
  'await',
  'async',
  'void',
])

const isIdentStart = (c: string) => /[A-Za-z_$]/.test(c)
const isIdent = (c: string) => /[A-Za-z0-9_$]/.test(c)
const isDigit = (c: string) => /[0-9]/.test(c)

/** A tiny, dependency-free JSX/TS tokenizer. Good enough for doc snippets. */
function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  const n = code.length
  let i = 0
  const push = (type: TokenType, value: string) => tokens.push({ type, value })

  while (i < n) {
    const c = code[i]

    if (c === '/' && code[i + 1] === '/') {
      let j = i + 2
      while (j < n && code[j] !== '\n') j++
      push('comment', code.slice(i, j))
      i = j
      continue
    }
    if (c === '/' && code[i + 1] === '*') {
      let j = i + 2
      while (j < n && !(code[j] === '*' && code[j + 1] === '/')) j++
      j = Math.min(n, j + 2)
      push('comment', code.slice(i, j))
      i = j
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c
      let j = i + 1
      while (j < n && code[j] !== q) {
        if (code[j] === '\\') j++
        j++
      }
      j = Math.min(n, j + 1)
      push('string', code.slice(i, j))
      i = j
      continue
    }
    if (isIdentStart(c)) {
      let j = i + 1
      while (j < n && isIdent(code[j])) j++
      const word = code.slice(i, j)
      if (KEYWORDS.has(word)) push('keyword', word)
      else if (/^[A-Z]/.test(word)) push('type', word)
      else push('ident', word)
      i = j
      continue
    }
    if (isDigit(c)) {
      let j = i + 1
      while (j < n && /[0-9.xa-fA-F]/.test(code[j])) j++
      push('number', code.slice(i, j))
      i = j
      continue
    }
    if ('<>{}()[]=/.,:;|&?!+-*'.includes(c)) {
      push('punct', c)
      i++
      continue
    }
    push('text', c)
    i++
  }
  return tokens
}

export function Highlighted({ code }: { code: string }) {
  const tokens = tokenize(code)
  return (
    <>
      {tokens.map((t, idx) =>
        t.type === 'text' ? (
          <Fragment key={idx}>{t.value}</Fragment>
        ) : (
          <span key={idx} className={`tok tok-${t.type}`}>
            {t.value}
          </span>
        ),
      )}
    </>
  )
}
