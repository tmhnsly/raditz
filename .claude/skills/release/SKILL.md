---
name: release
description: Cut a gated Raditz release — regenerate artifacts, run the build + test + a11y gate, bump version, update the changelog, commit, and tag. Use when the user says "release", "cut a release", "tag a version", or after a promote lands a component.
---

# Release Raditz

A release is a deliberate, gated act. Run these steps IN ORDER from the library
repo root and STOP if any gate fails — never tag on a red gate.

## 1. Preconditions
- Confirm the working tree is clean (`git status --porcelain` empty) or that all
  intended changes are committed. If dirty with unintended changes, stop and ask.
- Confirm you are on an integration branch (not detached HEAD).

## 2. The gate
Run `pnpm release:gate` — ONE command, the whole release spine in order:
`release:preflight` (taxonomy + regenerated barrel/catalog drift + 'use client'
no-op) → `build:pkg` (dist/ ESM + d.ts + raditz.css) → `check-consumer.mjs`
(dist artifacts, exports, tree-shaking, RSC directives) → `pnpm test` (suite
incl. the axe a11y gate in src/a11y.test.tsx).
- If preflight prints BLOCKED: run `pnpm gen:barrel && pnpm gen:catalog`, commit
  the regenerated `src/index.ts` and `catalog/llms.txt` (`chore: regenerate
  barrel + catalog`), then re-run `pnpm release:gate` until it passes end to end.
- If ANY later stage fails, STOP and report the failure. Never tag on a red
  gate.

## 3. Version bump
- Read the current `version` in `package.json`.
- Choose the next version from the nature of the changes since the last tag
  (`git log $(git describe --tags --abbrev=0)..HEAD --oneline`; if there is no
  prior tag yet — the very first release — use `git log --oneline` instead):
  patch = fixes only, minor = new components/props (backward compatible),
  major = breaking API/token changes. If ambiguous, ask the user.
- Update `package.json` `version` to the chosen `X.Y.Z`.

## 4. Changelog
- Move the relevant `[Unreleased]` notes into a new `## [X.Y.Z]` section (add a
  fresh empty `## [Unreleased]` above it). Summarize the changes in plain prose
  (one bullet per user-visible change). Derive bullets from the commit log; do
  not invent.

## 5. Commit + tag
- `git add package.json CHANGELOG.md` (+ any regenerated artifacts from step 2).
- `git commit -m "chore(release): vX.Y.Z"`
- `git tag vX.Y.Z`

## 6. Report
Tell the user the new tag and the consumer pin line:
`"raditz": "github:tmhnsly/raditz#vX.Y.Z"`. Mention they still need to `git push
--follow-tags` (do NOT push automatically unless asked).
