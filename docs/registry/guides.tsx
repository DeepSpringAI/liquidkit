import type { ReactNode } from 'react'
import { CodeBlock } from '../ui/CodeBlock'
import { PropsTable } from '../ui/PropsTable'
import { LiquidGlass, Button, Badge } from 'liquidkit'

export interface GuideDoc {
  slug: string
  title: string
  summary: string
  content: ReactNode
}

/* --------------------------------------------------------- Introduction */

const introduction: GuideDoc = {
  slug: 'introduction',
  title: 'Introduction',
  summary:
    'LiquidKit is a React component library built around a real liquid-glass surface — content is refracted, not just blurred.',
  content: (
    <>
      <p>
        <strong>LiquidKit</strong> is a set of React + TypeScript components built on a single idea: a
        glass surface that <em>refracts</em> the live page behind it. Instead of a flat frosted blur,
        every surface bends light at its edges through an SVG displacement filter, with an optional
        chromatic fringe — the way real glass behaves.
      </p>

      <div className="doc-stage-inline">
        <LiquidGlass radius={22} interactive style={{ padding: '20px 26px' }}>
          <strong style={{ fontSize: 17 }}>Hello, glass</strong>
          <p style={{ margin: '4px 0 0', opacity: 0.7 }}>Drag this site's slider behind a panel to see it bend.</p>
        </LiquidGlass>
      </div>

      <h2>Why LiquidKit</h2>
      <ul className="doc-list">
        <li><strong>True refraction</strong> — real edge lensing &amp; chromatic dispersion, not a flat blur.</li>
        <li><strong>Light &amp; dark, first-class</strong> — both themes are designed, not auto-inverted.</li>
        <li><strong>~13 kB gzipped</strong> — zero runtime dependencies beyond React.</li>
        <li><strong>25 components + 4 page templates</strong> — buttons to dashboards.</li>
        <li><strong>Accessible &amp; graceful</strong> — keyboard-friendly, with a frosted fallback where <code>backdrop-filter</code> is unsupported.</li>
      </ul>

      <h2>Browser support</h2>
      <p>
        The refraction effect relies on <code>backdrop-filter</code> with an SVG filter reference. It is
        fully supported in Chromium-based browsers. Safari and Firefox render a denser frosted-glass
        fallback automatically — the layout and components are identical, only the edge lensing differs.
      </p>
      <div className="doc-badges-row">
        <Badge variant="success" dot>Chrome / Edge — full</Badge>
        <Badge variant="warning" dot>Safari — frosted fallback</Badge>
        <Badge variant="warning" dot>Firefox — frosted fallback</Badge>
      </div>

      <h2>Next steps</h2>
      <p>
        Head to <a href="#/guide/installation">Installation</a> to add LiquidKit to your project, or jump
        straight to the <a href="#/components/liquid-glass">components</a>.
      </p>
    </>
  ),
}

/* ---------------------------------------------------------- Installation */

const installation: GuideDoc = {
  slug: 'installation',
  title: 'Installation',
  summary: 'Add LiquidKit to a React 18+ project in three steps.',
  content: (
    <>
      <h2>1. Install</h2>
      <CodeBlock lang="bash" code={`npm install liquidkit
# or
pnpm add liquidkit
# or
yarn add liquidkit`} />

      <h2>2. Import the stylesheet</h2>
      <p>Import the CSS once, at the root of your app:</p>
      <CodeBlock lang="ts" code={`import 'liquidkit/styles.css'`} />

      <h2>3. Wrap your app &amp; use a component</h2>
      <p>
        Wrap the tree in <code>ThemeProvider</code> so components inherit the theme tokens, then drop in
        any component.
      </p>
      <CodeBlock code={`import 'liquidkit/styles.css'
import { ThemeProvider, Button, Card } from 'liquidkit'

export default function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Card>
        <h2>Welcome</h2>
        <Button variant="accent">Get started</Button>
      </Card>
    </ThemeProvider>
  )
}`} />

      <div className="doc-callout">
        <strong>Peer dependencies.</strong> LiquidKit expects <code>react</code> and{' '}
        <code>react-dom</code> at version 18 or newer. It ships ESM and CJS builds plus full TypeScript
        types.
      </div>

      <p style={{ marginTop: 24 }}>
        <Button as="a" href="#/guide/theming" variant="accent" pill>Next: Theming →</Button>
      </p>
    </>
  ),
}

/* -------------------------------------------------------------- Theming */

