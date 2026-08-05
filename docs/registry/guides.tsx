import type { ReactNode } from 'react'
import { CodeBlock } from '../ui/CodeBlock'
import { PropsTable } from '../ui/PropsTable'
import { LiquidGlass, Button, Badge } from '@hamidrezazargham/liquidkit'

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
    'LiquidKit is a React component library built around a single frosted liquid-glass surface.',
  content: (
    <>
      <p>
        <strong>LiquidKit</strong> is a set of React + TypeScript components built on a single idea:
        one glass surface, composed everywhere. Every component frosts the live page behind it and
        layers a tint, a lit bevel and a specular sheen on top, so the whole kit reads as one
        material instead of a pile of unrelated effects.
      </p>

      <div className="doc-stage-inline">
        <LiquidGlass radius={22} interactive style={{ padding: '20px 26px' }}>
          <strong style={{ fontSize: 17 }}>Hello, glass</strong>
          <p style={{ margin: '4px 0 0', opacity: 0.7 }}>
            Frost, tint, bevel and sheen — from one primitive.
          </p>
        </LiquidGlass>
      </div>

      <h2>Why LiquidKit</h2>
      <ul className="doc-list">
        <li>
          <strong>One coherent material</strong> — frost, tint, bevel and sheen from a single
          primitive every component composes.
        </li>
        <li>
          <strong>Light &amp; dark, first-class</strong> — both themes are designed, not
          auto-inverted.
        </li>
        <li>
          <strong>~13 kB gzipped</strong> — zero runtime dependencies beyond React.
        </li>
        <li>
          <strong>25 components + 4 page templates</strong> — buttons to dashboards.
        </li>
        <li>
          <strong>Accessible &amp; graceful</strong> — keyboard-friendly, and degrading to a plain
          translucent panel where <code>backdrop-filter</code> is unsupported.
        </li>
      </ul>

      <h2>Browser support</h2>
      <p>
        The glass surface is a plain <code>backdrop-filter</code>, which every current browser
        supports — Chromium, Safari and Firefox all render it identically. Anywhere it is missing,
        surfaces fall back to a translucent tinted panel and the layout is unchanged.
      </p>
      <div className="doc-badges-row">
        <Badge variant="success" dot>
          Chrome / Edge
        </Badge>
        <Badge variant="success" dot>
          Safari
        </Badge>
        <Badge variant="success" dot>
          Firefox
        </Badge>
      </div>

      <h2>Next steps</h2>
      <p>
        Head to <a href="#/guide/installation">Installation</a> to add LiquidKit to your project, or
        jump straight to the <a href="#/components/liquid-glass">components</a>.
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
      <CodeBlock
        lang="bash"
        code={`npm install @hamidrezazargham/liquidkit
# or
pnpm add @hamidrezazargham/liquidkit
# or
yarn add @hamidrezazargham/liquidkit`}
      />

      <h2>2. Import the stylesheet</h2>
      <p>Import the CSS once, at the root of your app:</p>
      <CodeBlock lang="ts" code={`import '@hamidrezazargham/liquidkit/styles.css'`} />

      <h2>3. Wrap your app &amp; use a component</h2>
      <p>
        Wrap the tree in <code>ThemeProvider</code> so components inherit the theme tokens, then
        drop in any component.
      </p>
      <CodeBlock
        code={`import '@hamidrezazargham/liquidkit/styles.css'
import { ThemeProvider, Button, Card } from '@hamidrezazargham/liquidkit'

export default function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Card>
        <h2>Welcome</h2>
        <Button variant="accent">Get started</Button>
      </Card>
    </ThemeProvider>
  )
}`}
      />

      <div className="doc-callout">
        <strong>Peer dependencies.</strong> LiquidKit expects <code>react</code> and{' '}
        <code>react-dom</code> at version 18 or newer. It ships ESM and CJS builds plus full
        TypeScript types.
      </div>

      <p style={{ marginTop: 24 }}>
        <Button as="a" href="#/guide/theming" variant="accent" pill>
          Next: Theming →
        </Button>
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
        LiquidKit ships a full light <em>and</em> dark theme. Components never hard-code colors —
        they read <code>--lk-*</code> CSS custom properties, so you re-theme the whole library by
        overriding a handful of variables.
      </p>

      <h2>ThemeProvider</h2>
      <p>
        Wrap your app once. By default it renders a <code>.lk-root</code> wrapper carrying the{' '}
        <code>data-theme</code> attribute; pass <code>attach="html"</code> to set it on{' '}
        <code>&lt;html&gt;</code> instead.
      </p>
      <CodeBlock
        code={`<ThemeProvider defaultMode="system" storageKey="theme">
  <App />
</ThemeProvider>`}
      />
      <PropsTable
        props={[
          {
            name: 'defaultMode',
            type: "'light' | 'dark' | 'system'",
            default: "'system'",
            description: 'Initial mode.',
          },
          {
            name: 'attach',
            type: "'wrapper' | 'html'",
            default: "'wrapper'",
            description: 'Where data-theme is applied.',
          },
          {
            name: 'storageKey',
            type: 'string',
            description: 'Persist the chosen mode in localStorage under this key.',
          },
          { name: 'children', type: 'ReactNode', required: true, description: 'Your app.' },
        ]}
      />

      <h2>Reading &amp; flipping the theme</h2>
      <p>
        Use the <code>useTheme</code> hook anywhere inside the provider, or drop in the pre-wired{' '}
        <a href="#/components/theme-toggle">ThemeToggle</a>.
      </p>
      <CodeBlock
        code={`import { useTheme } from '@hamidrezazargham/liquidkit'

function Header() {
  const { theme, mode, setMode, toggle } = useTheme()
  return <button onClick={toggle}>Theme: {theme}</button>
}`}
      />

      <h2>Design tokens</h2>
      <p>
        Override any token under a <code>:root</code> or <code>[data-theme]</code> selector. The
        most common change is the accent color:
      </p>
      <CodeBlock
        lang="css"
        code={`:root {
  --lk-accent: #7c5cff;          /* brand color */
  --lk-radius-lg: 20px;          /* global rounding */
  --lk-glass-blur: 10px;         /* frost amount   */
  --lk-glass-saturate: 1.7;      /* backdrop pop   */
}

[data-theme='dark'] {
  --lk-bg: #07080c;
}`}
      />

      <h3>Token groups</h3>
      <ul className="doc-list">
        <li>
          <code>--lk-bg</code>, <code>--lk-fg</code>, <code>--lk-fg-muted</code>,{' '}
          <code>--lk-fg-subtle</code> — surface &amp; text.
        </li>
        <li>
          <code>--lk-accent</code>, <code>--lk-accent-fg</code> — brand color &amp; its contrast
          text.
        </li>
        <li>
          <code>--lk-glass-tint</code>, <code>--lk-glass-border</code>, <code>--lk-glass-blur</code>
          , <code>--lk-glass-saturate</code> — the glass material.
        </li>
        <li>
          <code>--lk-radius-*</code>, <code>--lk-shadow-*</code>, <code>--lk-duration*</code>,{' '}
          <code>--lk-ease</code> — shape &amp; motion.
        </li>
      </ul>

      <div className="doc-callout">
        <strong>Reduced motion.</strong> All transitions respect <code>prefers-reduced-motion</code>{' '}
        and fall back to instant state changes.
      </div>
    </>
  ),
}

