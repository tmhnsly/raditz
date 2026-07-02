# Raditz — working guide

Raditz is a React + TypeScript design system (package `raditz`, CSS prefix `rdz-`).
`CONTEXT.md` holds the domain language and architecture decisions — read it for the
"why". This file is the operational "how to work here".

## Where does a component go?

Every public component lives at `src/components/<category>/<Name>/` with a co-located
`<Name>.tsx`, `.scss`/`.css`, `.stories.tsx`, `.test.tsx`. The **folder is the single
source of truth** — it drives the public API barrel, the catalog, and the showroom
title. Pick exactly one of the **13 categories**:

| category | what belongs here |
|---|---|
| `actions` | controls that act on activation (Button, Toggle) |
| `inputs` | value entry bound to form state (Input, Select, Checkbox, Field, Form) |
| `display` | small non-interactive inline visuals (Badge, Pill, Icon) |
| `feedback` | status / progress / transient notices (Spinner, Toast, Banner) |
| `typography` | text + screen-reader primitives (Heading, Text, Label, VisuallyHidden) |
| `layout` | space-arranging primitives (Container, Grid, Stack, Separator, AppShell) |
| `surfaces` | content-bearing planes (Card, Callout, Avatar, EmptyState) |
| `overlay` | floating/fixed layers incl. menus (Dialog, Popover, Tooltip, DropdownMenu) |
| `navigation` | wayfinding (NavBar, Tabs, Breadcrumb, PageHeader) |
| `disclosure` | show/hide in place (Accordion, Collapsible) |
| `data` | viz + tables (DataTable, charts) |
| `media` | image/gallery content (Carousel, Gallery, Marquee) |
| `motion` | entrance/animation primitives (Reveal, TextReveal, AnimatedIcon) |

A story's `meta.title` MUST be `Components/<TitleCase(category)>/<Name>` (e.g.
`Components/Actions/Button`). Don't add a new top-level category or a free-form title —
`scripts/validate-taxonomy.mjs` rejects both. (One curated showroom override exists:
`layout/AppShell → Pages/App shell`, declared in `TITLE_EXCEPTIONS`.) Shared, non-public
helpers go in `src/components/internal/` (not exported directly — a curated set of
primitives is re-exported via `src/lib/hooks.ts`).

## After adding / moving / renaming a component

```
pnpm validate:taxonomy        # folder ∈ categories AND story title matches
pnpm gen:barrel && pnpm gen:catalog   # regenerate src/index.ts + catalog/llms.txt (never hand-edit)
```

## Conventions

- **No inline styles** in library/sections — dynamic values via CSS custom properties;
  prefer container queries over media queries. Stories/`.storybook/` may use inline styles.
- **Strict TS**; factor repeated logic into `src/components/internal`.
- **Tests gate**: `pnpm test` runs the suite + an **axe a11y** check over every story.
- **Keep docs current**: update `CONTEXT.md` + `catalog/llms.txt` as part of the change.

## Verify

`pnpm build` (tsc + vite) · `pnpm test` · `pnpm build:pkg` (lib + CSS + `@layer` wrap) ·
`pnpm release:preflight` (validates taxonomy, regenerates artifacts, fails on drift).
