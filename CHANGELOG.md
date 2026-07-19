# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0]

### Added

- 13 new stroke icons (additive) for file-manager and collapsible-sidebar UIs:
  `EyeIcon`, `DownloadIcon`, `TrashIcon`, `InfoIcon`, `ListIcon`, `CopyIcon`,
  `DuplicateIcon`, `TagIcon`, `PaletteIcon`, `RefreshIcon`, `ChevronUpIcon`,
  `ComposeIcon` (a pencil-on-note, for "compose / new chat"), and `PanelLeftIcon`
  (a sidebar/panel toggle). Built from the icons hand-rolled for The Machine's UI.

## [Unreleased]

A hardening pass turning the initial prototype into a publish-ready library.
This will become the first published release (`0.1.0`).

### Added

- **Preset themes** — six named palette themes (`aurora`, `indigo`, `orchid`,
  `amber`, `glacier`, `rose`), each with a full **light and dark** variant,
  shipped in an optional `@hamidrezazargham/liquidkit/themes.css` (zero cost unless imported).
  Palette and mode are independent axes: set `data-palette="…"` (or
  `<ThemeProvider defaultPalette="…">`) and the light/dark toggle switches the
  theme's two variants. `ThemeProvider` gains `palette`/`setPalette` and a
  `defaultPalette` prop (persisted under `` `${storageKey}-palette` ``);
  portaled overlays mirror the active palette. The `themePresets` list is
  exported for building a theme picker.
- **Raw palette swatches** — the named colors behind the presets are exposed
  on their own: a typed `palettes` JS export (`palettes.amber.flameAmber`) and
  matching CSS custom properties in an optional `@hamidrezazargham/liquidkit/palettes.css`
  (`--lk-amber-flame-amber`). Swatches are grouped by palette without repeating
  the palette name; `aurora` merges its three source groups (Ice · Forest ·
  Borealis) into one palette.
- **Next.js / React Server Components support** — the library build is marked
  `"use client";`, so components can be imported from Server Components.
- **Right-to-left (RTL) support** across the component set via CSS logical
  properties; transform-driven parts (Switch thumb, Tabs indicator) flip under
  `dir="rtl"`.
- **Focus management** for `Modal` and `Sheet`: focus trap, initial focus,
  focus restoration on close, and `aria-labelledby`.
- **Keyboard navigation** (arrow keys + Home/End, roving tabindex) for `Menu`,
  `Select`, `Tabs`, and `TabBar`.
- **Portaled dropdowns** — `Menu` and `Select` panels render to the document
  body with anchored positioning and flip-on-overflow, so they no longer clip
  inside `overflow: hidden` or scrolling ancestors.
- **Themed portal container** so body-portaled overlays (`Modal`, `Sheet`,
  `Toast`, dropdowns) follow the chosen theme instead of the OS color scheme.
- **Showcase templates** — `PhoneFrame` and `MacWindow`.
- **Consistent prop & ref forwarding** across components (correct HTML
  attribute typing, `forwardRef`, `...rest` spread).
- **Tests** — data-driven smoke tests over every export plus interaction tests
  (Vitest + Testing Library), with coverage reporting.
- **Tooling** — ESLint (typescript-eslint, react-hooks, jsx-a11y), Prettier,
  and a GitHub Actions CI workflow (type-check, lint, format, test, build).
- **Publish-readiness** — `prepublishOnly`, `engines`, and `publishConfig` in
  `package.json`.
- **Project hygiene** — `CHANGELOG.md`, `CONTRIBUTING.md`, `.editorconfig`, and
  a (manual) GitHub Pages docs-deploy workflow.

### Changed

- README: corrected the component / icon / template counts, documented the full
  component list, and added Next.js usage and accessibility notes.
- `Modal` and `Sheet` scrims now read a themeable `--lk-scrim` token (light/dark
  aware) instead of a hardcoded `rgba(0, 0, 0, …)`, so the backdrop dim follows
  the theme and can be overridden.

### Fixed

- Theme hydration flash — `localStorage` / `matchMedia` reads are now
  mount-gated to avoid an SSR/client markup mismatch.
- Portaled overlays no longer fall back to the OS color scheme when they escape
  the theme provider wrapper.
- `Toast` error variant announces assertively (`role="alert"`).
- `StatTile` and `List` glass surfaces no longer shrink-wrap (inline-flex fix).

[Unreleased]: https://github.com/hamidrezazargham/liquidkit/commits/main
