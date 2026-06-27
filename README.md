# LiquidKit

> A React + TypeScript **Liquid Glass** UI library — real edge refraction, chromatic dispersion, specular bevels, and first-class light & dark themes.

LiquidKit isn't "glassmorphism" (a blur and a border). Every surface runs a real-time **SVG displacement engine** that bends the content behind it like actual glass, with optional chromatic dispersion for that rainbow edge fringe. It gracefully degrades to a frosted blur where the engine isn't supported.

```tsx
import { ThemeProvider, Button, Card } from 'liquidkit'
import 'liquidkit/styles.css'

export default function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <Card>
        <h2>Liquid Glass</h2>
        <Button variant="accent" pill>Get started</Button>
      </Card>
    </ThemeProvider>
  )
}
```

---

## Install

```bash
npm install liquidkit
# peer deps: react >= 18, react-dom >= 18
```

Import the stylesheet once (it ships the design tokens + component CSS):

```ts
import 'liquidkit/styles.css'
```

---

## Documentation

The docs site is itself built with LiquidKit. Run it locally:

```bash
npm run dev      # http://localhost:5173
```

It has per-component pages with **live examples**, copy-paste snippets and prop tables; guides for **Installation**, **Theming** and **The Glass Engine**; a searchable component index; an icon gallery; and full-screen, live previews of every template — all in light & dark.

---

## Browser support

The refraction engine uses `backdrop-filter: url(#…)` with SVG `feDisplacementMap`.

| Browser | Refraction + dispersion | Fallback |
| --- | --- | --- |
| Chrome / Edge / Brave (Chromium) | ✅ Full | — |
| Safari | ⚠️ Partial | Frosted blur + tint |
| Firefox | ⚠️ Partial | Frosted blur + tint |

Where the displacement filter isn't honored, components automatically fall back to a frosted blur + tint, so layouts never break — you just lose the lensing. Set `glass={false}` on `<LiquidGlass>` to opt out of refraction entirely.

---

## Theming

LiquidKit is driven by CSS custom properties. Light is the default; `[data-theme="dark"]` overrides it; with no attribute set it follows the OS.

**With the provider** (recommended — gives you `useTheme`):

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from 'liquidkit'

<ThemeProvider defaultMode="system" storageKey="theme">
  <ThemeToggle />            {/* pre-wired light/dark switch */}
</ThemeProvider>

function ThemeName() {
  const { theme, setMode, toggle } = useTheme()
  return <button onClick={toggle}>{theme}</button>
}
```

**Without the provider** — just set the attribute yourself:

```html
<html data-theme="dark">
```

**Customize** any token in your own CSS:

```css
:root {
  --lk-accent: #ff5a5f;
  --lk-radius-lg: 28px;
  --lk-glass-blur: 10px;
  --lk-refract: 60;        /* refraction strength */
  --lk-dispersion: 8;      /* chromatic split     */
}
```

---

## The core: `<LiquidGlass>`

Every component composes this primitive. Use it directly for custom surfaces.

```tsx
<LiquidGlass radius={24} refraction={50} dispersion={6} elevation={2} interactive>
  …anything…
</LiquidGlass>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | `'div'` | Element/component to render as |
| `radius` | `number` | `22` | Corner radius (px) |
| `pill` | `boolean` | `false` | Fully rounded |
| `blur` | `number` | token | Backdrop blur (px) |
| `refraction` | `number` | `46` | Displacement strength |
| `dispersion` | `number` | `5` | Chromatic split (0 = off) |
| `bezel` | `number` | `14` | Width of the refracting edge band |
| `tint` | `'auto' \| 'light' \| 'dark' \| 'clear' \| 'accent'` | `'auto'` | Surface tint |
| `elevation` | `0 \| 1 \| 2 \| 3` | `2` | Drop-shadow depth |
| `sheen` | `boolean` | `true` | Diagonal specular streak |
| `glass` | `boolean` | `true` | Enable refraction (false → frosted blur) |
| `interactive` | `boolean` | `false` | Hover/press affordance |

---

## Components

25 components, all composing the `<LiquidGlass>` primitive:

**Primitives** — `LiquidGlass`, `Card`

**Actions** — `Button`, `IconButton`, `Switch`, `ThemeToggle`, `Slider`, `Tabs`, `Select`

**Inputs** — `Input`, `CommandBar`

**Data display** — `Badge`, `Avatar` (+ `AvatarGroup`), `Progress`, `Tooltip`, `ChartCard`, `StatTile`, `PricingCard`

**Navigation** — `NavBar`, `Dock`, `Toolbar`

**Overlays** — `Modal`

`Button` and `IconButton` accept an `as` prop, so they render as a link (`as="a"`) or any element while keeping the glass styling.

**Icons** — 34 stroke icons (`HomeIcon`, `SearchIcon`, `PlayIcon`, …), the `createIcon()` factory, and `GlassIcon` (renders any icon inside a refractive glass tile).

**Templates** — full, prop-driven screens: `LandingHero`, `WaitlistPage`, `PricingPage`, `DashboardShell`.

```tsx
import { PricingPage } from 'liquidkit'

<PricingPage
  title="Pricing"
  tiers={[
    { name: 'Free', price: '$0', features: ['3 projects'], ctaLabel: 'Start' },
    { name: 'Pro', price: '$19', popular: true, features: ['Unlimited', 'Priority support'] },
  ]}
/>
```

---

## Development

```bash
npm run dev        # docs site (http://localhost:5173)
npm run build      # build the library to dist/ (ESM + CJS + types + CSS)
npm run build:docs # build the docs site to dist-site/
npm run typecheck  # tsc --noEmit
npm test           # vitest
```

The docs site lives in `/docs` and dogfoods the library — it renders every component over a refractive backdrop in both themes, with live template previews at `#/preview/landing`, `#/preview/waitlist`, `#/preview/pricing` and `#/preview/dashboard`.

---

## License

MIT © Hamidreza Zargham
