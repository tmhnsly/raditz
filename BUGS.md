# Raditz — bug list

A working list of bugs/issues to fix. Jot freely — one bug per entry. When an
entry is ready it can become a GitHub issue (`gh issue create`) and run through
`/triage`. Keep this list as the fast staging ground.

## Format

```
- **[severity] Short title** — `category/Component`
  - Repro: the smallest steps that show it
  - Expected: … / Actual: …
  - Notes: links, story name, suspected file
```

- **severity**: `blocker` | `high` | `med` | `low`
- **category**: one of the 13 — `actions`, `inputs`, `display`, `feedback`,
  `typography`, `layout`, `surfaces`, `overlay`, `navigation`, `disclosure`,
  `data`, `media`, `motion` — or `tooling` / `docs`.

---

## Open

<!-- Add bugs below. Example shape:
- **[high] DropdownMenu traps focus after Escape** — `overlay/DropdownMenu`
  - Repro: open menu, press Escape, Tab — focus is lost to <body>
  - Expected: focus returns to the trigger / Actual: focus on <body>
  - Notes: seen in Components/Overlay/DropdownMenu default story
-->

-

## Known (surfaced in the 2026-06-29 consumption / dev-server review)

_All resolved — see Done._

## Done

- **[low] Vite template had no co-dev watcher** — `tooling` (templates/vite) — added
  `scripts/dev.mjs` + a `dev:lib` script (mirrors the Next template) and
  `optimizeDeps.exclude: ['raditz']` so a rebuilt linked dist isn't stale-cached.
- **[trivial] `rdz-link.mjs` message stale** — `tooling` — now points at `pnpm dev:lib`
  (build + watch) in all three copies (templates/next, templates/vite, beats).
- **[low] Showroom app bundle > 500 kB** — `tooling` (build) — `vite.config.ts`
  `manualChunks` splits @visx (charts), react-icons (icons) and React into their own
  chunks; no single chunk over the limit.
- **[not a bug] "Public barrel uses Vite-only `import.meta.glob`"** — `tooling` — a
  misdiagnosis. The public barrel (`src/index.ts`) never imports the styles globs; they
  live in `src/styles/{components,sections}.ts`, loaded only by the showroom app +
  Storybook (`main.tsx`, `.storybook/preview.tsx`, `Explorer.tsx`). The glob is a
  deliberate, documented CSS-aggregation safety (stops a component's stylesheet being
  silently dropped). No change — removing it would regress that.
