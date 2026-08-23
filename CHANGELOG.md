# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`AppFrame`** — the viewport-locked application frame. A fixed column of furniture beside a
  work area, both on a golden-ratio spacing ladder (frame padding · gutter · content inset =
  1 · φ · φ²), with the document itself held still for as long as it is mounted. Below
  `minWidth` (820 px by default) it renders a notice instead of a squeezed frame.
- **`Section` / `SectionHeader` / `SectionBody` / `SectionFooter`** — one work area, one layout:
  a header row that never scrolls, exactly one body that does, and an optional footer docked to
  the bottom of the frame. `SectionBody` reserves the scrollbar's width instead of letting it sit
  on the content. `SectionHeader` carries the title / subtitle / eyebrow / actions pattern, and
  its `children` replace the title block outright so a wordmark can be a section header.
- **`Sidebar` collapse and resize.** A 12 px hit strip on the trailing edge: drag it to resize
  (clamped, `col-resize`, the width transition suspended so the column tracks the pointer 1:1),
  release without travelling to collapse to an icon rail. Arrow keys resize it from the keyboard.
  Collapsed and expanded are the same element and the same DOM — labels are hidden visually, not
  removed, so the rail still announces itself. New props: `collapsed`, `collapsedWidth`,
  `onToggleCollapsed`, `resizable`, `minWidth`, `maxWidth`, `onResize`, `edgeLabel`.
- **`Sidebar` `density`** — `comfortable` gives the desktop-application ladder (41 px rows,
  9×12 padding, 23 px icons, 16 px apart) beside the existing `compact` default.
- **`useSidebarState`** — width, collapsed, and the memory of both, handed back as a `props`
  bundle to spread onto `<Sidebar>`.
- **`Table` `stickyHeader`** — pins the header row to the top of whatever region scrolls the
  table. The wrapper switches from `overflow: hidden` to `overflow: clip` when it is on, because
  `hidden` makes the wrapper its own scrollport and a header stuck to a box that never scrolls
  looks exactly like no sticky header at all.
- Tokens: `--lk-tracking-micro` (0.04 em, for small uppercase labels — the optical tracking in the
  system scale is far too tight for them), `--lk-weight-strong` (650), `--lk-duration-panel`
  (340 ms, a frame column changing width).

### Fixed

- **A themed portal no longer resets an app's font.** Typography, spacing, motion and radius
  tokens were declared under `[data-theme='light']` as well as `:root`; because liquidkit themes a
  portal by putting `data-theme` on the portal element itself, every menu, toast and modal
  re-declared them and silently undid an app's override inside itself. They now live on `:root`
  alone, and `src/styles/tokens.test.ts` walks the stylesheets and fails if one moves back.
- Test setup polyfills `PointerEvent` from `MouseEvent`, which jsdom does not implement — without
  it a fired pointer event arrives with no coordinates, which is the whole content of a drag.

## [0.5.0] - 2026-08-05

### Added

- **Accessibility material layer (`src/styles/a11y.css`).** Glass surfaces now answer the two OS
  settings that are actually about glass: `prefers-reduced-transparency: reduce` drops the blur and
  makes surfaces opaque, and `prefers-contrast: more` additionally gives them a defined,
  contrasting border. Previously both settings were ignored and users got the full frost regardless.
  New tokens: `--lk-glass-solid`, `--lk-scrim-solid`.
- **Gesture momentum primitives**, exported: `projectMomentum()`, `rubberband()`,
  `VelocityTracker` and `DECELERATION`. Ports of Apple's *Designing Fluid Interfaces* reference
  implementations, for building drag interactions that settle where the gesture was heading.
- **Typography tracking and leading tokens** — `--lk-tracking-*` paired to each `--lk-text-*` size,
  plus `--lk-leading-display|title|body|dense`. Tracking has to be size-specific; one fixed
  `letter-spacing` is wrong at some size. Additive: nothing applies them automatically.
- `Sheet` now has a test suite (13 cases) covering drag, dismissal, momentum and cancellation.

### Changed