/* ----------------------------------------------------------- The surface */

const engine: GuideDoc = {
  slug: 'glass-engine',
  title: 'The Glass Surface',
  summary: 'How a LiquidKit surface is built: a frosted backdrop plus four stacked layers.',
  content: (
    <>
      <div className="doc-callout">
        <strong>The SVG displacement engine has been removed.</strong> Earlier versions bent the
        backdrop through an <code>feDisplacementMap</code> to fake refraction. It never looked
        convincing at real component sizes, only ran on Chromium, and cost a GPU pass per surface —
        so it is gone. Glass is now a frosted blur. The <code>refraction</code>,{' '}
        <code>dispersion</code>, <code>bezel</code> and <code>glass</code> props are still accepted
        so existing code compiles, but they do nothing and will be deleted in the next major.
      </div>

      <p>
        Every surface in the kit is the <a href="#/components/liquid-glass">LiquidGlass</a>{' '}
        primitive. It stacks four absolutely-positioned layers under your content, so the material
        reads as one piece of glass rather than a stack of effects.
      </p>

      <h2>How it works</h2>
      <ol className="doc-list">
        <li>
          <strong>Frost</strong> — a <code>backdrop-filter</code> of{' '}
          <code>blur() saturate() brightness()</code> over whatever sits behind the surface. This is
          the entire optical effect; <code>blur</code> and <code>material</code> control it.
        </li>
        <li>
          <strong>Tint</strong> — a translucent color wash, from <code>tint</code> and{' '}
          <code>material</code>, giving the glass its body.
        </li>
        <li>
          <strong>Bevel</strong> — a border-only gradient that catches light along the rim.
        </li>
        <li>
          <strong>Sheen</strong> — a specular highlight riding the top and bottom edges. Turn it off
          with <code>sheen={'{false}'}</code>.
        </li>
      </ol>

      <h2>The knobs</h2>
      <PropsTable
        props={[
          {
            name: 'blur',
            type: 'number',
            default: '8',
            description:
              'Frost radius in px. Overrides material. Defaults to the --lk-glass-blur token.',
          },
          {
            name: 'material',
            type: `'clear' | 'ultraThin' | 'thin' | 'regular' | 'thick'`,
            description:
              'Apple-style thickness — sets both the frost and the auto-tint opacity in one prop.',
          },
          {
            name: 'tint',
            type: `'auto' | 'clear' | 'light' | 'dark' | 'accent'`,
            default: `'auto'`,
            description: 'Color of the wash. auto follows the theme; accent picks up your brand.',
          },
        ]}
      />
      <CodeBlock
        code={`// barely-there pane
<LiquidGlass material="clear" tint="clear" />

// heavy frosted panel
<LiquidGlass material="thick" blur={28} />`}
      />

      <p>
        Try every combination on the <a href="#/playground">playground</a>.
      </p>

      <div className="doc-callout">
        <strong>Performance tip.</strong> Avoid deeply nesting glass surfaces — each one is its own{' '}
        <code>backdrop-filter</code>, and stacking them multiplies GPU work for an effect you mostly
        can&rsquo;t see. Prefer a plain container for the inner element.
      </div>
    </>
  ),
}

