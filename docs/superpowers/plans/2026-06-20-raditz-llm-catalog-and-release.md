# Raditz LLM Catalog & Release Gating — Plan (Phase 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Raditz a drift-free, generated LLM-consumption catalog (`catalog/llms.txt`) describing every public component's API + usage, and a gated in-repo `release` skill that regenerates artifacts, runs the build + test + a11y gate, then bumps version, updates the changelog, commits, and tags — with no hand-maintained catalog or version wiring.

**Architecture:** A codegen script (`scripts/gen-catalog.mjs`) walks the same public surface as the barrel (a dir is public iff it has a `*.stories.tsx`), uses `react-docgen-typescript` to extract each exported component's description + own props (inherited HTML/React attrs filtered out), reads story export names for "examples", and writes one markdown `catalog/llms.txt` grouped by category. A deterministic `scripts/release-preflight.mjs` regenerates the barrel + catalog and fails if that leaves uncommitted drift (forcing generated artifacts to be current). The `.claude/skills/release/` skill orchestrates the human-judgment parts (version bump, changelog prose, tag) around the mechanical gate.

**Tech Stack:** Node ESM scripts, `react-docgen-typescript`, TypeScript (strict), pnpm, git tags, an in-repo Claude Code skill (`SKILL.md`).

## Global Constraints

- Package manager is **pnpm**; `"private": true` stays; `name: "raditz"`.
- The catalog is **generated, never hand-edited** — `scripts/gen-catalog.mjs` is the only writer of `catalog/llms.txt`; drift is a release blocker.
- Public surface = the SAME rule as the barrel (Phase 1): a component/section dir is public **iff it contains a `*.stories.tsx`**. `internal/`, `explorer/`, `demos/`, `pages/` are never in the catalog. The two internal helpers `data/charts` (ChartFrame) and `menu/MenuSurface` must NOT appear.
- All public exports import from the package root: `import { X } from 'raditz'`.
- `package.json` already declares `files: ["dist","catalog"]` — the catalog ships in the package; keep it under `catalog/`.
- The release gate is `pnpm build:pkg` (must succeed) **and** `pnpm test` (must pass — this already includes the axe a11y gate in `src/a11y.test.tsx`).
- No semver tooling — plain git tags `vX.Y.Z` + a skill-written `CHANGELOG.md` (Keep a Changelog style).
- `dist/` and `dist-app/` stay git-ignored; do not commit build output.
- Commit all work; confirm a clean tree after each task.

## File Structure

**Created:**
- `scripts/gen-catalog.mjs` — generator: walks public components + sections, runs `react-docgen-typescript`, writes `catalog/llms.txt`.
- `catalog/llms.txt` — generated catalog (committed; ships via `files`).
- `scripts/release-preflight.mjs` — regenerates barrel + catalog, fails on uncommitted drift in `src/index.ts` or `catalog/llms.txt`; prints a clear pass/blocked message.
- `.claude/skills/release/SKILL.md` — the gated release procedure (Claude follows it when the user says "release"/"cut a release").
- `CHANGELOG.md` — Keep a Changelog seed with the current `0.1.0` entry.

**Modified:**
- `package.json` — add `react-docgen-typescript` (devDependency); add scripts `gen:catalog`, `release:preflight`.

---

## Task 1: Catalog generator (`catalog/llms.txt`)

**Files:**
- Create: `scripts/gen-catalog.mjs`, `catalog/llms.txt` (generated)
- Modify: `package.json` (devDep + `gen:catalog` script)

**Interfaces:**
- Consumes: `src/components/<cat>/<Name>/<Name>.tsx` + `<Name>.stories.tsx` (public = has a story); `src/sections/<Name>/<Name>.tsx` + story; the same exclusions as `scripts/gen-barrel.mjs`.
- Produces: `catalog/llms.txt`. Later: `scripts/release-preflight.mjs` regenerates it and guards drift; the `release` skill commits it.

- [ ] **Step 1: Add the dependency**

```bash
cd /Users/tom/dev/raditz
pnpm add -D react-docgen-typescript
```

- [ ] **Step 2: Write the generator**

Create `scripts/gen-catalog.mjs`:

