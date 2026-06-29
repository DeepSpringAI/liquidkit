# LiquidKit

[![CI](https://github.com/hamidrezazargham/liquidkit/actions/workflows/ci.yml/badge.svg)](https://github.com/hamidrezazargham/liquidkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
![Types included](https://img.shields.io/badge/types-included-blue)
![Zero runtime deps](https://img.shields.io/badge/runtime%20deps-0-brightgreen)

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

**Next.js / React Server Components.** The library is shipped as a client module (`"use client"`), so you can import components directly into App Router pages — render them inside client components as usual. Import `liquidkit/styles.css` once in your root layout.

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

### Preset themes

The library ships named **palette** themes — each a full look (colors + glass
material) with its own **light _and_ dark** variant. Theme and mode are
independent axes: `data-palette` picks the palette, `data-theme` (the toggle)
picks light/dark, so any theme works in either mode. They live in an
**optional** stylesheet, so they cost nothing unless you opt in:

```js
import 'liquidkit/styles.css' // required core
import 'liquidkit/themes.css' // adds the presets
```

Pick a palette by name — directly, or through the provider (the toggle still
flips light/dark):

```jsx
<div data-theme="dark" data-palette="aurora"> … </div>

<ThemeProvider defaultMode="dark" defaultPalette="aurora" storageKey="theme"> … </ThemeProvider>
```

Built in: `aurora`, `indigo`, `orchid`, `amber`, `glacier`, `rose`. The list is
exported so you can build a theme picker:

```jsx
import { themePresets } from 'liquidkit' // [{ name, label }, …]
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

35+ components across six categories, all composing the `<LiquidGlass>` primitive:

**Primitives** — `LiquidGlass`, `Card`

**Actions** — `Button`, `IconButton`, `Switch`, `ThemeToggle`, `Slider`, `Tabs`, `Select`

**Inputs** — `Input`, `SearchField`, `Stepper`, `CommandBar`

**Data display** — `Badge`, `Avatar` (+ `AvatarGroup`), `Progress`, `Tooltip`, `ChartCard`, `StatTile`, `PricingCard`, `List` (+ `ListRow`), `Table`, `Tile`

**Navigation** — `NavBar`, `Dock`, `Toolbar`, `TabBar`, `Sidebar`, `NavigationBar`

**Overlays** — `Modal`, `Sheet`, `Menu`, `Popover`, `Toast` (+ `ToastProvider` / `useToast`)

`Button` and `IconButton` accept an `as` prop, so they render as a link (`as="a"`) or any element while keeping the glass styling. Every component forwards `ref` and arbitrary DOM props (`id`, `data-*`, `aria-*`, handlers) to its root element.

**Icons** — 45 stroke icons (`HomeIcon`, `SearchIcon`, `PlayIcon`, …), the `createIcon()` factory, and `GlassIcon` (renders any icon inside a refractive glass tile).

**Templates** — full, prop-driven screens: `LandingHero`, `WaitlistPage`, `PricingPage`, `DashboardShell`, plus device frames `PhoneFrame` (iOS) and `MacWindow` (macOS) for mocking app screens.

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

## Accessibility

- **Keyboard** — `Tabs` / `TabBar` move with arrow keys + Home/End (roving tabindex); `Menu` / `Select` open into the list and navigate with arrows, Home/End and Esc; `Switch`, `Slider` and steppers use native controls.
- **Focus management** — `Modal` and `Sheet` trap focus, set initial focus and restore it to the trigger on close; they're labelled via `aria-labelledby` and dismiss on Esc.
- **ARIA** — correct roles throughout (`dialog`, `menu` / `menuitemcheckbox`, `listbox` / `option`, `tablist` / `tab`, `switch`); `Toast` announces politely, and errors assertively (`role="alert"`).
- **Motion & focus rings** — all motion respects `prefers-reduced-motion`, and interactive surfaces show a visible focus ring.

---

## Development

```bash
npm run dev          # docs site (http://localhost:5173)
npm run build        # build the library to dist/ (ESM + CJS + types + CSS)
npm run build:docs   # build the docs site to dist-site/
npm run typecheck    # tsc --noEmit
npm test             # vitest
npm run test:coverage
npm run lint         # eslint (incl. react-hooks + jsx-a11y)
npm run format       # prettier --write
```

The docs site lives in `/docs` and dogfoods the library — it renders every component over a refractive backdrop in both themes, with live template previews at `#/preview/landing`, `#/preview/waitlist`, `#/preview/pricing`, `#/preview/dashboard`, `#/preview/ios-settings`, `#/preview/control-center`, `#/preview/lock-screen` and `#/preview/mac-settings`.

---

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup,
project layout, and conventions, and [CHANGELOG.md](./CHANGELOG.md) for notable
changes.

---

## License

MIT © Hamidreza Zargham
