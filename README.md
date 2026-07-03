# Raditz

A personal React + Vite + TypeScript UI library with Storybook, built on the
**Raditz** design system (Radix Colors + semantic tokens). Real, editable
components, sections, and full example pages — all re-skin and re-theme from one
accent token.

```bash
pnpm install
pnpm storybook    # the library (Foundations / Components / Sections / Pages)
```

## What's inside

A personal UI library, organized in Storybook into:

- **Foundations** — colors, typography, spacing, radius, elevation, motion (token docs)
- **Components** — 102 real React components across 13 categories
  (actions, data, disclosure, display, feedback, inputs, layout, media, motion,
  navigation, overlay, surfaces, typography), each with a story + autodocs
- **Sections** — 26 composable page sections, each with variants
- **Pages** — full example pages (Landing, Pricing, Showcase) composed from sections

## Folder-per-thing structure

Every component and section lives in its own folder with all its parts co-located:

```
src/components/actions/Button/
  Button.tsx          # implementation (strict TS, renders rdz-* classes)
  Button.scss         # co-located styles (split from the design system)
  Button.stories.tsx  # Storybook story + autodocs
  Button.test.tsx     # smoke test (renders every story)
  index.ts            # barrel — `import { Button } from '.../actions/Button'`
```

Sections follow the same pattern under `src/sections/<Name>/`. Per-component
`.scss` files are aggregated (in cascade order) by `src/styles/components.ts`,
which the app and Storybook import once — components do **not** import their own
styles.

## Commands

```bash
pnpm storybook    # the library — Foundations / Components / Sections / Pages
pnpm dev          # the explorer showroom (auto-built from the stories)
pnpm test         # vitest — every story renders + zero axe violations
pnpm build        # type-check + production build
pnpm build:pkg    # the distributable package (dist/: JS lib + raditz.css)
pnpm build-storybook
```

## How it's wired

- **Tokens** live in `src/styles/tokens/` and load via `src/styles/styles.css` (Radix scales →
  fonts → tokens → reset). Radix scales are vendored from `@radix-ui/colors` and the fonts
  are self-hosted via `@fontsource*` — no runtime CDN, works offline.
- **Component styles** are co-located per component (`<Name>.scss`) and aggregated in cascade
  order by `src/styles/components.ts`, imported once by the app and Storybook (Sass). The
  package build emits them all as one `dist/raditz.css` (`raditz/styles.css`).
- **Components** are strict TypeScript (`.tsx` with inline-exported prop interfaces — full
  IntelliSense) and render `rdz-*` classes. No `@radix-ui/react-*` — interaction primitives
  are their own, in `src/components/internal/`. Real runtime deps are deliberate and few:
  `@visx/*` (charts), `date-fns` (calendar/date logic), `react-icons` (the Icon set);
  `react`/`react-dom` are peers.
- **Shared hooks/utils** live in `src/components/internal` and are reused across components
  instead of re-implemented: `cx` (class names), `onKeys`/`rovingIndex`/`KEYS`
  (keyboard), `useControllableState`, `useTrigger` (overlay open-state), `useStableId`,
  and the overlay hooks (`useDismiss`, `useFocusTrap`, `useScrollLock`,
  `useOverlayPosition`, `useRovingMenu`). A curated set is re-exported for consumers
  via `src/lib/hooks.ts` (`cx`, `useReducedMotion`, `useInView`, `useRevealState`,
  `useControllableState`, `splitText`).
- **Accessibility** is enforced by `src/a11y.test.tsx`, which renders every component and
  asserts zero axe-core violations (part of `pnpm test`).
- **Theming**: toggling `class="dark"` on `<html>` re-themes everything — the
  `useColorScheme` hook (system-aware: follows the OS until the user overrides) and
  Storybook's **Theme** toolbar toggle both do this.
- **Sections** export one component per variant (`HeroA`, `HeroB`, …) plus an aggregate.
  Content flows in through props (required essentials, optional extras, a `children`
  escape hatch); interactive ones use React state (Navbar dropdown, FAQ accordion,
  Pricing toggle).
- **Pages** wrap section variants in `.rdz-page`, which flattens the preview frame so they
  stack into a seamless page.

## Layout map

```
src/
  components/<category>/<Name>/   tsx · scss · stories · test · index
  components/internal/            shared primitives (overlay, controllable state)
  sections/<Name>/                tsx · css · stories · test · index   (+ sections.css helpers)
  foundations/                    Colors/Typography/Spacing/Radius/Elevation/Motion docs
  pages/<Name>/                   example pages composed from sections
  explorer/                       the public showroom (auto-built from stories)
  lib/                            consumer-facing helpers (theme, hooks, sections shell)
  styles/                         styles.css + tokens/* · components.ts (scss aggregator)
  index.ts                        generated public barrel (pnpm gen:barrel)
catalog/                          generated llms.txt component catalog
.storybook/                       main.ts · preview.tsx · preview-head.html
```
