# Raditz Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the library SuperRadix → Raditz across the whole codebase (CSS class prefix `srx-` → `rdz-`, package/name identity, storage key, git remote, directory) as one isolated, behavior-preserving change before any distribution work.

**Architecture:** Pure mechanical find/replace. No behavior changes. Correctness is proven by the existing test + a11y suite staying green and by greps showing zero stragglers of the old name. Done as small, reviewable commits on the `feat/raditz-rename-and-distribution` branch (already created off `main`).

**Tech Stack:** pnpm, Vite, TypeScript (strict), Vitest + axe-core, SCSS. Platform: macOS (darwin) — `sed -i ''` requires the empty-string argument.

## Global Constraints

- Package manager is **pnpm** (`pnpm@10.29.2`) — never npm/yarn.
- The rename must be **behavior-preserving**: `pnpm test` (includes the axe a11y gate in `src/a11y.test.tsx`) and `pnpm build` must pass before and after every task.
- Canonical replacements: CSS prefix `srx-` → **`rdz-`**; identity `superradix` → **`raditz`** and `SuperRadix` → **`Raditz`**; storage key `srx-color-scheme` → **`rdz-color-scheme`** (covered by the `srx-` rule).
- macOS sed: every in-place edit uses `sed -i '' 's/.../.../g'`.
- Use `git grep` (tracked files only) so `node_modules`/`dist` are never touched.

---

### Task 1: Migrate the CSS class prefix `srx-` → `rdz-`

This is the bulk of the rename: ~1787 occurrences across ~211 files (`.scss`, `.tsx`, `.ts`, `public/styles.css`, `index.html`, `.storybook/`). Every class shares the `srx-` prefix (`srx-btn`, `srx-on-dark`, `srx-overlay`, the `srx-color-scheme` key, …), so one rule covers them all.

**Files:**
- Modify: every tracked file containing `srx-` (enumerated at runtime by `git grep -l 'srx-'`)
- Test: existing suite — `src/a11y.test.tsx` + all co-located `*.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: the `rdz-` class namespace that all later tasks and the distribution work assume.

- [ ] **Step 1: Baseline — confirm green before touching anything**

Run:
```bash
pnpm test && pnpm build
```
Expected: tests PASS, build succeeds. If anything is red here, STOP — it's pre-existing and must be resolved before a rename muddies the diff.

- [ ] **Step 2: Record the pre-change count (for sanity-checking the diff later)**

Run:
```bash
echo "files: $(git grep -l 'srx-' | wc -l)  matches: $(git grep -o 'srx-' | wc -l)"
```
Expected: roughly `files: 211  matches: 1787` (exact numbers may shift slightly with the merged refactor — just note them).

- [ ] **Step 3: Perform the replace across all tracked files**

Run:
```bash
git grep -l 'srx-' | xargs sed -i '' 's/srx-/rdz-/g'
```

- [ ] **Step 4: Verify zero `srx-` remain, and catch bare `srx` identifiers**

Run:
```bash
echo "remaining srx- : $(git grep -c 'srx-' | wc -l)  (want 0)"
git grep -nw 'srx' ; git grep -n 'srx[A-Za-z0-9_]' ; echo "^ any hits above are non-prefix stragglers — fix by hand"
```
Expected: zero `srx-`. The bare-`srx` greps should be empty (the prefix was the only use). If any identifier like `srxFoo` appears, rename it to `rdzFoo` manually and re-run.

- [ ] **Step 5: Confirm the diff is *only* the prefix change**

Run:
```bash
git diff | grep -E '^[+-]' | grep -v '^[+-][+-]' | grep -viE 'rdz-|srx-' | head -40
```
Expected: empty (every changed line is the prefix swap). Investigate anything that prints.

- [ ] **Step 6: Run tests — behavior must be unchanged**

Run:
```bash
pnpm test
```
Expected: PASS. Class names are internal; renaming them changes no rendered behavior or a11y. If a test queried a `.srx-…` selector it was renamed in lockstep, so it still passes.

- [ ] **Step 7: Run the build**

Run:
```bash
pnpm build
```
Expected: success.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename CSS class prefix srx- → rdz-"
```

---

### Task 2: Rename the package/library identity `superradix`/`SuperRadix` → `raditz`/`Raditz`

Covers the `package.json` `name`, docs (`README.md`, `CONTEXT.md`), `index.html` title, Storybook/Vite/Vitest config, and source comments ("Uses SuperRadix tokens", etc.).

