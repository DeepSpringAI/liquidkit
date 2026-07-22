/* A tiny, dependency-free syntax tokenizer.
 *
 * This is deliberately NOT a parser. It recognises the four things that actually carry meaning when
 * you skim a snippet — comments, strings, numbers, keywords — and leaves everything else as plain
 * text. That keeps it a few hundred bytes instead of the ~200KB a real highlighter costs, which
 * matters because a chat transcript can mount dozens of these at once.
 */

export type TokenType =
  'comment' | 'string' | 'keyword' | 'type' | 'ident' | 'number' | 'punct' | 'text'

export interface Token {
  type: TokenType
  value: string
}

interface Grammar {
  /** Prefixes that start a comment running to end-of-line. */
  lineComment: string[]
  /** `[open, close]` pairs for block comments. */
  blockComment: [string, string][]
  /** Characters that open (and close) a string literal. */
  quotes: string[]
  keywords: Set<string>
  /** Treat `CapitalisedWords` as type names — true for curly-brace languages, noise for shell/SQL. */
  capitalsAreTypes: boolean
}

const JS_KEYWORDS = [
  'import',
  'export',
  'from',
  'default',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'new',
  'delete',
  'typeof',
  'instanceof',
  'in',
  'of',
  'class',
  'extends',
  'super',
  'this',
  'interface',
  'type',
  'enum',
  'implements',
  'as',
  'satisfies',
  'async',
  'await',
  'yield',
  'try',
  'catch',
  'finally',
  'throw',
  'public',
  'private',
  'protected',
  'readonly',
  'static',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'never',
  'unknown',
  'any',
]

const PYTHON_KEYWORDS = [
  'def',
  'class',
  'return',
  'if',
  'elif',
  'else',
  'for',
  'while',
  'in',
  'not',
  'and',
  'or',
  'is',
  'import',
  'from',
  'as',
  'with',
  'try',
  'except',
  'finally',
  'raise',
  'yield',
  'lambda',
  'pass',
  'break',
  'continue',
  'global',
  'nonlocal',
  'assert',
  'del',
  'async',
  'await',
  'True',
  'False',
  'None',
  'self',
]

const SQL_KEYWORDS = [
  'select',
  'from',
  'where',
  'join',
  'left',
  'right',
  'inner',
  'outer',
  'full',
  'on',
  'group',
  'by',
  'order',
  'having',
  'limit',
  'offset',
  'insert',
  'into',
  'values',
  'update',
  'set',
  'delete',
  'create',
  'table',
  'view',
  'index',
  'alter',
  'drop',
  'add',
  'as',
  'and',
  'or',
  'not',
  'null',
  'is',
  'in',
  'like',
  'between',
  'distinct',
  'union',
  'all',
  'case',
  'when',
  'then',
  'else',
  'end',
  'with',
  'asc',
  'desc',
  'count',
  'sum',
  'avg',
  'min',
  'max',
]

const SHELL_KEYWORDS = [
  'if',
  'then',
  'else',
  'elif',
  'fi',
  'for',
  'while',
  'do',
  'done',
  'case',
  'esac',
  'function',
  'return',
  'in',
  'export',
  'local',
  'source',
  'echo',
  'cd',
  'set',
  'unset',
  'sudo',
  'exit',
]

const CSS_KEYWORDS = [
  'important',
  'from',
  'to',
  'and',
  'not',
  'only',
  'var',
  'calc',
  'import',
  'media',
  'supports',
  'keyframes',
  'font-face',
  'root',
]

const GO_KEYWORDS = [
  'package',
  'import',
  'func',
  'return',
  'if',
  'else',
  'for',
  'range',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'var',
  'const',
  'type',
  'struct',
  'interface',
  'map',
  'chan',
  'go',
  'defer',
  'select',
  'nil',
  'true',
  'false',
  'error',
  'string',
  'int',
  'bool',
]

const RUST_KEYWORDS = [
  'fn',
  'let',
  'mut',
  'const',
  'static',
  'if',
  'else',
  'match',
  'for',
  'while',
  'loop',
  'in',
  'return',
  'struct',
  'enum',
  'impl',
  'trait',
  'pub',
  'use',
  'mod',
  'crate',
  'self',
  'super',
  'where',
  'as',
  'ref',
  'move',
  'async',
  'await',
  'dyn',
  'true',
  'false',
  'Some',
  'None',
  'Ok',
  'Err',
]

function grammar(partial: Partial<Grammar>): Grammar {
  return {
    lineComment: ['//'],
    blockComment: [['/*', '*/']],
    quotes: ['"', "'", '`'],
    keywords: new Set(JS_KEYWORDS),
    capitalsAreTypes: true,
    ...partial,
  }
}

const CURLY = grammar({})

/* Aliases map onto a handful of grammar families. Anything unrecognised gets the curly-brace
   grammar, which degrades gracefully: worst case a few words go unhighlighted. */
