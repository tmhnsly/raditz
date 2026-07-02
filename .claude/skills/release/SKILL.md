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

## 2. Regenerate + drift gate
Run `pnpm release:preflight`. If it prints BLOCKED, run `pnpm gen:barrel && pnpm
gen:catalog`, commit the regenerated `src/index.ts` and `catalog/llms.txt`
(`chore: regenerate barrel + catalog`), then re-run preflight until it prints OK.

## 3. Build + test + a11y gate
- `pnpm build:pkg` — must succeed (produces dist/ ESM + d.ts + raditz.css).
- `node scripts/check-consumer.mjs` — must print OK.
- `pnpm test` — must pass (this includes the axe a11y gate in src/a11y.test.tsx).
If any fails, STOP and report the failure. Do not proceed to tag.

## 4. Version bump
- Read the current `version` in `package.json`.
- Choose the next version from the nature of the changes since the last tag
  (`git log $(git describe --tags --abbrev=0)..HEAD --oneline`; if there is no
  prior tag yet — the very first release — use `git log --oneline` instead):
  patch = fixes only, minor = new components/props (backward compatible),
  major = breaking API/token changes. If ambiguous, ask the user.
- Update `package.json` `version` to the chosen `X.Y.Z`.

## 5. Changelog
- Move the relevant `[Unreleased]` notes into a new `## [X.Y.Z]` section (add a
  fresh empty `## [Unreleased]` above it). Summarize the changes in plain prose
  (one bullet per user-visible change). Derive bullets from the commit log; do
  not invent.

## 6. Commit + tag
- `git add package.json CHANGELOG.md` (+ any regenerated artifacts from step 2).
- `git commit -m "chore(release): vX.Y.Z"`
- `git tag vX.Y.Z`

## 7. Report
Tell the user the new tag and the consumer pin line:
`"raditz": "github:tmhnsly/raditz#vX.Y.Z"`. Mention they still need to `git push
--follow-tags` (do NOT push automatically unless asked).