```js
// Generates catalog/llms.txt — the LLM-facing component catalog.
// Walks the SAME public surface as gen-barrel (a dir is public iff it has a
// *.stories.tsx). For each public component/section file, react-docgen-typescript
// extracts the exported components' descriptions + own props (inherited HTML/React
// attrs are filtered out). Story export names are listed as examples. Hand-written
// never — run `pnpm gen:catalog`.
import fs from 'node:fs';
import path from 'node:path';
import { withCompilerOptions } from 'react-docgen-typescript';

// One parser/TS program, reused across files (faster than per-file default config).
const parser = withCompilerOptions(
  { jsx: 'react-jsx', esModuleInterop: true, skipLibCheck: true },
  {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    // Keep only props declared in our own source; drop inherited DOM/React props
    // (their `parent.fileName` lives in node_modules).
    propFilter: (prop) =>
      !prop.parent || !prop.parent.fileName.includes('node_modules'),
  },
);

function hasStory(dir) {
  return fs.readdirSync(dir).some((f) => f.endsWith('.stories.tsx'));
}

function storyExampleNames(dir, base) {
  const file = path.join(dir, `${base}.stories.tsx`);
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, 'utf8');
  const names = [];
  const re = /export const (\w+)\s*[:=]/g;
  let m;
  while ((m = re.exec(src))) if (m[1] !== 'default') names.push(m[1]);
  return names;
}

function fmtProp(p) {
  const opt = p.required ? '' : '?';
  const type = (p.type && p.type.name) || 'unknown';
  const dv = p.defaultValue && p.defaultValue.value;
  const def = dv !== undefined && dv !== null && dv !== '' ? ` (default: ${dv})` : '';
  const desc = p.description ? ` — ${p.description.replace(/\s+/g, ' ').trim()}` : '';
  return `  - ${p.name}${opt}: ${type}${def}${desc}`;
}

function usageSnippet(doc) {
  const hasChildren = doc.props && Object.prototype.hasOwnProperty.call(doc.props, 'children');
  return hasChildren ? `<${doc.displayName}>…</${doc.displayName}>` : `<${doc.displayName} />`;
}

function renderDoc(doc, examples) {
  const out = [`### ${doc.displayName}`, `Import: \`import { ${doc.displayName} } from 'raditz'\``];
  if (doc.description) out.push('', doc.description.replace(/\s+/g, ' ').trim());
  const props = Object.values(doc.props || {});
  if (props.length) {
    out.push('', 'Props:');
    for (const p of props.sort((a, b) => a.name.localeCompare(b.name))) out.push(fmtProp(p));
  } else {
    out.push('', 'Props: none');
  }
  if (examples.length) out.push('', `Examples (Storybook stories): ${examples.join(', ')}`);
  out.push('', 'Usage:', '```tsx', usageSnippet(doc), '```');
  return out.join('\n');
}

// Collect public files as { category, label, dir, file, base }.
function collect() {
  const items = [];
  const compRoot = 'src/components';
  for (const cat of fs.readdirSync(compRoot).sort()) {
    const catDir = path.join(compRoot, cat);
    if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (!fs.statSync(dir).isDirectory() || !hasStory(dir)) continue;
      items.push({ category: cat, label: cat, dir, file: path.join(dir, `${name}.tsx`), base: name });
    }
  }
  const secRoot = 'src/sections';
  for (const name of fs.readdirSync(secRoot).sort()) {
    const dir = path.join(secRoot, name);
    if (!fs.statSync(dir).isDirectory() || !hasStory(dir)) continue;
    items.push({ category: 'sections', label: 'sections', dir, file: path.join(dir, `${name}.tsx`), base: name });
  }
  return items;
}

const items = collect();
const byCategory = new Map();
let componentCount = 0;

for (const it of items) {
  if (!fs.existsSync(it.file)) continue;
  const docs = parser.parse(it.file);
  if (!docs.length) continue;
  const examples = storyExampleNames(it.dir, it.base);
  const blocks = docs
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map((d) => renderDoc(d, examples));
  componentCount += docs.length;
  if (!byCategory.has(it.category)) byCategory.set(it.category, []);
  byCategory.get(it.category).push(...blocks);
}

const header = [
  '# Raditz Component Catalog',
  '',
  'Raditz is a pre-built design-system package. CONSUME it — never re-implement a',
  'component that exists here, and never edit `node_modules/raditz`.',
  '',
  '- Import components/sections from the package root: `import { Button, HeroA } from \'raditz\'`.',
  '- Import the stylesheet ONCE at the app root: `import \'raditz/styles.css\'`.',
  '- Props below are the component-specific API; standard HTML attributes also pass through.',
  '',
  `${componentCount} exported components across ${byCategory.size} categories.`,
  '',
];

const sections = [];
for (const cat of [...byCategory.keys()].sort()) {
  sections.push(`## ${cat}`, '', byCategory.get(cat).join('\n\n'), '');
}