/* ---------------------------------------------------------- Performance */

const performance: GuideDoc = {
  slug: 'performance',
  title: 'Performance',
  summary:
    'How LiquidKit keeps dozens of live glass surfaces cheap — and the one knob to tune it app-wide.',
  content: (
    <>
      <p>
        A glass surface is a <code>backdrop-filter</code>, which the browser re-evaluates on the GPU
        whenever anything behind it moves. A page with many surfaces (a dashboard, a node graph) can
        allocate a lot of GPU memory, so LiquidKit bounds that cost automatically — no configuration
        required.
      </p>

      <h2>Automatic, and invisible</h2>
      <ul className="doc-list">
        <li>
          <strong>Off-screen surfaces are paused.</strong> A shared{' '}
          <code>IntersectionObserver</code> drops the <code>backdrop-filter</code> (freeing its GPU
          texture) on any surface scrolled out of view and restores it just before it scrolls back —
          so cost tracks what is actually on screen, not what exists in the DOM.
        </li>
        <li>
          <strong>Surfaces are memoized.</strong> Every glass component is wrapped in{' '}
          <code>React.memo</code>, so a parent re-render doesn&rsquo;t cascade into rebuilding a
          backdrop-filter on each surface underneath it.
        </li>
      </ul>
      <p>
        None of this changes how anything looks — it only removes work the browser was doing off
        screen or throwing away.
      </p>

      <h2>Tuning it app-wide</h2>
      <p>
        Wrap your app in an optional <code>GlassConfigProvider</code> to tune glass everywhere at
        once. It is entirely optional; without it, every surface runs at full fidelity.
      </p>
      <PropsTable
        props={[
          {
            name: 'performance',
            type: `'high' | 'balanced' | 'low'`,
            default: `'high'`,
            description:
              'Fidelity tier. high = full frost (unchanged). balanced = same as high today. low = a gentler blur radius, for weak hardware.',
          },
          {
            name: 'pauseOffscreen',
            type: 'boolean',
            default: 'true',
            description: 'Release the backdrop-filter on surfaces scrolled out of view.',
          },
        ]}
      />
      <CodeBlock
        code={`import { GlassConfigProvider } from '@hamidrezazargham/liquidkit'

// Full fidelity everywhere (the default — provider optional):
<App />

// Lighter glass on constrained devices, nothing removed by default:
<GlassConfigProvider performance="balanced">
  <App />
</GlassConfigProvider>`}
      />
      <div className="doc-callout">
        <strong>Nothing changes unless you opt in.</strong> The default <code>high</code> tier is
        byte-for-byte identical to setting no tier at all. <code>low</code> is an escape hatch for
        weak hardware — it trades some blur radius for a much cheaper composite.
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
        <a
          href="https://developer.mozilla.org/docs/Web/CSS/easing-function#linear_easing_function"
          target="_blank"
          rel="noreferrer"
        >
          <code>linear()</code>
        </a>{' '}
        easings, so every interaction overshoots a touch and settles — the way a physical control
        does. Drop them anywhere you’d put a <code>cubic-bezier</code>.
      </p>

      <div
        className="doc-stage-inline"
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <Button variant="accent">Press me</Button>
        <LiquidGlass className="lk-lift" radius={18} style={{ padding: '16px 20px' }}>
          <code>.lk-lift</code>
        </LiquidGlass>
        <Badge variant="accent" className="lk-spring-in">
          .lk-spring-in
        </Badge>
      </div>

      <h2>Spring easings</h2>
      <ul className="doc-list">
        <li>
          <code>--lk-spring</code> — gentle, ~3% overshoot. Lifts, reveals &amp; morphs (the
          default).
        </li>
        <li>
          <code>--lk-spring-snappy</code> — ~8% overshoot. Press-back, toggles &amp; dropdowns.
        </li>
        <li>
          <code>--lk-spring-bounce</code> — ~16% overshoot. Entrances &amp; the “gel” pop.
        </li>
        <li>
          <code>--lk-spring-smooth</code> — no overshoot; a critically-damped ease.
        </li>
      </ul>
      <CodeBlock
        lang="css"
        code={`.thing {
  transition: transform var(--lk-spring-duration) var(--lk-spring);
}`}
      />

      <h2>Press, lift &amp; morph</h2>
      <p>
        Three composable utility classes carry the Apple control feel. The{' '}
        <a href="#/components/liquid-glass">LiquidGlass</a> <code>interactive</code> prop already
        applies lift + press, so <a href="#/components/button">Button</a> and friends are tactile
        out of the box.
      </p>
      <CodeBlock
        lang="html"
        code={`<button class="lk-press">snaps down, springs back</button>
<div class="lk-lift">floats up on hover, squishes on click</div>
<div class="lk-morph">width / height / radius animate fluidly</div>
<div class="lk-spring-in">gel-like entrance on mount</div>`}
      />
      <ul className="doc-list">
        <li>
          <code>.lk-press</code> — snaps down fast on <code>:active</code>, springs back with a
          tactile overshoot.
        </li>
        <li>
          <code>.lk-lift</code> — floats up on hover; presses in on click.
        </li>
        <li>
          <code>.lk-morph</code> — set a new width, height or <code>border-radius</code> and it
          springs to it — the Liquid Glass “reflow”.
        </li>
        <li>
          <code>.lk-spring-in</code> — a bouncy scale + fade entrance.
        </li>
      </ul>

      <h2>Hooks</h2>
      <p>
        Two hooks bring the same physics into JS. <code>useScrollDirection</code> is the primitive
        behind scroll-reactive chrome — a tab bar that condenses as you scroll down and expands when
        you scroll up or reach the top.
      </p>
      <CodeBlock
        code={`import { useReducedMotion, useScrollDirection } from '@hamidrezazargham/liquidkit'

function Chrome() {
  const reduced = useReducedMotion()
  const { direction, atTop } = useScrollDirection()
  const condensed = direction === 'down' && !atTop
  // …shrink the bar when condensed
}`}
      />

      <div className="doc-callout">
        <strong>Reduced motion.</strong> Every spring respects <code>prefers-reduced-motion</code>{' '}
        and collapses to an instant state change. <code>useReducedMotion()</code> lets you mirror
        that in your own JS animations.
      </div>
    </>
  ),
}

