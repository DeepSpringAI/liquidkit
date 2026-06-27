import type { ComponentDoc } from '../registry/types'
import { Example } from '../ui/Example'
import { PropsTable } from '../ui/PropsTable'
import { CodeBlock } from '../ui/CodeBlock'

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <span className="doc-page__eyebrow">{doc.category}</span>
        <h1>{doc.name}</h1>
        <p className="doc-page__lead">{doc.summary}</p>
      </header>

      <CodeBlock code={doc.importLine} lang="ts" />

      <div className="doc-examples">
        {doc.examples.map((ex) => (
          <Example key={ex.title} example={ex} />
        ))}
      </div>

      <section className="doc-section">
        <h2 id="props">Props</h2>
        <PropsTable props={doc.props} />
        {doc.extraProps?.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <PropsTable props={group.props} />
          </div>
        ))}
      </section>
    </article>
  )
}
