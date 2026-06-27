# Contributing to LiquidKit

Thanks for your interest in LiquidKit! This guide covers local setup, the
project layout, and the conventions that keep the library consistent.

## Prerequisites

- **Node.js ≥ 18** (the repo pins Node 20 via `.nvmrc`; run `nvm use`)
- **npm** (the repo ships a `package-lock.json`)

## Getting started

```bash
git clone https://github.com/hamidrezazargham/liquidkit.git
cd liquidkit
npm install
npm run dev        # showcase playground at http://localhost:5173
```

## Scripts

| Script                  | What it does                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Vite dev server for the showcase playground (`docs/`)    |
| `npm run build`         | Type-check, then build the distributable library to `dist/` |
| `npm run build:docs`    | Build the showcase playground to `dist-site/`            |
| `npm run preview`       | Preview the built showcase                               |
| `npm test`              | Run the test suite once (Vitest + jsdom)                 |
| `npm run test:watch`    | Run tests in watch mode                                  |
| `npm run test:coverage` | Run tests with a coverage report                         |
| `npm run typecheck`     | `tsc --noEmit`                                            |
| `npm run lint`          | ESLint (typescript-eslint + react-hooks + jsx-a11y)      |
| `npm run format`        | Format the repo with Prettier                            |
| `npm run format:check`  | Verify formatting (what CI runs)                         |

## Quality gates

CI runs on every push/PR. Before opening a PR, make sure these all pass locally:

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

## Project layout

```
src/
  core/        LiquidGlass primitive + the SVG displacement engine
  components/  one folder per component: Component.tsx + Component.css + Component.test.tsx
  templates/   composed showcase frames (PhoneFrame, MacWindow)
  theme/       ThemeProvider + tokens
  icons/       icon set
  utils/       shared hooks/helpers (cx, forwardRef helpers, focus trap, portals, …)
  styles/      base + token CSS
  test/        setup + cross-cutting smoke/interaction tests
  index.ts     the public entry point — every export lives here
docs/          the showcase playground (also the component registry used by tests)
```

## Conventions

- **Zero runtime dependencies.** The published package must not add runtime deps;
  React/React-DOM are peer deps. Anything you add for tooling goes in
  `devDependencies`.
- **Prop & ref forwarding.** Components extend the right
  `ComponentPropsWithoutRef<'…'>`, wrap in `forwardRef`, merge `className` via
  `cx`, and spread `...rest` onto the semantic root. See `core/LiquidGlass.tsx`
  for the reference pattern.
- **SSR-safe.** The library targets Next.js / React Server Components (the build
  prepends `"use client";`). Guard browser globals (`window`, `document`,
  `localStorage`, `matchMedia`) so modules don't crash during SSR.
- **RTL via logical properties.** Use `inset-inline-*`, `margin-inline-*`,
  `padding-inline-*`, and `text-align: start/end` instead of physical
  `left`/`right`. Reserve physical values for true centering or explicit
  directional placement props. `transform: translateX` is not direction-aware —
  add a `[dir='rtl']` override when a transform encodes direction.
- **Accessibility.** Overlays trap and restore focus; lists/menus/tabs support
  arrow-key navigation; interactive elements carry the right ARIA roles. Keep
  `jsx-a11y` lint clean.

## Adding a component

1. Create `src/components/MyThing/` with `MyThing.tsx`, `MyThing.css`, and
   `MyThing.test.tsx`.
2. Export it from `src/index.ts`.
3. Register a demo in the docs registry (`docs/registry/`) — the data-driven
   smoke test renders every registered example, so this also gives you baseline
   coverage.
4. Run the quality gates above.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
`fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`. Keep the subject in the
imperative mood.

## Documentation site (GitHub Pages)

The `Deploy docs` workflow (`.github/workflows/pages.yml`) is currently
**manual-only** because Pages isn't enabled on this repo (private repos need a
paid plan; free plans serve Pages only from public repos). To enable automatic
deploys: make the repo public (or upgrade), set **Settings → Pages → Source** to
*GitHub Actions*, add a `push` trigger to the workflow, then point `homepage` in
`package.json` at `https://<owner>.github.io/liquidkit/`. Full steps are in the
workflow file's header comment.