fs.mkdirSync('catalog', { recursive: true });
fs.writeFileSync('catalog/llms.txt', header.concat(sections).join('\n'));
console.log(`wrote catalog/llms.txt (${componentCount} components in ${byCategory.size} categories)`);
```

- [ ] **Step 3: Add the script and run it**

In `package.json` `scripts`, add: `"gen:catalog": "node scripts/gen-catalog.mjs"`. Then:

```bash
pnpm gen:catalog
```
Expected stdout like: `wrote catalog/llms.txt (NN components in 12 categories)` (component count ≥ 86 — sections expand each variant, e.g. HeroA/B/C, so total exceeds 86; categories include the 11 component categories + `sections`).

- [ ] **Step 4: Verify catalog content and exclusions**

```bash
test -f catalog/llms.txt && echo "exists"
grep -q "### Button" catalog/llms.txt && echo "has Button"
grep -q "variant?:" catalog/llms.txt && echo "has Button props (variant)"
grep -q "import { Button } from 'raditz'" catalog/llms.txt && echo "has import line"
grep -qE "### HeroA" catalog/llms.txt && echo "has Hero section variant"
grep -q "import 'raditz/styles.css'" catalog/llms.txt && echo "has styles guidance"
# exclusions — these must be ABSENT:
grep -c "ChartFrame\|MenuSurface" catalog/llms.txt   # expect 0
grep -ci "explorer\|/demos/\|Storybook infra" catalog/llms.txt  # expect 0 (no workshop leakage)
```
Expected: every positive check prints its message; the two exclusion greps print `0`. If `ChartFrame`/`MenuSurface` appear, the public-surface rule drifted from the barrel — fix the `hasStory` gate, not the output.

- [ ] **Step 5: Sanity-check a real prop table by eye**

```bash
awk '/^### Button$/{f=1} f{print} /^Usage:$/{if(f)c++} c==1{exit}' catalog/llms.txt
```
Expected: the Button block shows `variant`, `size`, `href`, `icon`, `iconTrailing`, `children` with types/defaults/descriptions — and NOT dozens of inherited HTML attributes (confirms `propFilter` works). If inherited attrs leak in, the `propFilter` is wrong.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-catalog.mjs catalog/llms.txt package.json pnpm-lock.yaml
git commit -m "feat: generate LLM catalog (catalog/llms.txt) via react-docgen-typescript"
git status --short   # expect clean
```

---

## Task 2: Release preflight + gated `release` skill

**Files:**
- Create: `scripts/release-preflight.mjs`, `.claude/skills/release/SKILL.md`, `CHANGELOG.md`
- Modify: `package.json` (`release:preflight` script)

**Interfaces:**
- Consumes: `pnpm gen:barrel`, `pnpm gen:catalog` (Phase 1 + Task 1), `pnpm build:pkg`, `pnpm test`.
- Produces: a deterministic drift gate (`release:preflight`) and the human-followed `release` skill. The skill is the entry point for Phase 3's promote flow (it ends by invoking `release`).

- [ ] **Step 1: Write the preflight drift guard**

Create `scripts/release-preflight.mjs`:

```js
// Release preflight: regenerate the generated artifacts and fail if that leaves
// uncommitted drift — i.e. the barrel or catalog were stale. This guarantees a
// tagged release ships an in-sync src/index.ts and catalog/llms.txt.
// (The build + test + a11y gate is run separately by the release skill.)
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'pipe' }).toString();

run('pnpm gen:barrel');
run('pnpm gen:catalog');

const tracked = ['src/index.ts', 'catalog/llms.txt'];
const dirty = run(`git status --porcelain ${tracked.join(' ')}`).trim();

if (dirty) {
  console.error('BLOCKED: generated artifacts are out of date. Regenerated and found drift:');
  console.error(dirty);
  console.error('Commit the regenerated files (pnpm gen:barrel && pnpm gen:catalog) before releasing.');
  process.exit(1);
}

console.log('OK: barrel + catalog are up to date.');
```

In `package.json` `scripts`, add: `"release:preflight": "node scripts/release-preflight.mjs"`.

- [ ] **Step 2: Verify the preflight passes clean, then catches drift**

```bash
pnpm release:preflight ; echo "exit=$?"   # expect: OK + exit=0 (artifacts committed in Task 1 / Phase 1)
```
Now prove it BLOCKS on drift — introduce a fake new component dir with a story so the barrel/catalog would change:

