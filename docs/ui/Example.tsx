import type { DocExample } from '../registry/types'
import { CodeBlock } from './CodeBlock'
import { cx } from '@hamidrezazargham/liquidkit'

export function Example({ example }: { example: DocExample }) {
  const { title, description, demo, code, stage = true, wide = false, overflow = false } = example
  return (
    <section className="doc-example">
      <h3 className="doc-example__title">{title}</h3>
      {description && <p className="doc-example__desc">{description}</p>}
      <div
        className={cx(
          'doc-demo',
          stage && 'doc-demo--stage',
          wide && 'doc-demo--wide',
          overflow && 'doc-demo--overflow',
        )}
      >
        <div className="doc-demo__inner">{demo}</div>
      </div>
      <CodeBlock code={code} />
    </section>
  )
}