const theming: GuideDoc = {
  slug: 'theming',
  title: 'Theming',
  summary: 'Light and dark are both first-class. Everything is driven by CSS custom properties.',
  content: (
    <>
      <p>
        LiquidKit ships a full light <em>and</em> dark theme. Components never hard-code colors — they
        read <code>--lk-*</code> CSS custom properties, so you re-theme the whole library by overriding a
        handful of variables.
      </p>

      <h2>ThemeProvider</h2>
      <p>
        Wrap your app once. By default it renders a <code>.lk-root</code> wrapper carrying the{' '}
        <code>data-theme</code> attribute; pass <code>attach="html"</code> to set it on{' '}
        <code>&lt;html&gt;</code> instead.
      </p>
      <CodeBlock code={`<ThemeProvider defaultMode="system" storageKey="theme">
  <App />
</ThemeProvider>`} />
      <PropsTable
        props={[
          { name: 'defaultMode', type: "'light' | 'dark' | 'system'", default: "'system'", description: 'Initial mode.' },
          { name: 'attach', type: "'wrapper' | 'html'", default: "'wrapper'", description: 'Where data-theme is applied.' },
          { name: 'storageKey', type: 'string', description: 'Persist the chosen mode in localStorage under this key.' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Your app.' },
        ]}
      />

      <h2>Reading &amp; flipping the theme</h2>
      <p>
        Use the <code>useTheme</code> hook anywhere inside the provider, or drop in the pre-wired{' '}
        <a href="#/components/theme-toggle">ThemeToggle</a>.
      </p>
      <CodeBlock code={`import { useTheme } from 'liquidkit'

function Header() {
  const { theme, mode, setMode, toggle } = useTheme()
  return <button onClick={toggle}>Theme: {theme}</button>
}`} />

      <h2>Design tokens</h2>
      <p>
        Override any token under a <code>:root</code> or <code>[data-theme]</code> selector. The most
        common change is the accent color:
      </p>
      <CodeBlock lang="css" code={`:root {
  --lk-accent: #7c5cff;          /* brand color */
  --lk-radius-lg: 20px;          /* global rounding */
  --lk-glass-blur: 10px;         /* frost amount   */
  --lk-glass-saturate: 1.7;      /* backdrop pop   */
}

[data-theme='dark'] {
  --lk-bg: #07080c;
}`} />

      <h3>Token groups</h3>
      <ul className="doc-list">
        <li><code>--lk-bg</code>, <code>--lk-fg</code>, <code>--lk-fg-muted</code>, <code>--lk-fg-subtle</code> — surface &amp; text.</li>
        <li><code>--lk-accent</code>, <code>--lk-accent-fg</code> — brand color &amp; its contrast text.</li>
        <li><code>--lk-glass-tint</code>, <code>--lk-glass-border</code>, <code>--lk-glass-blur</code>, <code>--lk-glass-saturate</code> — the glass material.</li>
        <li><code>--lk-radius-*</code>, <code>--lk-shadow-*</code>, <code>--lk-duration*</code>, <code>--lk-ease</code> — shape &amp; motion.</li>
      </ul>

      <div className="doc-callout">
        <strong>Reduced motion.</strong> All transitions respect{' '}
        <code>prefers-reduced-motion</code> and fall back to instant state changes.
      </div>
    </>
  ),
}

/* ----------------------------------------------------------- The engine */

const engine: GuideDoc = {
  slug: 'glass-engine',
  title: 'The Glass Engine',
  summary: 'How LiquidKit bends light: an SVG displacement filter applied as a backdrop-filter.',
  content: (
    <>
      <p>
        The effect that makes LiquidKit “liquid” is real refraction. Every surface is the{' '}
        <a href="#/components/liquid-glass">LiquidGlass</a> primitive, which applies an SVG{' '}
        <code>&lt;filter&gt;</code> to the content <em>behind</em> it via{' '}
        <code>backdrop-filter</code>.
      </p>

      <h2>How it works</h2>
      <ol className="doc-list">
        <li>
          A <strong>displacement map</strong> is generated as an SVG image: a flat neutral interior with
          gradient ramps in a band around the edges. Red encodes horizontal shift, green vertical.
        </li>
        <li>
          <code>feDisplacementMap</code> uses that map to push each backdrop pixel sideways — strongly at
          the rim, not at all in the center. That is the convex-lens look.
        </li>
        <li>
          For <strong>chromatic dispersion</strong>, the displacement runs three times at slightly
          different scales for the R / G / B channels, then recombines — producing the rainbow fringe at
          the edge.
        </li>
        <li>
          Filters are de-duplicated in a reference-counted registry and sized to each element with a{' '}
          <code>ResizeObserver</code>, so hundreds of glass surfaces share a handful of filter
          definitions.
        </li>
      </ol>

      <h2>The knobs</h2>
      <p>Three props on any glass surface shape the material:</p>
      <PropsTable
        props={[
          { name: 'refraction', type: 'number', default: '46', description: 'Displacement scale — how hard the edge bends light.' },
          { name: 'dispersion', type: 'number', default: '2', description: 'Per-channel split in px. 0 = clean glass, no rainbow.' },
          { name: 'bezel', type: 'number', default: '14', description: 'Width of the refracting edge band. Larger = thicker rim.' },
        ]}
      />
      <CodeBlock code={`// clean, subtle glass
<LiquidGlass refraction={20} dispersion={0} />

// thick, prismatic lens
<LiquidGlass refraction={90} dispersion={14} bezel={22} />`} />

      <h2>Graceful fallback</h2>
      <p>
        Where <code>backdrop-filter</code> with SVG references is unavailable (Safari, Firefox), an{' '}
        <code>@supports</code> query swaps in a denser frosted tint automatically. You can also opt out of
        refraction per-surface — useful when nesting glass inside glass:
      </p>
      <CodeBlock code={`<LiquidGlass glass={false}>
  {/* frosted blur only — no displacement filter */}
</LiquidGlass>`} />

      <div className="doc-callout">
        <strong>Performance tip.</strong> Avoid deeply nesting refractive surfaces — stacking
        displacement filters is expensive and can balloon the filter region. Components like{' '}
        <a href="#/components/dock">Dock</a> and <a href="#/components/toolbar">Toolbar</a> expose a{' '}
        <code>glass={'{false}'}</code> prop for exactly this case.
      </div>
    </>
  ),
}

/* --------------------------------------------------------------- Motion */

const motion: GuideDoc = {
  slug: 'motion',
  title: 'Motion',
  summary:
    'Real spring physics — overshoot and settle — exposed as CSS easings, plus drop-in press, lift and morph behaviors.',
  content: (
    <>
      <p>
        iOS 26 and macOS 26 don’t ease — they <em>spring</em>. LiquidKit ships three spring curves
        sampled from a damped harmonic oscillator and exposed as CSS{' '}
        <a href="https://developer.mozilla.org/docs/Web/CSS/easing-function#linear_easing_function" target="_blank" rel="noreferrer">
          <code>linear()</code>
        </a>{' '}
        easings, so every interaction overshoots a touch and settles — the way a physical control
        does. Drop them anywhere you’d put a <code>cubic-bezier</code>.
      </p>

      <div className="doc-stage-inline" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="accent">Press me</Button>
        <LiquidGlass className="lk-lift" radius={18} style={{ padding: '16px 20px' }}>
          <code>.lk-lift</code>
        </LiquidGlass>
        <Badge variant="accent" className="lk-spring-in">.lk-spring-in</Badge>
      </div>

      <h2>Spring easings</h2>
      <ul className="doc-list">
        <li><code>--lk-spring</code> — gentle, ~3% overshoot. Lifts, reveals &amp; morphs (the default).</li>
        <li><code>--lk-spring-snappy</code> — ~8% overshoot. Press-back, toggles &amp; dropdowns.</li>
        <li><code>--lk-spring-bounce</code> — ~16% overshoot. Entrances &amp; the “gel” pop.</li>
        <li><code>--lk-spring-smooth</code> — no overshoot; a critically-damped ease.</li>
      </ul>
      <CodeBlock lang="css" code={`.thing {
  transition: transform var(--lk-spring-duration) var(--lk-spring);
}`} />

      <h2>Press, lift &amp; morph</h2>
      <p>
        Three composable utility classes carry the Apple control feel. The{' '}
        <a href="#/components/liquid-glass">LiquidGlass</a> <code>interactive</code> prop already
        applies lift + press, so <a href="#/components/button">Button</a> and friends are tactile out
        of the box.
      </p>
      <CodeBlock lang="html" code={`<button class="lk-press">snaps down, springs back</button>
<div class="lk-lift">floats up on hover, squishes on click</div>
<div class="lk-morph">width / height / radius animate fluidly</div>
<div class="lk-spring-in">gel-like entrance on mount</div>`} />
      <ul className="doc-list">
        <li><code>.lk-press</code> — snaps down fast on <code>:active</code>, springs back with a tactile overshoot.</li>
        <li><code>.lk-lift</code> — floats up on hover; presses in on click.</li>
        <li><code>.lk-morph</code> — set a new width, height or <code>border-radius</code> and it springs to it — the Liquid Glass “reflow”.</li>
        <li><code>.lk-spring-in</code> — a bouncy scale + fade entrance.</li>
      </ul>

      <h2>Hooks</h2>
      <p>
        Two hooks bring the same physics into JS. <code>useScrollDirection</code> is the primitive
        behind scroll-reactive chrome — a tab bar that condenses as you scroll down and expands when
        you scroll up or reach the top.
      </p>
      <CodeBlock code={`import { useReducedMotion, useScrollDirection } from 'liquidkit'

function Chrome() {
  const reduced = useReducedMotion()
  const { direction, atTop } = useScrollDirection()
  const condensed = direction === 'down' && !atTop
  // …shrink the bar when condensed
}`} />

      <div className="doc-callout">
        <strong>Reduced motion.</strong> Every spring respects{' '}
        <code>prefers-reduced-motion</code> and collapses to an instant state change.{' '}
        <code>useReducedMotion()</code> lets you mirror that in your own JS animations.
      </div>
    </>
  ),
}

export const guides: GuideDoc[] = [introduction, installation, theming, engine, motion]
export const guideMap = Object.fromEntries(guides.map((g) => [g.slug, g]))