/* -------------------------------------------------------- Accessibility */

const accessibility: GuideDoc = {
  slug: 'accessibility',
  title: 'Accessibility',
  summary:
    'Glass answers the OS settings that are about glass — reduced transparency, increased contrast and reduced motion.',
  content: (
    <>
      <p>
        Translucency is the whole point of LiquidKit, which is exactly why it has to be switchable.
        Three OS-level preferences change how a glass surface renders, and they are{' '}
        <em>independent</em> — someone can want a still, translucent interface, or a moving, opaque
        one. LiquidKit handles each on its own; you don’t have to wire anything up.
      </p>

      <h2>Reduced transparency</h2>
      <p>
        Under <code>prefers-reduced-transparency: reduce</code> (macOS &amp; iOS{' '}
        <em>Reduce Transparency</em>, Windows <em>Transparency effects</em> off) every surface drops
        its <code>backdrop-filter</code> entirely and the tint becomes opaque, so text keeps its
        contrast without the frost behind it. The specular sheen is hidden too — it reads as grime
        on a surface that is no longer a material. The blur is removed rather than set to{' '}
        <code>0px</code>, because a zero-radius filter still costs a compositing pass.
      </p>

      <h2>Increased contrast</h2>
      <p>
        <code>prefers-contrast: more</code> does everything reduced transparency does, and
        additionally replaces the soft light-catching hairline with a solid, contrasting border,
        collapses the muted text ramp onto the primary foreground colour, and widens the focus ring
        to 3px.
      </p>

      <h2>Reduced motion</h2>
      <p>
        <code>prefers-reduced-motion: reduce</code> collapses springs, lifts and entrance animations
        to instant state changes. Use <code>useReducedMotion()</code> to mirror that in your own JS
        animation.
      </p>

      <h2>Overriding it</h2>
      <p>Two tokens drive the opaque fallback, so you can point them somewhere else:</p>
      <CodeBlock
        lang="css"
        code={`:root {
  --lk-glass-solid: #ffffff;  /* surface used when translucency is off */
  --lk-scrim-solid: rgba(0, 0, 0, 0.6);
}`}
      />

      <div className="doc-callout">
        <strong>Building your own glass surface?</strong> Any new <code>backdrop-filter</code> in
        this repo must be listed in <code>src/styles/a11y.css</code>. A test walks every stylesheet
        and fails the build if a surface isn’t covered, so these fallbacks can’t silently rot.
      </div>
    </>
  ),
}

export const guides: GuideDoc[] = [
  introduction,
  installation,
  theming,
  engine,
  performance,
  motion,
  accessibility,
]
export const guideMap = Object.fromEntries(guides.map((g) => [g.slug, g]))
