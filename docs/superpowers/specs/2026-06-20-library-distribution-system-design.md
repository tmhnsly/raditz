# Raditz Distribution & Consumption System — Design

**Date:** 2026-06-20
**Status:** Approved design, pending implementation plan

## Problem

Raditz is a pre-tested component + section library built so its author can
spin up products/websites/apps quickly and focus on product logic instead of
re-deriving UI every time. Today it is a private Vite app (`name: raditz`,
`private: true`) with no public entry, no package boundary, and tokens served
from `public/` — so it cannot be consumed by another project.

We need a distribution + consumption system that satisfies four requirements:

1. **Reuse** — every new product starts from Raditz as its UI basis.
2. **Grow** — when a product needs a new component/layout, it can be added back
   into the canonical library and accumulate over time.
3. **Protect** — an LLM (Claude Code, used locally) must *consume* the design
   system, never silently edit, override, or re-implement it.
4. **Zero management** — the author does not want to hand-maintain catalogs,
   versions, changelogs, or wiring. The system does it as it goes.

## Core tension and its resolution

Requirements 2 (grow easily) and 3 (don't let the LLM touch it) pull in
opposite directions. Resolution: **consuming the library is frictionless and
immutable; changing the library is a deliberate, gated act that happens in the
library repo, never casually in a product.**

This yields **three distinct flows**, each with the right amount of friction:

| Need | Flow | Where editing happens |
|---|---|---|
| Use existing components | **Consume** (default) | nowhere — import only |
| Add a brand-new component | **Promote** | built in product → moved into library |
| Fix a bug/incompat in an existing component | **Link** | library repo (product previews live) |

## Architecture

Decisions locked during brainstorming:

- **Consumption mechanism:** versioned **git dependency** (no registry to host).
  Products pin a tag: `"raditz": "github:tom/raditz#v0.3.0"`.
- **Repo layout:** **separate repos.** Each product is its own repo started from
  a template; the library is one canonical repo.
- **Build:** **build once, framework-agnostic** (reversed from an earlier
  "no build" call once Next.js entered scope). A small build (Vite library mode
  or tsup) emits ESM JS + `.d.ts` types + one compiled CSS file, preserving
  `"use client"` directives. Run automatically via the `prepare` script on git
  install (and owned by the release skill), so git-dep consumers get built output
  with no action. This removes per-framework config: Next App Router, Vite, and
  Remix all consume identically — no `transpilePackages`, no consumer SCSS setup.
  (The source is verified clean for this: no path aliases, no extensioned imports,
  no asset imports, SCSS depends only on CSS custom properties.)
- **Frameworks:** multiple product templates (Next.js App Router + Vite SPA to
  start). The build output is framework-neutral; each template only differs in how
  it mounts the one CSS import, the theme provider, and (for Next) an SSR no-flash
  script.
- **Orchestration skills are user-level** (`~/.claude/skills/`), not in-repo,
  because their triggers fire *outside* the library repo — in a finished product
  ("port this to Raditz") or an empty directory ("new Next app using
  Raditz"). They locate the library via a configured checkout path.
- **CDN dependencies:** **vendored** (not CDN). Radix colour scales via the
  `@radix-ui/colors` package; fonts self-hosted. Package becomes self-contained
  and offline-safe. **pnpm** is the package manager throughout (consistent with
  the existing `packageManager: pnpm@10.29.2`).

```
~/.claude/skills/                 ← GLOBAL skills (available in any directory)
  ├─ raditz-new/              NEW: bootstrap a product from an empty dir
  └─ raditz-promote/          NEW: port a component from a product → library
  (both read a configured library checkout path, e.g. ~/dev/raditz)

raditz/                       ← the library (this repo). Single source of truth.
  ├─ src/index.ts                 NEW: public barrel — the only import door
  ├─ src/components/…             source; "use client" on interactive components
  ├─ src/sections/…               source (Hero, Pricing, … are public)
  ├─ src/lib/…                    public primitives (useColorScheme, ThemePicker, theme)
  ├─ src/styles/                  MOVED from public/: styles.css manifest + tokens/
  ├─ src/styles/fonts/            NEW: self-hosted font files
  ├─ dist/                        build output (ESM + d.ts + one CSS); built by prepare
  ├─ catalog/llms.txt             NEW: generated component catalog for Claude
  ├─ scripts/gen-catalog.mjs      NEW: catalog generator (same pattern as gen-tests.mjs)
  ├─ .claude/skills/release/      NEW: in-repo gated build + tag + changelog + catalog
  └─ templates/                   NEW: product templates (degit source for raditz-new)
       ├─ next/                   Next.js App Router template
       │    ├─ CLAUDE.md          consumption rules (library is read-only)
       │    ├─ next.config.ts     (transpilePackages not needed — built output)
       │    └─ app/layout.tsx     imports raditz/styles.css + ThemeProvider + no-flash script
       └─ vite/                   Vite SPA template
            ├─ CLAUDE.md
            └─ src/main.tsx       imports raditz/styles.css + theme wiring

product-foo/                      ← independent repo, scaffolded by raditz-new
  ├─ package.json                 "raditz": "github:tom/raditz#v0.3.0"
  ├─ CLAUDE.md                    don't-edit-the-library rules + catalog pointer
  └─ src|app/…                    product logic + composed Raditz
```

## Components of the system

### 0. Rename cascade (SuperRadix → Raditz, prerequisite)

A mechanical, codebase-wide rename runs first, since everything below assumes the
new name:
- Package `name` and all imports → `raditz`; repo directory + git remote → `raditz`.
- CSS class prefix `srx-` → `rdz-` across every `.scss` and any class references
  in `.tsx` (e.g. `.srx-btn` → `.rdz-btn`). The `.srx-on-dark` / `.srx-overlay`
  context classes rename too (`.rdz-on-dark`, `.rdz-overlay`).
- Storage keys and any user-facing strings (e.g. the `srx-color-scheme`
  localStorage key → `rdz-color-scheme`).
- pnpm scripts use the `rdz:` namespace (`rdz:link`, `rdz:unlink`); skills use the
  `/raditz` command namespace.
Done as one isolated commit (pure find/replace + token-class migration) before the
distribution work, so the diff stays reviewable.

### 1. Public barrel (`src/index.ts`)

A curated re-export of the **public surface only**: components, sections, and the
public `lib` primitives. `internal/`, `explorer/`, `demos/`, `pages/`, and
`*.stories.tsx` are NOT exported — they are the workshop, not the product.
The barrel is the contract; the `exports` map gates importable subpaths.

### 2. `package.json` as a package

- Real `name`, drop `private: true` (or keep private + rely on git dep — git
  deps install regardless of `private`, so keep `private: true` for safety since
  we never `npm publish`).
- `exports`: `"."` → `dist/index.js` (+ `types` → `dist/index.d.ts`);
  `"./styles.css"` → the one compiled stylesheet; `"./tokens/*"` → individual
  token files for advanced use.
- `"prepare"` script runs the build, so installing the git dep auto-produces
  `dist/` with no consumer action; the release skill runs the same build before
  tagging. `main`/`module`/`types` point at `dist`.
- `peerDependencies`: `react` / `react-dom` at `>=18` (React 19 products work).
- `dependencies`: `@visx/*`, `date-fns`, `@radix-ui/colors` (vendored).
- `"sideEffects": ["**/*.css"]` — lets bundlers tree-shake unused components
  (and their heavy deps like visx/date-fns) while preserving the global stylesheet.
- `files` whitelist (`dist`, `catalog`, token CSS) — keeps `node_modules/raditz`
  lean even over a git dep (git deps respect `files` at pack time).

### 3. Styles relocation (the compatibility blocker)

`public/styles.css` and `public/tokens/*` move into `src/styles/`. `public/` is
served statically and is **not importable from a package** — this is the one
change without which no product can load tokens. The `@import url("tokens/…")`
references stay relative and keep working. Consumers import the single
`raditz/styles.css` once (carried by the template). The existing JS aggregate
(`src/styles/components.ts`, which imports every component's `.scss`) is the
companion import for component styles; both are wired in the template.

### 4. Vendored colours + self-hosted fonts

- Replace the jsDelivr `radix-colors.css` import with `@radix-ui/colors` (added
  via pnpm). Token names are identical — nothing downstream changes.
- Download the Space Grotesk / Space Mono webfonts into `src/styles/fonts/` and
  replace the Google Fonts `@import` in `fonts.css` with `@font-face` rules
  pointing at the local files.
- Outcome: no runtime CDN dependency; products work offline; a CDN outage can
  never degrade colours/fonts across all products at once.

### 5. LLM-consumption layer

Three reinforcing guardrails, shipped *with* the package so they track the version:

- **Generated `catalog/llms.txt`** — built by `scripts/gen-catalog.mjs` (the same
  fs-walk codegen pattern as `gen-tests.mjs`): every public component, its prop
  types, and a canonical usage snippet derived from its story. Hand-written never;
  drift-free by construction.
- **Product `CLAUDE.md`** (in the starter) with precise rules: *"Raditz is a
  read-only dependency. Never edit `node_modules/raditz`. Never re-implement a
  component that exists — import it. Library changes happen in the library repo,
  behind its tests — via the promote workflow (new) or a linked fix (existing),
  never an inline copy. Discover components in `node_modules/raditz/catalog/llms.txt`."*
- **TypeScript types** — strict types are the hard backstop; wrong usage fails to
  compile.

### 6. The three flows as automation

**Consume / bootstrap (default).** Spoken trigger from an empty directory —
*"I want a Next.js app that does X, use Raditz for design."* The global
`raditz-new` skill: picks the framework template (`templates/next` or
`templates/vite`), degits it into the dir, sets the git-dep to the current tag,
mounts `raditz/styles.css` + the theme provider (+ Next no-flash script),
and **writes the product `CLAUDE.md`** (read-only rules + catalog pointer). The
author then builds product logic; Claude imports from `raditz`.

**Grow (promote).** Spoken trigger from a *finished product repo* — *"port this
feature/component as a reusable item in Raditz."* The global
`raditz-promote` skill reaches into the configured library checkout: moves the
component into the correct `src/components/<category>/`, ports its story + test,
adds `"use client"` if interactive, runs `scripts/gen-catalog.mjs`, then invokes
the in-repo `release` skill (build + `pnpm test` + axe a11y gate; on green,
commit + tag + append `CHANGELOG.md`). The product then bumps its dep to receive
the polished version.

**Fix (link).** When a shipped component has a bug/incompat discovered mid-build:
1. `pnpm rdz:link` in the product — a pnpm override repoints
   `node_modules/raditz` at the local library checkout, with the library
   running `pnpm build --watch` (or its dev entry) so edits propagate live.
2. Fix in the **library repo** (its CLAUDE.md governs: tests + axe gate +
   changelog). The product is only the live preview.
3. The `release` skill cuts a new tag; `pnpm rdz:unlink` flips the product back
   to the tagged git dep.
Fallback when the library isn't checked out: `pnpm patch raditz` — an
explicit, committed patch that unblocks the product and flags a pending upstream fix.

### 7. Framework support (Next.js App Router specifics)

The build output is framework-neutral, so the per-framework work is small and
lives in the templates, not the library:

- **`"use client"`** — interactive component sources carry the directive
  (harmless under Vite, required under RSC). A codemod can add it to any component
  file referencing React hooks/handlers; purely-static sections may omit it so
  they can still render as server components.
- **CSS placement** — App Router only allows global CSS imports in the root
  layout, so `templates/next/app/layout.tsx` imports `raditz/styles.css`
  there. The Vite template imports it in `main.tsx`.
- **SSR theme / no flash** — `useColorScheme` reads OS + `localStorage`. The Next
  template injects an inline pre-paint script that sets `class="dark"` before
  hydration and uses `suppressHydrationWarning` on `<html>`, eliminating the
  flash and the hydration mismatch.
- **`transpilePackages`** — *not* needed, because we ship built `dist/` rather
  than raw source. (Documented in the template so it's clear why it's absent.)

## Performance considerations

- Pre-built `dist/` means zero per-product compile cost and no consumer toolchain
  edge cases; the build runs once per release (and once on git install via `prepare`).
- Tree-shaking: ESM output (multi-entry, preserved modules) + `sideEffects`
  whitelist means a product bundles only the components it imports; visx/date-fns
  are pulled only by chart/date components.
- CSS: shipped as one whole stylesheet (small, static, gzips well) — the
  deliberate trade for zero per-component style management.

## Out of scope (YAGNI)

- Private npm registry / GitHub Packages (git dep is sufficient for a solo dev).
- A monorepo of products (separate repos chosen for isolation).
- Per-component CSS code-splitting (one stylesheet is simpler and small enough).
- Runtime MCP server for component docs (static `llms.txt` is offline, version-
  pinned, and zero-infrastructure).
- A semver release tool (plain git tags + skill-driven changelog).

## Success criteria

1. From an empty dir, the spoken trigger scaffolds a runnable **Next.js** (and
   **Vite**) product importing real Raditz components with correct
   tokens/self-hosted fonts, offline, no theme flash, and an auto-written CLAUDE.md.
2. Importing one component does not bundle visx/date-fns.
3. Claude in a product, given only the catalog + CLAUDE.md, composes existing
   components correctly and does not edit `node_modules` or re-implement.
4. The spoken promote trigger, from a finished product, lands the component in the
   library and ends in a new tag with regenerated catalog + changelog, gated on a
   passing build + tests + a11y — with no manual catalog/version edits.

## Open implementation questions (for the plan)

- Exact `exports` subpath surface (do we expose `./tokens/*` individually, or
  only the bundled `styles.css`?). Lean: bundled only, add subpaths if needed.
- Build tool: Vite library mode vs tsup (both preserve `"use client"` and do
  multi-entry ESM). Lean: whichever gives cleaner per-component entries for
  tree-shaking — decide during the plan.
- Where the global skills read the library checkout path from (a config file in
  `~/.claude/` vs an env var). Lean: a small config file the skills self-write on
  first run.
- How `raditz-new` infers framework + intent from the spoken prompt (explicit
  keyword vs ask-once). Lean: detect "next"/"vite" in the prompt, default to Next,
  confirm only if ambiguous.
