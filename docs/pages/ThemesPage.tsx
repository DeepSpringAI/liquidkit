import { Avatar, Button, Card, LiquidGlass, Progress, Switch, themePresets } from 'liquidkit'

/** A compact glass scene rendered under one palette + mode. */
function Vignette({ name, mode }: { name: string; mode: 'light' | 'dark' }) {
  return (
    <div
      className="doc-theme-vignette"
      data-theme={mode}
      data-palette={name}
      style={{ background: 'var(--lk-bg)', color: 'var(--lk-fg)' }}
    >
      <div className="doc-theme-vignette__mode">{mode}</div>
      <LiquidGlass
        elevation={2}
        style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={name} size={28} />
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
        <code>data-palette=&quot;{name}&quot;</code>
      </div>
      <div className="doc-theme-variants">
        <Vignette name={name} mode="light" />
        <Vignette name={name} mode="dark" />
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
        {themePresets.map((preset) => (
          <PaletteCard key={preset.name} name={preset.name} label={preset.label} />
        ))}
      </div>

      <div className="doc-callout" style={{ marginTop: 28 }}>
        Build a theme picker from the exported list:{' '}
        <code>import {'{ themePresets }'} from 'liquidkit'</code> — each entry has <code>name</code>{' '}
        and <code>label</code>. Try them live from the picker in the sidebar.
      </div>
    </article>
  )
}
