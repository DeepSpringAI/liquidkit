# CLAUDE.md

Context and working rules for AI agents (Claude Code) developing on **liquidkit**.

## What this is

A React + TypeScript **Liquid Glass** UI component library. Every surface is one primitive: a
frosted `backdrop-filter` under a tint, a lit bevel and a specular sheen. Ships components, a
theming system (palettes × light/dark), and page templates.

> The SVG displacement/refraction engine was removed in 0.4.0 — it only ran on Chromium, cost a
> GPU pass per surface, and didn't convince at real component sizes. `refraction`, `dispersion`,
> `bezel` and `glass` remain as accepted-but-ignored props for one deprecation cycle. Don't
> reintroduce them.

- Published to npm as the **scoped** package `@hamidrezazargham/liquidkit` (the bare name
  `liquidkit` is owned by someone else — never rename to it).
- Public repo. `main` is **branch-protected**.

## Golden rules

1. **Never commit to `main`.** Branch → PR → merge. `main` requires all CI checks green
   (Node 18/20/22) and blocks force-push. This applies to you too.
2. **Run the full gate locally before pushing** — it's exactly what CI enforces:
   ```
   npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
   ```
   If `format:check` fails, run `npm run format`. Don't push red.
3. **Releases happen by tag, never by hand.** Do NOT run `npm publish` locally. See Releasing.
4. **Treat the visual/CSS surface as public API** (see Versioning). A renamed CSS class or
   `--token` is a breaking change, not a refactor.

## Commands

| Task | Command |
|---|---|
| Dev playground | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Lint / format | `npm run lint` · `npm run format` (write) · `npm run format:check` |
| Test / watch / coverage | `npm test` · `npm run test:watch` · `npm run test:coverage` |
| Build library | `npm run build` (tsc check → Vite lib build → copy theme CSS) |
| Build docs site | `npm run build:docs` |

## Repo layout

- `src/core/` — the `<LiquidGlass>` surface + `GlassConfigProvider` (the heart; touch carefully).
- `src/components/` — components, each in its own folder with `.tsx`, `.css`, and `*.test.tsx`.
- `src/theme/` — `ThemeProvider`, palettes, presets. `src/styles/` — token/theme/palette CSS.
- `src/templates/` — composed page templates. `src/icons/` — icon set.
- `docs/` — the documentation site + a **component registry** the smoke suite reads.
- `dist/` is build output (gitignored). Import alias `@hamidrezazargham/liquidkit` → `src/index.ts`
  is defined in `vite.config.ts`, `vitest.config.ts`, and `tsconfig.json` — keep all three in sync.

## Adding or changing a component

- Mirror the existing folder shape: `Component.tsx` + `Component.css` + `Component.test.tsx`,
  exported from `src/index.ts`.
- **Register it in the docs registry** (`docs/registry/…`). The smoke suite iterates the registry,
  so an unregistered/undocumented component fails CI — that's intentional.
- Ship tests: a render/a11y smoke test always; interaction tests for stateful components.
- Style with existing design tokens/CSS custom properties — don't hardcode colors.
- Respect `prefers-reduced-motion` (see `src/utils/useReducedMotion.ts`) and keep components
  accessible (roles, keyboard, focus).
- **Any new `backdrop-filter` must be listed in `src/styles/a11y.css`** so it collapses under
  `prefers-reduced-transparency` and `prefers-contrast: more`. `src/styles/a11y.test.ts` scans
  every stylesheet and fails CI if a glass surface isn't covered.

## The `apple-design` skill

`.claude/skills/apple-design/SKILL.md` (from [emilkowalski/skills](https://github.com/emilkowalski/skills),
MIT) is the house reference for motion, materials and typography. Follow it — with three
project-specific overrides where its advice collides with decisions this repo has already made:

1. **No new runtime dependencies.** The skill reaches for Motion / Framer Motion. liquidkit ships
   with **zero** runtime deps (React is a peer) and that's deliberate — it's why the package drops
   into any app without a version fight. Use the sampled spring curves in `src/styles/motion.css`
   and the primitives in `src/utils/momentum.ts` instead. Adding a motion library is a decision to
   escalate, not a refactor.
2. **Never animate `backdrop-filter` blur radius.** The skill's "materialize, don't just fade"
   advice costs a full backdrop re-composite per frame. The refraction engine was removed in 0.4.0
   over exactly this kind of per-surface GPU cost — don't reintroduce it through the back door.
   Animate `opacity` and `transform` on the surface instead; the frost can stay constant.
3. **Tokens, not literal colors.** The skill's examples hardcode `rgba(...)`. This repo's rule wins.

Where the skill and this file agree, the skill has the detail: springs settle from the *current*
on-screen value (never the target), gestures hand their release velocity to the animation, and a
flick lands where it was projected to land — not where the finger lifted.

## Testing & coverage

- Vitest + Testing Library, jsdom. Coverage thresholds in `vitest.config.ts` (70/65/50/70) are
  **floors** — ratchet them up as coverage grows, never lower them to make a PR pass.

## Versioning (semver — stricter than usual for a UI lib)

The public API includes exported JS **and** CSS class names, `--token` custom-property names, DOM
structure, and default visual behavior.

- **Major (breaking):** remove/rename a component, prop, export, CSS class, or token; change a
  visible default; raise the React/Node floor in `peerDependencies`/`engines`.
- **Minor:** new component or new optional prop; additive.
- **Patch:** bug fix with no API/appearance change.

Prefer deprecating (JSDoc `@deprecated` + a dev-only `console.warn`) for a minor cycle before
removing in a major.

## Releasing

`.github/workflows/release.yml` publishes on `v*` tags with provenance. To cut a release:

1. `npm version <patch|minor|major>` — bumps `package.json` and creates the matching git tag.
2. Move CHANGELOG `## [Unreleased]` entries under a dated `## [x.y.z]` heading; open a fresh
   empty `[Unreleased]`. CHANGELOG follows **Keep a Changelog**.
3. Push the commit and the tag (`git push && git push --tags`). The workflow runs the gate and
   publishes `@hamidrezazargham/liquidkit`. Auth is the `NPM_TOKEN` repo secret.

If you touched `files`/`exports` in `package.json`, run `npm pack --dry-run` first to confirm the
tarball contents. Published versions are permanent — never reuse a version number.

## Don't

- Don't commit to `main`, `npm publish` manually, or push with a red local gate.
- Don't commit `dist/`, `coverage/`, or `node_modules/` (all gitignored).
- Don't rename CSS classes/tokens or change visible defaults without treating it as a breaking change.
- Don't add a component without a docs-registry entry and tests.
