import { Button, Card, ArrowUpRightIcon } from '@hamidrezazargham/liquidkit'
import { scenes } from '../scenes'

export function TemplatesPage() {
  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <span className="doc-page__eyebrow">Resources</span>
        <h1>Templates</h1>
        <p className="doc-page__lead">
          Ready-made, full-page layouts composed entirely from LiquidKit components. Each opens
          full-screen — resize and toggle the theme to see them adapt.
        </p>
      </header>

      <div className="doc-templates">
        {scenes.map((s) => (
          <Card key={s.slug} radius={22} className="doc-template-card">
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <Button
              as="a"
              href={`#/preview/${s.slug}`}
              variant="accent"
              pill
              rightIcon={<ArrowUpRightIcon size={18} />}
            >
              View live
            </Button>
          </Card>
        ))}
      </div>

      <div className="doc-callout" style={{ marginTop: 28 }}>
        Import any template from the package root, e.g.{' '}
        <code>import {'{ LandingHero, PricingPage }'} from '@hamidrezazargham/liquidkit'</code>.
      </div>
    </article>
  )
}