const GRAMMARS: Record<string, Grammar> = {
  js: CURLY,
  jsx: CURLY,
  ts: CURLY,
  tsx: CURLY,
  javascript: CURLY,
  typescript: CURLY,
  java: CURLY,
  c: CURLY,
  cpp: CURLY,
  csharp: CURLY,
  swift: CURLY,
  kotlin: CURLY,
  scala: CURLY,
  php: CURLY,
  go: grammar({ keywords: new Set(GO_KEYWORDS) }),
  rust: grammar({ keywords: new Set(RUST_KEYWORDS) }),
  json: grammar({
    lineComment: [],
    blockComment: [],
    quotes: ['"'],
    keywords: new Set(['true', 'false', 'null']),
    capitalsAreTypes: false,
  }),
  python: grammar({
    lineComment: ['#'],
    blockComment: [
      ['"""', '"""'],
      ["'''", "'''"],
    ],
    keywords: new Set(PYTHON_KEYWORDS),
  }),
  ruby: grammar({ lineComment: ['#'], blockComment: [], keywords: new Set(PYTHON_KEYWORDS) }),
  yaml: grammar({
    lineComment: ['#'],
    blockComment: [],
    keywords: new Set(['true', 'false', 'null', 'yes', 'no']),
    capitalsAreTypes: false,
  }),
  toml: grammar({
    lineComment: ['#'],
    blockComment: [],
    keywords: new Set(['true', 'false']),
    capitalsAreTypes: false,
  }),
  bash: grammar({
    lineComment: ['#'],
    blockComment: [],
    quotes: ['"', "'"],
    keywords: new Set(SHELL_KEYWORDS),
    capitalsAreTypes: false,
  }),
  sql: grammar({
    lineComment: ['--'],
    quotes: ['"', "'"],
    keywords: new Set(SQL_KEYWORDS),
    capitalsAreTypes: false,
  }),
  css: grammar({
    lineComment: [],
    quotes: ['"', "'"],
    keywords: new Set(CSS_KEYWORDS),
    capitalsAreTypes: false,
  }),
  html: grammar({
    lineComment: [],
    blockComment: [['<!--', '-->']],
    quotes: ['"', "'"],
    keywords: new Set([]),
    capitalsAreTypes: false,
  }),
}

const ALIASES: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  py: 'python',
  rb: 'ruby',
  yml: 'yaml',
  rs: 'rust',
  golang: 'go',
  'c++': 'cpp',
  cs: 'csharp',
  scss: 'css',
  less: 'css',
  xml: 'html',
  svg: 'html',
  md: 'text',
  markdown: 'text',
  txt: 'text',
  text: 'text',
  plaintext: 'text',
}

/** Resolve a fence info string (`ts`, `PY`, `sh`) to a canonical grammar name. */
export function normalizeLanguage(language?: string): string {
  const key = (language ?? '').trim().toLowerCase()
  return ALIASES[key] ?? key
}

const isIdentStart = (c: string) => /[A-Za-z_$@-]/.test(c)
const isIdent = (c: string) => /[A-Za-z0-9_$-]/.test(c)
const isDigit = (c: string) => /[0-9]/.test(c)

const PUNCT = '<>{}()[]=/.,:;|&?!+-*%^~'

/**
 * Split `code` into highlight tokens for `language`. Unknown languages fall back to a
 * curly-brace grammar; `text`/`plaintext` returns a single untouched token so prose fences
 * are never speckled with false keywords.
 */
export function tokenize(code: string, language?: string): Token[] {
  const name = normalizeLanguage(language)
  if (name === 'text') return code ? [{ type: 'text', value: code }] : []
  const g = GRAMMARS[name] ?? CURLY

  const tokens: Token[] = []
  const n = code.length
  let i = 0
  const push = (type: TokenType, value: string) => {
    if (value) tokens.push({ type, value })
  }

  outer: while (i < n) {
    const c = code[i]

    for (const [open, close] of g.blockComment) {
      if (code.startsWith(open, i)) {
        const end = code.indexOf(close, i + open.length)
        const j = end === -1 ? n : end + close.length
        push('comment', code.slice(i, j))
        i = j
        continue outer
      }
    }
    for (const prefix of g.lineComment) {
      if (code.startsWith(prefix, i)) {
        let j = i + prefix.length
        while (j < n && code[j] !== '\n') j++
        push('comment', code.slice(i, j))
        i = j
        continue outer
      }
    }
    if (g.quotes.includes(c)) {
      let j = i + 1
      // An unterminated string (very common mid-stream, while tokens are still arriving) runs to
      // end-of-input rather than swallowing the rest of the file as one giant token.
      while (j < n && code[j] !== c && code[j] !== '\n') {
        if (code[j] === '\\') j++
        j++
      }
      push('string', code.slice(i, Math.min(n, code[j] === c ? j + 1 : j)))
      i = Math.min(n, code[j] === c ? j + 1 : j)
      continue
    }
    if (isIdentStart(c)) {
      let j = i + 1
      while (j < n && isIdent(code[j])) j++
      const word = code.slice(i, j)
      const lower = word.toLowerCase()
      if (g.keywords.has(word) || g.keywords.has(lower)) push('keyword', word)
      else if (g.capitalsAreTypes && /^[A-Z]/.test(word)) push('type', word)
      else push('ident', word)
      i = j
      continue
    }
    if (isDigit(c)) {
      let j = i + 1
      while (j < n && /[0-9._xa-fA-F]/.test(code[j])) j++
      push('number', code.slice(i, j))
      i = j
      continue
    }
    if (PUNCT.includes(c)) {
      push('punct', c)
      i++
      continue
    }
    push('text', c)
    i++
  }
  return tokens
}
