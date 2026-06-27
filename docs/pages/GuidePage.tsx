import type { GuideDoc } from '../registry/guides'

export function GuidePage({ guide }: { guide: GuideDoc }) {
  return (
    <article className="doc-page doc-prose">
      <header className="doc-page__head">
        <span className="doc-page__eyebrow">Getting Started</span>
        <h1>{guide.title}</h1>
        <p className="doc-page__lead">{guide.summary}</p>
      </header>
      {guide.content}
    </article>
  )
}