**Files:**
- Modify: every tracked file containing `superradix` or `SuperRadix` (enumerated at runtime)
- Test: existing suite

**Interfaces:**
- Consumes: nothing.
- Produces: the package name `raditz` (the git-dep import name the distribution plan relies on) and `Raditz` display name.

- [ ] **Step 1: See what will change**

Run:
```bash
git grep -in 'superradix' | sed 's/:.*//' | sort -u
```
Expected: a short list — `package.json`, `README.md`, `CONTEXT.md`, `index.html`, maybe `.storybook/*` and a few comment-bearing source files.

- [ ] **Step 2: Replace lowercase then capitalized**

Run:
```bash
git grep -l 'superradix' | xargs sed -i '' 's/superradix/raditz/g'
git grep -l 'SuperRadix' | xargs sed -i '' 's/SuperRadix/Raditz/g'
```

- [ ] **Step 3: Verify zero stragglers (any casing)**

Run:
```bash
git grep -in 'superradix' ; echo "^ want empty"
```
Expected: empty.

- [ ] **Step 4: Confirm `package.json` name is correct**

Run:
```bash
grep '"name"' package.json
```
Expected: `"name": "raditz",`.

- [ ] **Step 5: Run tests + build**

Run:
```bash
pnpm test && pnpm build
```
Expected: PASS + success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename library identity SuperRadix → Raditz"
```

---

### Task 3: Rename the GitHub repo, git remote, and local directory

Operational rename. The GitHub step needs network + auth; the directory `mv` **breaks the running Claude session's working directory**, so it is the last step and is run by the user.

**Files:**
- Modify: git remote config (`git remote set-url`)
- External: GitHub repo name; local filesystem directory name

**Interfaces:**
- Consumes: the committed identity rename from Tasks 1–2.
- Produces: remote `github.com/tmhnsly/raditz.git` and path `~/dev/raditz` — the `github:tmhnsly/raditz#<tag>` git-dep form the distribution plan consumes.

- [ ] **Step 1: Push the branch (so the rename commits are safe before any repo rename)**

Run:
```bash
git push -u origin feat/raditz-rename-and-distribution
```

- [ ] **Step 2: Rename the GitHub repository**

Run:
```bash
gh repo rename raditz --repo tmhnsly/superradix
```
Expected: repo becomes `tmhnsly/raditz`; GitHub auto-redirects the old URL. (If `gh` is unavailable, rename via the GitHub web UI: Settings → Repository name → `raditz`.)

- [ ] **Step 3: Point the local remote at the new name**

Run:
```bash
git remote set-url origin https://github.com/tmhnsly/raditz.git
git remote -v
```
Expected: both lines show `tmhnsly/raditz.git`.

- [ ] **Step 4: Verify the remote still works**

Run:
```bash
git fetch origin
```
Expected: succeeds (no auth/redirect errors).

- [ ] **Step 5 (USER-RUN, last): Rename the local directory**

> ⚠️ This invalidates the current Claude session's working directory. Do it when you're ready to restart the session in the new path.

Run in a terminal (not via this session):
```bash
mv ~/dev/superradix ~/dev/raditz
```
Then restart Claude Code in `~/dev/raditz`.

- [ ] **Step 6: Open the PR (optional, once happy)**

```bash
gh pr create --fill --title "Rename SuperRadix → Raditz" --repo tmhnsly/raditz
```

---

## Self-Review

**Spec coverage (§0 Rename cascade):** package name + imports → `raditz` (Task 2 ✓); repo + git remote → `raditz` (Task 3 ✓); CSS prefix `srx-`→`rdz-` incl. `.srx-on-dark`/`.srx-overlay` (Task 1 ✓, single prefix rule); storage key `srx-color-scheme`→`rdz-color-scheme` (Task 1 ✓, has the `srx-` prefix); `rdz:` pnpm scripts + `/raditz` skill namespace (N/A here — those scripts/skills don't exist yet; they're created in the distribution plan); one isolated set of commits before distribution work (✓, this whole plan).

**Placeholder scan:** none — every step has the exact command and expected output.

**Type/name consistency:** `rdz-`, `raditz`, `Raditz`, `rdz-color-scheme`, `tmhnsly/raditz` used identically throughout.

**Note for the executor:** the directory rename (Task 3 Step 5) is deliberately deferred and user-run because it kills the session cwd. Everything before it is safe to run in-session.
