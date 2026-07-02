---
name: raditz-promote
description: Promote a component built in a product into the canonical Raditz library, behind its tests, then cut a release. Use when the user, from a product repo, says "port this to Raditz" / "make this a reusable Raditz component" / "promote this component".
---

# Promote a component into Raditz

## 1. Locate the library
Read `~/.claude/raditz.json` (see raditz-new); establish + persist it if missing.

## 2. Identify what to promote
Pick the product component file(s) and the destination: a category under
`<libraryPath>/src/components/<category>/<Name>/` or a section under
`<libraryPath>/src/sections/<Name>/`. Match the library structure: `<Name>.tsx`
(+ `<Name>.scss` if styled), `index.ts` (`export * from './<Name>'` + `import
'./<Name>.scss'` if styled), and a `<Name>.stories.tsx` (REQUIRED — the
catalog/barrel only include dirs with a story).

## 3. Port it
Copy in, rewriting product imports to library conventions (semantic tokens, `cx`
from `../../internal`, `Icon`, …). Author the story (CSF3 `meta` + a default
story); create the smoke test via
`pnpm -C <libraryPath> exec node scripts/gen-tests.mjs <category>/<Name>` or by hand.

## 4. Mark client boundary
`pnpm -C <libraryPath> codemod:use-client` (adds `"use client"` if it uses
hooks/handlers/browser APIs; idempotent; static stays RSC).

## 5. Regenerate the public surface
`pnpm -C <libraryPath> gen:barrel && pnpm -C <libraryPath> gen:catalog`.

## 6. Gate + release
In the library repo, invoke the **release** skill (`.claude/skills/release/`):
preflight drift gate → `build:pkg` + `check-consumer` + `test` (incl. axe) →
version bump → `CHANGELOG.md` → commit → tag. Never tag on a red gate.

## 7. Report
Give the new tag; tell the user to bump the product's `raditz` dep to
`github:tmhnsly/raditz#<newTag>` (the library's `origin` slug) to receive the
component.