- **`Sheet` drag now carries momentum.** On release the sheet settles at the detent nearest the
  *projected* resting point rather than the release point, so a flick throws it the way it does on
  iOS. At zero release velocity behaviour is unchanged — a slow drag lands exactly where it did
  before. A drag past the tallest detent now rubber-bands instead of stopping dead, and a press
  must travel 10px before it becomes a drag, so a tap on the grabber no longer nudges the sheet.

### Fixed

- **`Sheet` no longer jumps when grabbed mid-animation.** The drag start read the *target* height
  rather than the on-screen one, so grabbing a sheet that was still springing between detents
  snapped it to where it was heading before following the finger.
- `Sheet` now ends its drag on `pointercancel` / lost pointer capture. Previously an interrupted
  gesture (a system gesture, an incoming call) left the drag state armed.

## [0.4.0] - 2026-07-28

### Removed

- **BREAKING — the SVG displacement (refraction) engine is gone.** Glass surfaces are
  now a frosted `backdrop-filter` (`blur() saturate() brightness()`) plus the existing
  tint, bevel and sheen layers. The lensing only ever rendered in Chromium, cost a GPU
  pass per surface, and didn't read as convincing glass at the sizes real components
  are, so it has been removed rather than kept on life support.

  Deleted modules and exports: `displacementMapDataUri`, `glassFilterMarkup`,
  `glassFilterKey`, `useGlassFilter`, `isGlassEngineSupported`, and the types
  `GlassFilterParams`, `DisplacementMapOptions`, `UseGlassFilterOptions`,
  `UseGlassFilterResult`. The `--lk-refract`, `--lk-refract-bezel` and `--lk-dispersion`
  CSS custom properties are gone too.

  **Kept as accepted-but-ignored for one deprecation cycle** (so existing apps still
  compile): `refraction`, `dispersion`, `bezel` and `glass` on `LiquidGlass`;
  `refraction` / `dispersion` on `Button` and `GlassIcon`; `glass` on
  `GlassConfigProvider`. Each is marked `@deprecated` and warns once in development.
  They will be deleted in the next major.

### Changed

- `GlassConfigProvider`'s `performance` tier now only scales the blur radius: `high`
  and `balanced` render the full frost, `low` softens it. `resolveGlassTier()` takes
  just the tier and returns `{ blurScale }`.
- The docs playground is now a frost playground (blur / material / tint / radius), and
  the "Glass Engine" guide documents the four layers that make up a surface.

### Fixed

- Glass surfaces render their frost again. `.lk-glass__sheen` carried
  `mix-blend-mode: screen`, and a blended child turns `.lk-glass` into an isolated
  group — which makes it a *backdrop root*, so every `backdrop-filter` inside it was
  filtering an empty backdrop and silently doing nothing on every surface with `sheen`
  (the default). The blend is gone; the rim is white-on-white, so it looks the same.

### Added

- **`CodeBlock`** — a read-only source block for rendering snippets, built for chat
  transcripts and docs. Header carries the language (or a `title` filename) plus a
  copy-to-clipboard button; `showLineNumbers` adds a gutter, `wrap` soft-wraps,
  `maxLines` collapses long blocks behind a "Show all" toggle, and `hideHeader`
  floats the copy button over a bare block.
  Syntax highlighting is dependency-free (~2KB, no Prism/Shiki) so a transcript can
  mount dozens of blocks cheaply, and it is **palette-derived** — tokens are an
  accent→foreground scale, so code follows the active theme and palette instead of
  fighting it with a fixed syntax theme. Grammars ship for the curly-brace family,
  Python, Ruby, SQL, shell, JSON, YAML/TOML, CSS, HTML, Go and Rust; unknown
  languages degrade to the curly-brace grammar and `text` disables highlighting.
  The tokenizer is also exported directly as `tokenize` / `normalizeLanguage`.
- `--lk-text-caption2` (11px), extending the type scale one step below `caption`
  for dense chrome (badges, code headers).

## [0.3.3] - 2026-07-20

### Fixed

- **Crash (`Maximum update depth exceeded`) when opening a second `Menu` flyout**,
  and the same failure for any glass surface whose content re-renders (it is why a
  growing field could not live inside a glass bar). `LiquidGlass` built its callback
  ref inline with `mergeRefs(...)`, so the ref changed identity on every render;
  React detached and re-attached it each time, tearing down and rebuilding the
  `useSize` ResizeObserver and re-measuring — and any re-render fed the next. The
  merged ref is now memoised, so it keeps one identity and the observer is created
  once. Regression test asserts the element is observed exactly once across renders.