```bash
mkdir -p src/components/controls/__ReleaseProbe && \
printf "import type {ReactNode} from 'react';\nexport interface ReleaseProbeProps { label?: string; children?: ReactNode }\nexport function ReleaseProbe({label,children}:ReleaseProbeProps){return <div>{label}{children}</div>}\n" > src/components/controls/__ReleaseProbe/ReleaseProbe.tsx && \
printf "import type {Meta,StoryObj} from '@storybook/react';\nimport {ReleaseProbe} from './ReleaseProbe';\nconst meta={title:'X/ReleaseProbe',component:ReleaseProbe} satisfies Meta;export default meta;type S=StoryObj;export const Default:S={};\n" > src/components/controls/__ReleaseProbe/ReleaseProbe.stories.tsx
pnpm release:preflight ; echo "exit=$?"   # expect: BLOCKED + exit=1 (barrel/catalog now drift)
```
Expected: BLOCKED, `exit=1`, listing `src/index.ts` and `catalog/llms.txt` as modified.

- [ ] **Step 3: Clean up the probe and restore committed artifacts**

```bash
rm -rf src/components/controls/__ReleaseProbe
git checkout -- src/index.ts catalog/llms.txt
pnpm release:preflight ; echo "exit=$?"   # expect: OK + exit=0 again
git status --short                          # expect clean
```
Expected: probe gone, artifacts restored, preflight green, tree clean.

- [ ] **Step 4: Seed the changelog**

Create `CHANGELOG.md`:

```markdown
# Changelog

All notable changes to Raditz are recorded here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); versions are git tags `vX.Y.Z`.

## [Unreleased]

## [0.1.0]
- Packageization foundation: consumable package (src barrel, two-build pipeline,
  vendored Radix colours + self-hosted fonts), generated `catalog/llms.txt`,
  and the gated `release` skill.
```

- [ ] **Step 5: Author the in-repo `release` skill**

Create `.claude/skills/release/SKILL.md`:

```markdown
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
  (`git log $(git describe --tags --abbrev=0)..HEAD --oneline`):
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
`"raditz": "github:tom/raditz#vX.Y.Z"`. Mention they still need to `git push
--follow-tags` (do NOT push automatically unless asked).
```

- [ ] **Step 6: Verify the skill + changelog are well-formed**

```bash
test -f .claude/skills/release/SKILL.md && echo "skill exists"
head -5 .claude/skills/release/SKILL.md   # frontmatter: name: release, description present
grep -q "pnpm release:preflight" .claude/skills/release/SKILL.md && echo "references preflight"
grep -q "pnpm build:pkg" .claude/skills/release/SKILL.md && echo "references build gate"
grep -q "pnpm test" .claude/skills/release/SKILL.md && echo "references test/a11y gate"
test -f CHANGELOG.md && grep -q "0.1.0" CHANGELOG.md && echo "changelog seeded"
```
Expected: every check prints its confirmation.

- [ ] **Step 7: Commit**

```bash
git add scripts/release-preflight.mjs package.json .claude/skills/release/SKILL.md CHANGELOG.md
git commit -m "feat: add release preflight drift gate + gated in-repo release skill"
git status --short   # expect clean
```

---

## Self-Review (against the spec §5/§6)

**Spec coverage:**
- §5 Generated `catalog/llms.txt` (component, prop types, usage snippet; fs-walk codegen like gen-tests) — Task 1. ✔ (Prop extraction via react-docgen-typescript; usage snippet synthesized from props/children + story example names. The product `CLAUDE.md` half of §5 belongs to the starter templates → Phase 3.)
- §6 Release skill (in-repo gated build + `pnpm test` + axe a11y gate; on green commit + tag + append CHANGELOG.md + regenerated catalog) — Task 2. ✔ (axe gate runs inside `pnpm test`; catalog regen enforced by `release:preflight`.)
- Out of scope (correctly deferred): templates, `raditz-new`/`raditz-promote`, `rdz:link`/`unlink`, product `CLAUDE.md` → Phase 3.

**Placeholder scan:** generator and preflight contain complete code; the skill body is complete prose with exact commands; verification steps show exact commands + expected output/exit codes. No TBD. ✔

**Type/name consistency:** `gen:catalog`/`gen-catalog.mjs`, `release:preflight`/`release-preflight.mjs`, `catalog/llms.txt`, `.claude/skills/release/SKILL.md`, `CHANGELOG.md` are used identically across both tasks. The public-surface rule (`hasStory`) matches Phase 1's `gen-barrel.mjs` exactly, so catalog and barrel never disagree — and `release:preflight` enforces that at release time. ✔

## Follow-on

- **Phase 3 — Templates + orchestration:** `templates/next` + `templates/vite`, the `"use client"` codemod, global `raditz-new`/`raditz-promote` skills (promote ends by invoking THIS plan's `release` skill), `rdz:link`/`rdz:unlink`, product `CLAUDE.md` (points consumers at `node_modules/raditz/catalog/llms.txt`). Carry the Phase-1 gotchas: `prepare` needs devDeps at git-install; showroom deploy targets `dist-app/`; add `"use client"` directives (the build already preserves them).
