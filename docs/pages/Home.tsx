import {
  LiquidGlass,
  Button,
  Card,
  Badge,
  StatTile,
  Switch,
  ArrowRightIcon,
  ArrowUpRightIcon,
  SparkleIcon,
  CubeIcon,
  SunIcon,
} from '@hamidrezazargham/liquidkit'
import { CodeBlock } from '../ui/CodeBlock'

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card radius={22} className="home-feature">
      <span className="home-feature__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Card>
  )
}

export function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <Badge variant="accent" dot>
            v0.1 · React + TypeScript
          </Badge>
          <h1>
            Interfaces made of <span className="home-grad">glass</span>
          </h1>
          <p className="home-hero__lead">
            LiquidKit is a React component library built on one frosted liquid-glass surface —
            material, tint and depth from a single primitive. Light &amp; dark, ~13&nbsp;kB, zero
            runtime dependencies.
          </p>
          <div className="home-hero__cta">
            <Button
              as="a"
              href="#/guide/installation"
              size="lg"
              variant="accent"
              pill
              rightIcon={<ArrowRightIcon />}
            >
              Get started
            </Button>
            <Button as="a" href="#/components/liquid-glass" size="lg" pill>
              Browse components
            </Button>
          </div>
        </div>

        <div className="home-hero__demo">
          <div className="home-hero__demobg" />
          <LiquidGlass radius={26} interactive className="home-hero__panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <SparkleIcon size={22} />
              <strong style={{ fontSize: 18 }}>Liquid Glass</strong>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <StatTile glow accent="var(--lk-accent)" label="Components" value="40" size={120} />
              <StatTile
                glow
                accent="color-mix(in srgb, var(--lk-accent) 60%, var(--lk-fg))"
                label="Bundle"
                value="13kB"
                size={120}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', opacity: 0.8 }}>
                <SunIcon size={16} /> Theme
              </span>
              <Switch defaultChecked glow />
            </div>
          </LiquidGlass>
        </div>
      </section>

      <section className="home-features">
        <Feature
          icon={<CubeIcon />}
          title="One glass surface"
          desc="Frost, tint, bevel and sheen from a single primitive — every component composes it, so the whole kit stays consistent."
        />
        <Feature
          icon={<SunIcon />}
          title="Light & dark, designed"
          desc="Both themes are first-class and token-driven. Re-theme the whole kit with a handful of CSS variables."
        />
        <Feature
          icon={<SparkleIcon />}
          title="25 components + templates"
          desc="Buttons to dashboards, four full-page layouts, 34 icons — all composing one glass primitive."
        />
      </section>

      <section className="home-install">
        <div>
          <h2>Up and running in seconds</h2>
          <p>Install, import the stylesheet, wrap your app. That's it.</p>
          <Button
            as="a"
            href="#/guide/installation"
            variant="ghost"
            rightIcon={<ArrowUpRightIcon size={18} />}
          >
            Read the guide
          </Button>
        </div>
        <CodeBlock code={`npm install @hamidrezazargham/liquidkit`} lang="bash" />
        <CodeBlock
          code={`import '@hamidrezazargham/liquidkit/styles.css'
import { ThemeProvider, Button } from '@hamidrezazargham/liquidkit'

export default () => (
  <ThemeProvider>
    <Button variant="accent">Hello, glass</Button>
  </ThemeProvider>
)`}
        />
      </section>
    </div>
  )
}
