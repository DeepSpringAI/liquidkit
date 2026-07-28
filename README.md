<div align="center">

# LiquidKit

[![CI](https://github.com/hamidrezazargham/liquidkit/actions/workflows/ci.yml/badge.svg)](https://github.com/hamidrezazargham/liquidkit/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@hamidrezazargham/liquidkit.svg)](https://www.npmjs.com/package/@hamidrezazargham/liquidkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
![Types included](https://img.shields.io/badge/types-included-blue)
![Zero runtime deps](https://img.shields.io/badge/runtime%20deps-0-brightgreen)

**A React + TypeScript _Liquid Glass_ UI library — one frosted glass surface, and first-class light & dark themes.**

[**Live demo ↗**](https://hamidrezazargham.github.io/liquidkit/) &nbsp;·&nbsp; [**Documentation**](https://hamidrezazargham.github.io/liquidkit/) &nbsp;·&nbsp; [**npm**](https://www.npmjs.com/package/@hamidrezazargham/liquidkit)

</div>

<table>
  <tr>
    <td width="50%"><img src=".github/assets/hero-light.png" alt="LiquidKit docs — light theme" /></td>
    <td width="50%"><img src=".github/assets/hero-dark.png" alt="LiquidKit docs — dark theme" /></td>
  </tr>
</table>

Every surface is one primitive: a frosted `backdrop-filter` under a color tint, a lit bevel and a specular sheen. Because all 40+ components compose it, the whole kit reads as a single material — and re-themes from a handful of CSS variables.

```tsx
import { ThemeProvider, Button, Card } from '@hamidrezazargham/liquidkit'
import '@hamidrezazargham/liquidkit/styles.css'

export default function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <Card>
        <h2>Liquid Glass</h2>
        <Button variant="accent" pill>
          Get started
        </Button>
      </Card>
    </ThemeProvider>
  )
}
```

## ✨ Features

- 🔮 **One coherent material** — frost, tint, lit bevel and specular sheen from a single primitive every component composes.
- 🌗 **Light & dark, first-class** — both themes are designed and token-driven; flip the whole kit with one attribute.
- 🎨 **6 preset palettes** — `aurora`, `indigo`, `orchid`, `amber`, `glacier`, `rose`, each with light _and_ dark. Palette and mode are **independent axes**.
- 🧩 **35+ components** across seven categories, plus page templates and 45 icons — all composing one `<LiquidGlass>` primitive.
- ♿ **Accessible by default** — keyboard nav, focus trapping, correct ARIA roles, and `prefers-reduced-motion` respected throughout.
- 📦 **Zero runtime dependencies** — ships TypeScript types, ESM + CJS, `ref` forwarding and DOM prop spread on every component.

## 📸 Showcase

**The core — real lensing at the edges, not a flat blur:**

![The &lt;LiquidGlass&gt; primitive](.github/assets/glass-engine.png)

<table>
  <tr>
    <td width="50%">
      <img src=".github/assets/components.png" alt="ChartCard component" /><br/>
      <sub><b>35+ components</b> — data display, inputs, navigation, overlays…</sub>
    </td>
    <td width="50%">
      <img src=".github/assets/templates.png" alt="Dashboard template" /><br/>
      <sub><b>Full-page templates</b> — dashboards, landing, pricing & more.</sub>
    </td>
  </tr>
</table>

> Explore it all live at **[hamidrezazargham.github.io/liquidkit](https://hamidrezazargham.github.io/liquidkit/)** — every component over a textured backdrop, in both themes.

## 🚀 Quick start

```bash
npm install @hamidrezazargham/liquidkit
# peer deps: react >= 18, react-dom >= 18
```

Import the stylesheet once (it ships the design tokens + component CSS):

```ts
import '@hamidrezazargham/liquidkit/styles.css'
```

**Next.js / React Server Components.** The library is shipped as a client module (`"use client"`), so you can import components directly into App Router pages — render them inside client components as usual. Import `@hamidrezazargham/liquidkit/styles.css` once in your root layout.

## 🎨 Theming

LiquidKit is driven by CSS custom properties. Light is the default; `[data-theme="dark"]` overrides it; with no attribute set it follows the OS.

**With the provider** (recommended — gives you `useTheme`):

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@hamidrezazargham/liquidkit'

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
<html data-theme="dark"></html>
```

**Customize** any token in your own CSS:

```css
:root {
  --lk-accent: #ff5a5f;
  --lk-radius-lg: 28px;
  --lk-glass-blur: 10px;
}
```

### Preset themes

The library ships named **palette** themes — each a full look (colors + glass material) with its own **light _and_ dark** variant. Theme and mode are independent axes: `data-palette` picks the palette, `data-theme` (the toggle) picks light/dark, so any theme works in either mode.

![Preset palettes, light and dark](.github/assets/palettes.png)

They live in an **optional** stylesheet, so they cost nothing unless you opt in:

```js
import '@hamidrezazargham/liquidkit/styles.css' // required core
import '@hamidrezazargham/liquidkit/themes.css' // adds the presets
```

Pick a palette by name — directly, or through the provider (the toggle still flips light/dark):

```jsx
<div data-theme="dark" data-palette="aurora"> … </div>

<ThemeProvider defaultMode="dark" defaultPalette="aurora" storageKey="theme"> … </ThemeProvider>
```

Built in: `aurora`, `indigo`, `orchid`, `amber`, `glacier`, `rose`. The list is exported so you can build a theme picker:

```jsx
import { themePresets } from '@hamidrezazargham/liquidkit' // [{ name, label }, …]
```

### Raw palette swatches

Need a single color rather than a whole theme? The named swatches behind each preset are exposed on their own — as a JS value and a CSS variable. These are **raw** colors (not the semantic `--lk-accent` / `--lk-bg` tokens), handy for building your own surfaces:

```js
import { palettes } from '@hamidrezazargham/liquidkit'
palettes.amber.flameAmber // '#F78358'
```

```js
import '@hamidrezazargham/liquidkit/palettes.css' // optional, opt-in

/* .promo { background: var(--lk-amber-flame-amber); } */
```

Swatches are grouped by palette and the palette name is never repeated, so `amber-taupe` is `palettes.amber.taupe` / `--lk-amber-taupe`, while `flame-amber` is `palettes.amber.flameAmber` / `--lk-amber-flame-amber`. `aurora` merges its three source groups (Ice · Forest · Borealis) into one palette.

## 🔬 The core: `<LiquidGlass>`

Every component composes this primitive. Use it directly for custom surfaces.

```tsx
<LiquidGlass radius={24} blur={14} tint="accent" elevation={2} interactive>
  …anything…
</LiquidGlass>
```

| Prop          | Type                                                   | Default | Description                                |
| ------------- | ------------------------------------------------------ | ------- | ------------------------------------------ |
| `as`          | `ElementType`                                          | `'div'` | Element/component to render as             |
| `radius`      | `number`                                               | `28`    | Corner radius (px)                         |
| `pill`        | `boolean`                                              | `false` | Fully rounded                              |
| `blur`        | `number`                                               | token   | Backdrop blur (px)                         |
| `material`    | `'clear' \| 'ultraThin' \| 'thin' \| 'regular' \| 'thick'` | —   | Thickness: frost + auto-tint opacity  |
| `tint`        | `'auto' \| 'light' \| 'dark' \| 'clear' \| 'accent'`   | `'auto'`| Surface tint                               |
| `elevation`   | `0 \| 1 \| 2 \| 3`                                     | `2`     | Drop-shadow depth                          |
| `sheen`       | `boolean`                                              | `true`  | Diagonal specular streak                   |
| `interactive` | `boolean`                                              | `false` | Hover/press affordance                     |

## 🧩 Components

35+ components across seven categories, all composing the `<LiquidGlass>` primitive:

**Primitives** — `LiquidGlass`, `Card`

**Actions** — `Button`, `IconButton`, `Switch`, `ThemeToggle`, `Slider`, `Tabs`, `Select`

**Inputs** — `Input`, `SearchField`, `Stepper`, `CommandBar`

**Data display** — `Badge`, `Avatar` (+ `AvatarGroup`), `Progress`, `Tooltip`, `ChartCard`, `StatTile`, `PricingCard`, `List` (+ `ListRow`), `Table`, `Tile`

**Navigation** — `NavBar`, `Dock`, `Toolbar`, `TabBar`, `Sidebar`, `NavigationBar`

**Overlays** — `Modal`, `Sheet`, `Menu`, `Popover`, `Toast` (+ `ToastProvider` / `useToast`)

**Flow** — a node-based canvas: `FlowCanvas`, `FlowNode`, `FlowEdge`, `FlowControls`, `FlowMinimap`

`Button` and `IconButton` accept an `as` prop, so they render as a link (`as="a"`) or any element while keeping the glass styling. Every component forwards `ref` and arbitrary DOM props (`id`, `data-*`, `aria-*`, handlers) to its root element.

**Icons** — 45 stroke icons (`HomeIcon`, `SearchIcon`, `PlayIcon`, …), the `createIcon()` factory, and `GlassIcon` (renders any icon inside a frosted glass tile).

**Templates** — full, prop-driven screens: `LandingHero`, `WaitlistPage`, `PricingPage`, `DashboardShell`, plus device frames `PhoneFrame` (iOS) and `MacWindow` (macOS) for mocking app screens.

```tsx
import { PricingPage } from '@hamidrezazargham/liquidkit'

<PricingPage
  title="Pricing"
  tiers={[
    { name: 'Free', price: '$0', features: ['3 projects'], ctaLabel: 'Start' },
    { name: 'Pro', price: '$19', popular: true, features: ['Unlimited', 'Priority support'] },
  ]}
/>
```

## ♿ Accessibility

- **Keyboard** — `Tabs` / `TabBar` move with arrow keys + Home/End (roving tabindex); `Menu` / `Select` open into the list and navigate with arrows, Home/End and Esc; `Switch`, `Slider` and steppers use native controls.
- **Focus management** — `Modal` and `Sheet` trap focus, set initial focus and restore it to the trigger on close; they're labelled via `aria-labelledby` and dismiss on Esc.
- **ARIA** — correct roles throughout (`dialog`, `menu` / `menuitemcheckbox`, `listbox` / `option`, `tablist` / `tab`, `switch`); `Toast` announces politely, and errors assertively (`role="alert"`).
- **Motion & focus rings** — all motion respects `prefers-reduced-motion`, and interactive surfaces show a visible focus ring.

## 🌐 Browser support

The glass surface is a plain `backdrop-filter`, supported by every current browser.

| Browser                          | Glass surface | Notes                               |
| -------------------------------- | ------------- | ----------------------------------- |
| Chrome / Edge / Brave (Chromium) | ✅            | —                                   |
| Safari                           | ✅            | —                                   |
| Firefox                          | ✅            | —                                   |

Anywhere `backdrop-filter` is missing entirely, surfaces fall back to a translucent tinted panel — layouts never break, you just lose the frost.

> **Removed in 0.4.0:** earlier versions ran an SVG `feDisplacementMap` engine to bend the backdrop like a lens. It only rendered in Chromium, cost a GPU pass per surface, and didn't look convincing at real component sizes. The `refraction`, `dispersion`, `bezel` and `glass` props are still accepted (and ignored) for one deprecation cycle.

## ⚡ Performance

Glass bounds its own cost automatically, with **no change to how anything looks**: surfaces scrolled out of view release their `backdrop-filter`, and every surface is memoized so a parent re-render doesn't rebuild it. For constrained devices you can tune fidelity app-wide with an optional provider — the default is full fidelity:

```tsx
import { GlassConfigProvider } from '@hamidrezazargham/liquidkit'

// 'high' (default) keeps everything; 'low' trades some blur radius
// (and, at 'low', some blur) for a cheaper composite. Nothing is removed unless you opt in.
<GlassConfigProvider performance="balanced">
  <App />
</GlassConfigProvider>
```

See the **Performance** guide in the docs for the full knob list.

## 🛠️ Development

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

The docs site lives in `/docs` and dogfoods the library — it renders every component over a textured backdrop in both themes, with live template previews at `#/preview/landing`, `#/preview/waitlist`, `#/preview/pricing`, `#/preview/dashboard`, `#/preview/ios-settings`, `#/preview/control-center`, `#/preview/lock-screen` and `#/preview/mac-settings`.

## 🤝 Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, project layout, and conventions, and [CHANGELOG.md](./CHANGELOG.md) for notable changes.

## 📄 License

MIT © Hamidreza Zargham
