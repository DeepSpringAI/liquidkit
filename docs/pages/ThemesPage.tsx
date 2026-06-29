import { useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  LiquidGlass,
  Progress,
  Switch,
  palettes,
  themePresets,
} from 'liquidkit'

const PALETTE_LABEL = Object.fromEntries(themePresets.map((p) => [p.name, p.label]))

/** The Themes gallery: the base/default look first, then the named presets. */
const GALLERY = [{ name: '', label: 'Default' }, ...themePresets]

/** Key semantic tokens that define a theme's color, shown for the default. */
const DEFAULT_TOKENS = [
  '--lk-accent',
  '--lk-accent-soft',
  '--lk-bg',
  '--lk-bg-elev',
  '--lk-fg',
  '--lk-fg-muted',
] as const

/** One mode's column of default-theme token chips, with values read live from
 *  a `data-theme`-pinned, palette-less wrapper (so it always shows the base
 *  theme, never the picker's active palette — and no hex is hardcoded). */
function DefaultModeSwatches({ mode }: { mode: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!ref.current) return
    const cs = getComputedStyle(ref.current)
    setValues(
      Object.fromEntries(DEFAULT_TOKENS.map((t) => [t, cs.getPropertyValue(t).trim()])),
    )
  }, [])

  return (
    <div className="doc-token-mode" ref={ref} data-theme={mode}>
      <div className="doc-token-mode__label">{mode}</div>
      <div className="doc-swatch-row">
        {DEFAULT_TOKENS.map((token) => (
          <div key={token} className="doc-swatch" title={`${token} · ${values[token] ?? ''}`}>
            <span className="doc-swatch__chip" style={{ background: `var(${token})` }} />
            <span className="doc-swatch__name">{token.replace('--lk-', '')}</span>
            <span className="doc-swatch__hex">{values[token] || '…'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A palette's named swatches as a labelled row of color chips. */
function SwatchGroup({ name, swatches }: { name: string; swatches: Record<string, string> }) {
  return (
    <div className="doc-swatch-group">
      <div className="doc-swatch-group__head">
        <strong>{PALETTE_LABEL[name] ?? name}</strong>
        <code>--lk-{name}-*</code>
      </div>
      <div className="doc-swatch-row">
        {Object.entries(swatches).map(([swatch, hex]) => (
          <div key={swatch} className="doc-swatch" title={`${swatch} · ${hex}`}>
            <span className="doc-swatch__chip" style={{ background: hex }} />
            <span className="doc-swatch__name">{swatch}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A compact glass scene rendered under one palette + mode. */
function Vignette({ name, label, mode }: { name: string; label: string; mode: 'light' | 'dark' }) {
  return (
    <div
      className="doc-theme-vignette"
      data-theme={mode}
      data-palette={name || undefined}
      style={{ background: 'var(--lk-bg)', color: 'var(--lk-fg)' }}
    >
      <div className="doc-theme-vignette__mode">{mode}</div>
      <LiquidGlass
        elevation={2}
        style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={name || label} size={28} />
          <div style={{ fontWeight: 600, fontSize: 13 }}>Liquid Glass</div>
          <Switch defaultChecked aria-label="demo" style={{ marginLeft: 'auto' }} />
        </div>
        <Progress value={68} />
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="accent" pill>
            Primary
          </Button>
          <Button size="sm" variant="ghost" pill>
            Ghost
          </Button>
        </div>
      </LiquidGlass>
    </div>
  )
}

/** One palette, shown in both its light and dark variants. */
function PaletteCard({ name, label }: { name: string; label: string }) {
  return (
    <div className="doc-theme-card">
      <div className="doc-theme-card__head">
        <strong>{label}</strong>
        {name ? <code>data-palette=&quot;{name}&quot;</code> : <code>base theme · no data-palette</code>}
      </div>
      <div className="doc-theme-variants">
        <Vignette name={name} label={label} mode="light" />
        <Vignette name={name} label={label} mode="dark" />
      </div>
    </div>
  )
}

export function ThemesPage() {
  return (
    <article className="doc-page">
      <header className="doc-page__head">
        <span className="doc-page__eyebrow">Resources</span>
        <h1>Themes</h1>
        <p className="doc-page__lead">
          Preset themes that ship with the library. Each is a full palette with its own light{' '}
          <em>and</em> dark variant — the light/dark toggle switches between the two. Theme
          (palette) and mode (light/dark) are independent axes, so any theme works in either mode.
        </p>
      </header>

      <div className="doc-callout">
        Presets are an <strong>optional</strong> stylesheet, so they add nothing to your bundle
        unless you opt in:
        <pre style={{ margin: '10px 0 0' }}>
          <code>
            {`import 'liquidkit/styles.css'   // required core
import 'liquidkit/themes.css'   // these presets`}
          </code>
        </pre>
      </div>

      <p style={{ margin: '20px 0 6px', color: 'var(--lk-fg-muted)' }}>
        Pick a palette by name; the toggle still controls light/dark:
      </p>
      <Card radius={18} style={{ marginBottom: 28 }}>
        <pre style={{ margin: 0 }}>
          <code>
            {`<div data-theme="dark" data-palette="aurora"> … </div>

// or, with persistence (palette saved under "theme-palette"):
<ThemeProvider defaultMode="dark" defaultPalette="aurora" storageKey="theme"> … </ThemeProvider>`}
          </code>
        </pre>
      </Card>

      <div className="doc-theme-grid">
        {GALLERY.map((theme) => (
          <PaletteCard key={theme.name || 'default'} name={theme.name} label={theme.label} />
        ))}
      </div>

      <div className="doc-callout" style={{ marginTop: 28 }}>
        Build a theme picker from the exported list:{' '}
        <code>import {'{ themePresets }'} from 'liquidkit'</code> — each entry has <code>name</code>{' '}
        and <code>label</code>. Try them live from the picker in the sidebar.
      </div>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ margin: '0 0 6px' }}>The default theme</h2>
        <p className="doc-page__lead" style={{ fontSize: 15 }}>
          The look you get out of the box — no <code>data-palette</code>, no{' '}
          <code>themes.css</code> needed. It&apos;s defined by the core semantic tokens, so these are
          the colors every component inherits by default. Here are its key colors in both modes:
        </p>
        <Card radius={18} style={{ marginTop: 18 }}>
          <div className="doc-token-modes">
            <DefaultModeSwatches mode="light" />
            <DefaultModeSwatches mode="dark" />
          </div>
        </Card>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ margin: '0 0 6px' }}>Raw palette swatches</h2>
        <p className="doc-page__lead" style={{ fontSize: 15 }}>
          Need a single color instead of a whole theme? Every named swatch behind the presets is
          also exposed on its own — as a CSS variable and a JS value. These are <em>raw</em> colors,
          not the semantic tokens, so reach for them when building your own surfaces.
        </p>

        <div className="doc-callout">
          Another optional stylesheet — nothing ships unless you opt in:
          <pre style={{ margin: '10px 0 0' }}>
            <code>
              {`import 'liquidkit/palettes.css'

.promo { background: var(--lk-amber-flame-amber); }`}
            </code>
          </pre>
        </div>

        <p style={{ margin: '20px 0 6px', color: 'var(--lk-fg-muted)' }}>
          …or grab them in JS (fully typed):
        </p>
        <Card radius={18} style={{ marginBottom: 28 }}>
          <pre style={{ margin: 0 }}>
            <code>
              {`import { palettes } from 'liquidkit'

palettes.amber.flameAmber // '#F78358'`}
            </code>
          </pre>
        </Card>

        <div className="doc-swatch-groups">
          {Object.entries(palettes).map(([name, swatches]) => (
            <SwatchGroup key={name} name={name} swatches={swatches} />
          ))}
        </div>
      </section>
    </article>
  )
}
