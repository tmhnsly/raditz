---
name: raditz-new
description: Bootstrap a new product from an empty directory using the Raditz design system. Use when the user, from an empty/near-empty dir, asks for a new app/site "using Raditz" / "with Raditz for design" (e.g. "a Next.js app that does X, use Raditz").
---

# New product from Raditz

## 1. Locate the library
Read `~/.claude/raditz.json`. If missing, ask for the local Raditz checkout path
(default guess `~/dev/raditz`), verify it contains `templates/`, then write
`{"libraryPath":"<path>"}` to `~/.claude/raditz.json`.

## 2. Choose the framework
Detect `next` or `vite` in the request. Default to **next** for app/SSR intents;
**vite** for SPA/dashboard intents. If genuinely ambiguous, ask once.

## 3. Scaffold
Confirm the target dir is empty (or ask before overwriting). Recursively copy
`<libraryPath>/templates/<framework>/` into it (offline, no degit).

## 4. Pin the dependency
- Slug: `git -C <libraryPath> remote get-url origin` → `github:OWNER/REPO`.
- Ref: `git -C <libraryPath> describe --tags --abbrev=0` if a tag exists, else
  the current branch (`git -C <libraryPath> branch --show-current`).
- Rewrite the new `package.json` `raditz` dep from `github:tmhnsly/raditz#REPLACE_WITH_TAG`
  to `github:OWNER/REPO#<ref>`. For local dev on an unpublished library, prefer
  `RADITZ_PATH=<libraryPath> pnpm rdz:link`.

## 5. Install and confirm
`pnpm install`. Confirm `node_modules/raditz/catalog/llms.txt` exists (built via
`prepare`). The template ships a product `CLAUDE.md` — leave it.

## 6. Report
State the framework, pinned ref, where product code goes, that components are
discovered in `node_modules/raditz/catalog/llms.txt` and imported from `raditz`,
and that the brand is set in `theme.css` (or `useTheme({accent})`). Don't build
features unless asked.
