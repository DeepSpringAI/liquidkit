import { forwardRef, useCallback, useMemo, useState, Fragment } from 'react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import { CheckIcon, CopyIcon } from '../../icons/icons'
import { tokenize, normalizeLanguage } from './highlight'
import './CodeBlock.css'

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The source to render. Trailing whitespace is trimmed. */
  code: string
  /** Fence language (`ts`, `python`, `sh`…). Drives highlighting and the header label. */
  language?: string
  /** Optional label shown in place of the language — a filename or a caption. */
  title?: string
  /** Show the copy-to-clipboard button. @default true */
  copyable?: boolean
  /** Show a gutter of line numbers. @default false */
  showLineNumbers?: boolean
  /** Soft-wrap long lines instead of scrolling horizontally. @default false */
  wrap?: boolean
  /**
   * Collapse to this many lines with a "Show all" affordance. Omit to always render in full.
   * Useful in transcripts, where one long block otherwise buries everything after it.
   */
  maxLines?: number
  /** Render without the header bar. The copy button then floats over the code on hover. */
  hideHeader?: boolean
}

/** Row height used to compute the collapsed height — keep in sync with `--lk-code-line` in the CSS. */
const LINE_HEIGHT = 1.65

/**
 * A read-only source block: header with language/filename, copy button, optional line numbers,
 * and dependency-free syntax highlighting for common languages.
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    code,
    language,
    title,
    copyable = true,
    showLineNumbers = false,
    wrap = false,
    maxLines,
    hideHeader = false,
    className,
    ...rest
  },
  ref,
) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const source = useMemo(() => code.replace(/\s+$/, ''), [code])
  const tokens = useMemo(() => tokenize(source, language), [source, language])
  const lineCount = useMemo(() => source.split('\n').length, [source])

  const label = title ?? normalizeLanguage(language)
  const collapsible = maxLines != null && lineCount > maxLines
  const collapsed = collapsible && !expanded

  const copy = useCallback(() => {
    // `navigator.clipboard` is undefined on insecure origins and in jsdom — a failed copy must not
    // take the surrounding transcript down with it.
    void navigator.clipboard
      ?.writeText(source)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => {})
  }, [source])

  const copyButton = copyable ? (
    <button
      type="button"
      className="lk-code__copy"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      <span className="lk-code__copy-text">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  ) : null

  return (
    <div
      ref={ref}
      className={cx(
        'lk-code',
        wrap && 'lk-code--wrap',
        showLineNumbers && 'lk-code--numbered',
        hideHeader && 'lk-code--bare',
        collapsed && 'lk-code--collapsed',
        className,
      )}
      {...rest}
    >
      {hideHeader ? (
        copyButton && <div className="lk-code__float">{copyButton}</div>
      ) : (
        <div className="lk-code__bar">
          <span className="lk-code__lang">{label}</span>
          {copyButton}
        </div>
      )}

      <div
        className="lk-code__scroll"
        style={collapsed ? { maxHeight: `calc(${maxLines}em * ${LINE_HEIGHT})` } : undefined}
      >
        <pre className="lk-code__pre">
          {showLineNumbers && (
            <span className="lk-code__gutter" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </span>
          )}
          <code className="lk-code__code">
            {tokens.map((token, index) =>
              token.type === 'text' ? (
                <Fragment key={index}>{token.value}</Fragment>
              ) : (
                <span key={index} className={`lk-tok lk-tok--${token.type}`}>
                  {token.value}
                </span>
              ),
            )}
          </code>
        </pre>
      </div>

      {collapsible && (
        <button
          type="button"
          className="lk-code__more"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show all ${lineCount} lines`}
        </button>
      )}
    </div>
  )
})
