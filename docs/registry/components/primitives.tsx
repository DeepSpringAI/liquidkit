import { LiquidGlass, Card, Button, ArrowRightIcon } from 'liquidkit'
import type { ComponentDoc } from '../types'

export const liquidGlassDoc: ComponentDoc = {
  slug: 'liquid-glass',
  name: 'LiquidGlass',
  category: 'Primitives',
  summary:
    'The core surface every other component is built on. It refracts the live content behind it through an SVG displacement filter — real lensing at the edges, not just a blur.',
  importLine: "import { LiquidGlass } from 'liquidkit'",
  examples: [
    {
      title: 'A glass panel',
      description: 'Drop anything inside. The panel bends whatever sits behind it.',
      demo: (
        <LiquidGlass radius={24} style={{ padding: '28px 32px' }}>
          <strong style={{ fontSize: 18 }}>Liquid Glass</strong>
          <p style={{ margin: '6px 0 0', opacity: 0.7 }}>Real refraction, light & dark.</p>
        </LiquidGlass>
      ),
      code: `<LiquidGlass radius={24} style={{ padding: '28px 32px' }}>
  <strong>Liquid Glass</strong>
  <p>Real refraction, light & dark.</p>
</LiquidGlass>`,
    },
    {
      title: 'Materials',
      description:
        'Apple-style material thickness — from clear (most transparent) to thick (most opaque). Sets the frost and auto-tint; compose with tint for color.',
      demo: (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {(['clear', 'ultraThin', 'thin', 'regular', 'thick'] as const).map((m) => (
            <LiquidGlass key={m} material={m} radius={18} style={{ padding: '18px 20px' }}>
              {m}
            </LiquidGlass>
          ))}
        </div>
      ),
      code: `<LiquidGlass material="clear" />
<LiquidGlass material="ultraThin" />
<LiquidGlass material="thin" />
<LiquidGlass material="regular" />
<LiquidGlass material="thick" />`,
    },
    {
      title: 'Tints',
      description:
        'auto adapts to the theme. Use clear for maximum transparency or accent to pick up your brand color.',
      demo: (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {(['auto', 'clear', 'light', 'dark', 'accent'] as const).map((t) => (
            <LiquidGlass key={t} tint={t} radius={18} style={{ padding: '18px 22px' }}>
              {t}
            </LiquidGlass>
          ))}
        </div>
      ),
      code: `<LiquidGlass tint="auto" />
<LiquidGlass tint="clear" />
<LiquidGlass tint="light" />
<LiquidGlass tint="dark" />
<LiquidGlass tint="accent" />`,
    },
    {
      title: 'Refraction & dispersion',
      description:
        'Crank refraction for a thicker lens; dispersion splits the light into a chromatic rim. Set dispersion to 0 for clean glass.',
      demo: (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <LiquidGlass radius={20} refraction={20} dispersion={0} style={{ padding: '22px 24px' }}>
            subtle
          </LiquidGlass>
          <LiquidGlass radius={20} refraction={60} dispersion={6} style={{ padding: '22px 24px' }}>
            default
          </LiquidGlass>
          <LiquidGlass radius={20} refraction={90} dispersion={14} style={{ padding: '22px 24px' }}>
            heavy
          </LiquidGlass>
        </div>
      ),
      code: `<LiquidGlass refraction={20} dispersion={0}>subtle</LiquidGlass>
<LiquidGlass refraction={60} dispersion={6}>default</LiquidGlass>
<LiquidGlass refraction={90} dispersion={14}>heavy</LiquidGlass>`,
    },
    {
      title: 'Polymorphic & interactive',
      description:
        'Render as any element or component with the as prop. interactive adds hover / press affordance.',
      demo: (
        <LiquidGlass
          as="a"
          href="#/components/liquid-glass"
          pill
          interactive
          tint="accent"
          style={{ padding: '14px 22px', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}
        >
          Get started <ArrowRightIcon size={18} />
        </LiquidGlass>
      ),
      code: `<LiquidGlass as="a" href="/start" pill interactive tint="accent">
  Get started <ArrowRightIcon />
</LiquidGlass>`,
    },
  ],
  props: [
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Element or component to render as.' },
    { name: 'material', type: "'ultraThin' | 'thin' | 'regular' | 'thick' | 'clear'", description: 'Apple-style material thickness — sets frost & auto-tint opacity. Composes with tint.' },
    { name: 'radius', type: 'number', default: '22', description: 'Corner radius in px.' },
    { name: 'pill', type: 'boolean', default: 'false', description: 'Fully rounded. Overrides radius.' },
    { name: 'blur', type: 'number', default: '--lk-glass-blur', description: 'Backdrop blur in px.' },
    { name: 'refraction', type: 'number', default: '46', description: 'Refraction strength (displacement scale).' },
    { name: 'dispersion', type: 'number', default: '2', description: 'Chromatic split in px; 0 disables the rainbow fringe.' },
    { name: 'bezel', type: 'number', default: '14', description: 'Width of the refracting edge band in px.' },
    { name: 'tint', type: "'auto' | 'light' | 'dark' | 'clear' | 'accent'", default: "'auto'", description: 'Surface tint.' },
    { name: 'elevation', type: '0 | 1 | 2 | 3', default: '2', description: 'Drop-shadow depth.' },
    { name: 'sheen', type: 'boolean', default: 'true', description: 'Diagonal specular sheen.' },
    { name: 'glass', type: 'boolean', default: 'true', description: 'Enable true refraction. When false, falls back to a frosted blur.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Add hover / press affordance.' },
  ],
}

export const cardDoc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  category: 'Primitives',
  summary: 'A glass surface with sensible padding presets — the workhorse container for content.',
  importLine: "import { Card } from 'liquidkit'",
  examples: [
    {
      title: 'Basic card',
      demo: (
        <Card style={{ maxWidth: 320 }}>
          <h3 style={{ margin: '0 0 6px' }}>Weekly digest</h3>
          <p style={{ margin: 0, opacity: 0.72 }}>
            Your projects shipped 12 deploys and closed 34 issues this week.
          </p>
          <div style={{ marginTop: 16 }}>
            <Button size="sm" variant="accent">View report</Button>
          </div>
        </Card>
      ),
      code: `<Card>
  <h3>Weekly digest</h3>
  <p>Your projects shipped 12 deploys this week.</p>
  <Button size="sm" variant="accent">View report</Button>
</Card>`,
    },
    {
      title: 'Padding presets',
      description: 'none, sm, md (default) or lg.',
      demo: (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {(['sm', 'md', 'lg'] as const).map((p) => (
            <Card key={p} padding={p} radius={20}>
              padding=&quot;{p}&quot;
            </Card>
          ))}
        </div>
      ),
      code: `<Card padding="sm" />
<Card padding="md" />
<Card padding="lg" />`,
    },
  ],
  props: [
    { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Inner padding preset.' },
    { name: '...LiquidGlassProps', type: '—', description: 'All LiquidGlass props (radius, tint, elevation, …) are accepted.' },
  ],
}