- `Menu` flyout positioning no longer hands React a new style object when the
  flyout has not moved (it also runs from a capture-phase scroll listener), and
  menu/flyout focus uses `preventScroll` so focusing a row cannot scroll an
  ancestor and re-trigger the positioner.

## [0.3.2] - 2026-07-19

### Fixed

- **Crash when continuously resizing a glass surface** (e.g. dragging a sidebar
  edge): an infinite render loop (`Maximum update depth exceeded`) unmounted the
  whole app, leaving a blank screen. Two 0.3.0 changes were reverted/reworked:
  - `useSize` deferred its ResizeObserver measurement to `requestAnimationFrame`,
    which hid the resize→layout→resize cycle from the browser's own
    ResizeObserver loop-detection. Restored the synchronous measurement (the 1px
    dead-band still guards sub-pixel jitter).
  - `useInView` set React state from inside its callback ref (which `mergeRefs`
    re-invokes every render). Reworked to hold the node in a ref and observe
    directly, so `inView` only changes from the observer callback.

## [0.3.1] - 2026-07-19

### Fixed

- Revert the size-aware filter region introduced in 0.3.0. Making the region
  percentage depend on the surface size meant it jumped at the filter-size
  buckets during a resize (e.g. dragging a sidebar edge), which on some GPUs
  flashed the surface **black** while the compositor reallocated the backdrop
  texture. The region is a fixed 170% again. Every other 0.3.0 optimization —
  off-screen pausing, filter sharing, memoization, ResizeObserver coalescing,
  the capability gate — is unchanged.

## [0.3.0] - 2026-07-19

Performance pass: the glass engine now bounds its GPU / compositor cost so pages
with many live surfaces stay smooth, **with no change to how anything looks**.

### Added

- **`GlassConfigProvider` / `useGlassConfig`** — optional app-wide glass config:
  a `performance` tier (`'high' | 'balanced' | 'low'`, default `'high'` = full
  fidelity), a `pauseOffscreen` toggle, and an app-wide `glass` override. The
  lower tiers are opt-in escape hatches for constrained devices; the default
  removes nothing.
- **`isGlassEngineSupported()`** — the exported browser-capability probe.

### Changed

- **Off-screen surfaces are paused** — a shared `IntersectionObserver` releases a
  surface's `backdrop-filter` (and its cached filter) while it is scrolled out of
  view and restores it just before it returns, bounding GPU memory to what's on
  screen. Invisible.
- **Filter definitions are shared more aggressively** — the displacement
  `<filter>` is cached by bucketed size, so many similarly-sized surfaces
  reference one definition instead of minting their own.
- **The filter region is now sized to each surface** (was a fixed 170%),
  shrinking the GPU texture for large panels with no visible change.
- **The SVG engine is skipped where it isn't honored** (Safari, Firefox) — those
  browsers get the frosted fallback directly instead of generating a filter they
  discard. Chromium / Electron are unchanged, full effect.
- **`LiquidGlass`, `Button`, `Card`, and `IconButton` are memoized**, so an
  unrelated parent re-render no longer rebuilds every glass surface on the page.

### Fixed

- The glass `ResizeObserver` can no longer drive a feedback loop on a
  continuously growing child — size updates are coalesced to one per animation
  frame.

## [0.2.0]

### Added

- 13 new stroke icons (additive) for file-manager and collapsible-sidebar UIs:
  `EyeIcon`, `DownloadIcon`, `TrashIcon`, `InfoIcon`, `ListIcon`, `CopyIcon`,
  `DuplicateIcon`, `TagIcon`, `PaletteIcon`, `RefreshIcon`, `ChevronUpIcon`,
  `ComposeIcon` (a pencil-on-note, for "compose / new chat"), and `PanelLeftIcon`
  (a sidebar/panel toggle). Built from the icons hand-rolled for The Machine's UI.

## [0.1.0]

A hardening pass turning the initial prototype into a publish-ready library —
the first published release.

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
