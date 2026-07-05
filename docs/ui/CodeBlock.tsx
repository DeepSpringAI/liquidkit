import { useState } from 'react'
import { CheckIcon } from '@hamidrezazargham/liquidkit'
import { Highlighted } from './highlight'

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
)

export function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="doc-code">
      <div className="doc-code__bar">
        <span className="doc-code__lang">{lang}</span>
        <button type="button" className="doc-code__copy" onClick={copy} aria-label="Copy code">
          {copied ? <CheckIcon size={16} /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="doc-code__pre">
        <code>
          <Highlighted code={code} />
        </code>
      </pre>
    </div>
  )
}
