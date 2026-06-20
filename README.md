# SuperRadix

A personal React + Vite + TypeScript UI library with Storybook, built on the
**SuperRadix** design system (Radix Colors + semantic tokens). Real, editable
components, sections, and full example pages — all re-skin and re-theme from one
accent token.

```bash
pnpm install
pnpm storybook    # the library (Foundations / Components / Sections / Pages)
```

## What's inside

A personal UI library, organized in Storybook into:

- **Foundations** — colors, typography, spacing, radius, elevation, motion (token docs)
- **Components** — 78 real, dependency-free React components across 15 categories
  (Controls, Forms, Surfaces, Layout, Navigation, Overlay, Menu, Disclosure,
  Feedback, Data, Media, Patterns, Typography, Utility, Foundation), each with a
  story + autodocs
- **Sections** — 18 composable page sections, each with variants
- **Pages** — full example pages (Landing, Pricing) composed from sections

## Folder-per-thing structure

Every component and section lives in its own folder with all its parts co-located:

```
src/components/controls/Button/
  Button.jsx          # implementation (renders rdz-* classes)
  Button.d.ts         # TypeScript types (props, IntelliSense)
  Button.scss         # co-located styles (split from the design system)
  Button.stories.tsx  # Storybook story + autodocs
  Button.test.tsx     # smoke test (renders every story)
  index.ts            # barrel — `import { Button } from '.../controls/Button'`
```

Sections follow the same pattern under `src/sections/<Name>/`. Per-component
`.scss` files are aggregated (in cascade order) by `src/styles/components.ts`,
which the app and Storybook import once.

## Commands

```bash
pnpm storybook    # the library — Foundations / Components / Sections / Pages
pnpm dev          # the sections catalog homepage
pnpm test         # vitest — every component & section story renders
pnpm build        # type-check + production build
pnpm build-storybook
```

## How it's wired

- **Tokens** live in `public/` and load once via `<link href="/styles.css">` (Radix scales →
  fonts → tokens → reset). Radix scales + webfonts come from CDN, so first load needs network.
- **Component styles** are co-located per component (`<Name>.scss`) and aggregated in cascade
  order by `src/styles/components.ts`, imported once by the app and Storybook (Sass).
- **Components** are strict TypeScript (`.tsx` with inline-exported prop interfaces — full
  IntelliSense), dependency-free pure React (no `@radix-ui/react-*` — they ship their own
  primitives in `src/components/internal/`), and render `rdz-*` classes.
- **Shared hooks/utils** live in `src/components/internal` and are reused across components
  instead of re-implemented: `cx` (class names), `onKeys`/`rovingIndex`/`KEYS`
  (keyboard), `useControllableState`, `useTrigger` (overlay open-state), `useStableId`,
  and the overlay hooks (`useDismiss`, `useFocusTrap`, `useScrollLock`,
  `useOverlayPosition`, `useRovingMenu`).
- **Accessibility** is enforced by `src/a11y.test.tsx`, which renders every component and
  asserts zero axe-core violations (part of `pnpm test`).
- **Theming**: toggling `class="dark"` on `<html>` re-themes everything — the app's
  `useColorScheme` toggle (system-aware: follows the OS until the user overrides) and
  Storybook's **Theme** toolbar toggle both do this.
- **Sections** export one component per variant (`HeroA`, `HeroB`, …) plus an aggregate.
  Interactive ones use React state (Navbar dropdown, FAQ accordion, Pricing toggle).
- **Pages** wrap section variants in `.rdz-page`, which flattens the preview frame so they
  stack into a seamless page.

## Layout map

```
public/                       styles.css + tokens/*   (design-system foundation)
src/
  components/<category>/<Name>/   jsx · d.ts · scss · stories · test · index
  components/internal/            shared primitives (overlay, controllable state)
  sections/<Name>/                tsx · stories · test · index   (+ sections.css helpers)
  foundations/                    Colors/Typography/Spacing/Radius/Elevation/Motion docs
  pages/<Name>/                   example pages composed from sections
  styles/components.ts            aggregates every component .scss
  main.tsx · App.tsx · App.css    the catalog homepage
.storybook/                       main.ts · preview.tsx · preview-head.html
```
