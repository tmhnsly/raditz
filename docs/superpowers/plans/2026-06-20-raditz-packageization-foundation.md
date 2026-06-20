# Raditz Packageization — Foundation Plan (Phase 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the private Raditz Vite app into a real, framework-neutral, consumable package — importable as a versioned git dependency with correct tokens, vendored colours, self-hosted fonts, a curated public barrel, and a pre-built `dist/` (tree-shakeable ESM + `.d.ts` + one stylesheet).

**Architecture:** Relocate the design-system CSS out of `public/` (un-importable) into `src/styles/`. Replace the two CDN dependencies (jsDelivr Radix colours, Google Fonts) with pnpm-vendored equivalents resolved at build time. Add a generated public barrel (`src/index.ts`) as the single import door. Add a **two-build** package step: a JS/types build (Vite library mode, `preserveModules` for tree-shaking, externalized deps, CSS stripped) and a separate CSS build that compiles tokens + all component/section SCSS into one `dist/raditz.css`. Wire `package.json` as a package (`exports`, `files`, `sideEffects`, `peerDependencies`, `prepare`). Dev/Storybook keep working throughout.

**Tech Stack:** TypeScript (strict), React 18 (peer `>=18`), Vite 6 library mode, `sass`, `vite-plugin-dts`, `rollup-preserve-directives`, `@radix-ui/colors`, `@fontsource-variable/space-grotesk` + `@fontsource/space-mono`, pnpm 10.

## Global Constraints

- **Package manager is pnpm** (`packageManager: pnpm@10.29.2`) — every install/build command uses `pnpm`, never `npm`/`yarn`.
- **Keep `"private": true`.** We never `npm publish`; git deps install regardless of `private`. Removing it adds risk, not value.
- **No runtime CDN dependency.** After this plan, no `cdn.jsdelivr.net` or `fonts.googleapis.com` reference may remain in shipped CSS. Products must work offline.
- **No path aliases, no extensioned relative imports, no asset (png/svg/…) imports in `src/components`, `src/sections`, `src/lib`.** (Verified clean at plan time — a guard step re-checks; do not introduce any.)
- **Token names are immutable.** Vendoring colours must not rename any custom property — components reference semantic aliases (`var(--accent)`, `var(--surface)`); the underlying Radix scale custom-property names from `@radix-ui/colors` are byte-identical to the jsDelivr ones.
- **One stylesheet contract.** The public CSS surface is exactly `raditz/styles.css` (bundled). Do not expose per-token subpaths (YAGNI — add later only if a product needs it).
- **CSS files are the only side-effects** (`"sideEffects": ["**/*.css"]`) so bundlers tree-shake unused components and their heavy deps (visx/date-fns).
- **The build preserves `"use client"` directives**, but *adding* directives to component sources is out of scope here (Plan 3 / Next.js). The Vite consumer used for verification ignores the directive.
- **Dev + Storybook must stay green** after every task (`pnpm dev`, `pnpm storybook`, `pnpm build`, `pnpm test`).

---

## File Structure

**Moved (git mv — preserve history):**
- `public/styles.css` → `src/styles/styles.css` — the `@import` manifest (tokens only; never holds rules).
- `public/tokens/` → `src/styles/tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`, `motion.css`, `layout.css`, `reset.css`, `fonts.css`, `radix-colors.css`. Relative `@import url("tokens/…")` references stay valid because the manifest and `tokens/` move together.

**Created:**
- `src/index.ts` — generated public barrel (the only import door). Re-exports all components, sections, and the curated public `lib` surface. **No** `internal/`, `explorer/`, `demos/`, `pages/`, or `*.stories`.
- `scripts/gen-barrel.mjs` — fs-walk generator that writes `src/index.ts` (mirrors the `gen-tests.mjs` pattern; drift-free by construction).
- `src/styles/bundle.ts` — CSS-build entry: imports the tokens manifest + the component SCSS aggregate + the section styles, so one Vite build emits one stylesheet.
- `vite.lib.ts` — JS + types library build config (preserveModules, externals, ignore-styles, preserve-directives, dts).
- `vite.css.ts` — single-stylesheet build config (`cssCodeSplit: false`, emits `dist/raditz.css`).
- `scripts/check-consumer.mjs` — post-build verification: asserts `dist/index.js`/`dist/index.d.ts`/`dist/raditz.css` exist, a sample component module exists, and no externalized dep (visx/date-fns) is inlined into a leaf component chunk.

**Modified:**
- `index.html` — drop `<link rel="stylesheet" href="/styles.css">` (CSS now imported via JS in dev).
- `src/main.tsx` — import `./styles/styles.css` (tokens manifest) before the component aggregate.
- `.storybook/preview.tsx` — import `../src/styles/styles.css` before the aggregate.
- `.storybook/preview-head.html` — drop the `<link>` to `/styles.css`.
- `.storybook/main.ts` — drop the static-serve-of-`public`-at-root note/behaviour for styles (kept only if it serves other assets — verify).
- `src/styles/tokens/radix-colors.css` — jsDelivr URLs → bare `@radix-ui/colors/*` `@import`s.
- `src/styles/tokens/fonts.css` — Google Fonts `@import` → `@fontsource*` `@import`s.
- `package.json` — name stays `raditz`; add `exports`, `files`, `sideEffects`, `peerDependencies`, `prepare`, `build:lib`/`build:css`/`build:pkg` scripts, `main`/`module`/`types`; move `react`/`react-dom` to `peerDependencies`; add deps (`@radix-ui/colors`, `@fontsource-variable/space-grotesk`, `@fontsource/space-mono`) and devDeps (`vite-plugin-dts`, `rollup-preserve-directives`).

---

## Task 1: Relocate design-system CSS into the package

**Files:**
- Move: `public/styles.css` → `src/styles/styles.css`; `public/tokens/` → `src/styles/tokens/`
- Modify: `src/main.tsx`, `.storybook/preview.tsx`, `index.html`, `.storybook/preview-head.html`, `.storybook/main.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `src/styles/styles.css` (importable tokens manifest), `src/styles/tokens/*`. Later tasks import `./styles/styles.css` and `src/styles/components.ts` together as the full design-system CSS.

- [ ] **Step 1: Move the files with git (preserve history)**

```bash
cd /Users/tom/dev/raditz
git mv public/styles.css src/styles/styles.css
git mv public/tokens src/styles/tokens
ls src/styles/        # expect: bundle.ts (later), components.ts, styles.css, tokens/
ls src/styles/tokens  # expect: colors.css fonts.css layout.css motion.css radius.css radix-colors.css reset.css shadows.css spacing.css typography.css
```

- [ ] **Step 2: Import the tokens manifest via JS in the dev entry**

In `src/main.tsx`, add the manifest import **above** the component aggregate (order: tokens → components):

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css'; // design tokens: Radix scales → fonts → tokens → reset
import './styles/components'; // co-located per-component styles (aggregated)
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 3: Import the tokens manifest in Storybook**

In `.storybook/preview.tsx`, add the manifest import above the aggregate:

```tsx
import '../src/styles/styles.css'; // design tokens
import '../src/styles/components'; // co-located per-component styles (aggregated)
import '../src/sections/sections.css';
```

(Keep the existing `react`/`Preview`/`Decorator` imports at the top.)

- [ ] **Step 4: Remove the now-dead `<link>` tags and static-serve**

- `index.html`: delete the line `    <link rel="stylesheet" href="/styles.css" />`.
- `.storybook/preview-head.html`: delete the line `<link rel="stylesheet" href="/styles.css" />` (if the file is then empty of meaningful content, leave it empty or remove the `staticDirs`/head wiring as appropriate).
- `.storybook/main.ts`: read it; if it serves `public` at root *only* to expose `styles.css`/`tokens`, remove that; if it also serves other static assets, leave those and just drop the styles comment. Run: `grep -n "staticDirs\|public\|styles" .storybook/main.ts` and edit precisely.

- [ ] **Step 5: Verify dev + Storybook + build still render styled**

```bash
pnpm build         # tsc -b && vite build — must succeed (Vite inlines src/styles/styles.css + tokens via JS import)
pnpm dev           # open the printed URL; confirm tokens applied (colours/fonts), then Ctrl-C
pnpm storybook     # confirm a component story is styled, then Ctrl-C
```
Expected: all succeed; no 404 for `/styles.css`; UI is styled (no unstyled flash of raw HTML). The CDN colour/font `@import`s still resolve over the network at this point — that's fixed in Tasks 2–3.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: relocate design-system CSS public/ → src/styles/ (importable from package)"
```

---

## Task 2: Vendor Radix colours (remove the jsDelivr CDN)

**Files:**
- Modify: `src/styles/tokens/radix-colors.css`, `package.json` (dependency)

**Interfaces:**
- Consumes: `src/styles/tokens/radix-colors.css` (relocated in Task 1).
- Produces: a CDN-free `radix-colors.css` whose Radix custom-property names are unchanged, resolvable by Vite via `@radix-ui/colors`.

- [ ] **Step 1: Add the package**

```bash
pnpm add @radix-ui/colors@^3.0.0
```

- [ ] **Step 2: Rewrite the CDN `@import`s to bare package specifiers**

Replace every `@import url("https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/<scale>.css");` line in `src/styles/tokens/radix-colors.css` with `@import "@radix-ui/colors/<scale>.css";`. Vite resolves bare specifiers in CSS `@import` from `node_modules`. Preserve the exact set and order of scales (slate, slate-dark, slate-alpha, … through gray-dark-alpha — every line currently present). Keep all surrounding comments.

Example (first block):

```css
/* 1 — Radix Colors raw scales (must precede anything that aliases them) */
@import "@radix-ui/colors/slate.css";
@import "@radix-ui/colors/slate-dark.css";
@import "@radix-ui/colors/slate-alpha.css";
@import "@radix-ui/colors/slate-dark-alpha.css";
/* …rest of the scales, same names, same order… */
```

- [ ] **Step 3: Verify no jsDelivr reference remains**

```bash
grep -rn "jsdelivr" src/ ; echo "exit=$?"
```
Expected: no matches (grep exit `1` printed as `exit=1`).

- [ ] **Step 4: Verify colours still resolve (build + visual)**

```bash
pnpm build      # Vite must resolve every @radix-ui/colors/*.css import
pnpm dev        # confirm accent/surface/text colours render identically; Ctrl-C
```
Expected: build succeeds; UI colours unchanged (same hues as before — token names are identical).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: vendor Radix colour scales via @radix-ui/colors (drop jsDelivr CDN)"
```

---

## Task 3: Self-host fonts (remove the Google Fonts CDN)

**Files:**
- Modify: `src/styles/tokens/fonts.css`, `package.json` (dependencies)

**Interfaces:**
- Consumes: `src/styles/tokens/fonts.css`.
- Produces: a CDN-free `fonts.css` that loads the same `Space Grotesk` / `Space Mono` families from pnpm-vendored `@fontsource*` packages (Vite copies the woff2 into `dist/assets/` at build).

- [ ] **Step 1: Add the font packages**

```bash
pnpm add @fontsource-variable/space-grotesk @fontsource/space-mono
```
(Space Grotesk ships as a variable font → the `-variable` package covers weights 400–700 in one face; Space Mono is static → import the 400 and 700 weights to match the current `wght@400;700`.)

- [ ] **Step 2: Replace the Google Fonts `@import` with `@fontsource*` imports**

Rewrite `src/styles/tokens/fonts.css`, keeping the family names identical (`Space Grotesk`, `Space Mono`) so nothing downstream changes:

```css
/* ──────────────────────────────────────────────────────────────────────────
   Fonts — Space Grotesk (display) + Space Mono (mono), self-hosted.
   Vendored via @fontsource* (pnpm) → woff2 bundled into dist at build time.
   No runtime CDN dependency; works offline.
   ────────────────────────────────────────────────────────────────────────── */

/* Space Grotesk — variable, covers 400–700 */
@import "@fontsource-variable/space-grotesk";

/* Space Mono — static 400 + 700 */
@import "@fontsource/space-mono/400.css";
@import "@fontsource/space-mono/700.css";
```

- [ ] **Step 3: Confirm the family names @fontsource registers match what tokens use**

```bash
grep -rn "font-family" src/styles/tokens/typography.css | head
# Confirm it references 'Space Grotesk' / 'Space Mono' (the families @fontsource declares).
```
Expected: typography tokens reference `Space Grotesk` / `Space Mono` — the same family names `@fontsource` declares in its `@font-face` rules. If the variable package registers `"Space Grotesk Variable"`, add a local `@font-face`-free alias is unnecessary — instead point typography to the declared family; **verify the exact family string** the package declares: `grep -rn "font-family" node_modules/@fontsource-variable/space-grotesk/*.css | head -1`. If it is `Space Grotesk Variable`, update `typography.css`'s display-font token to that exact string (single, mechanical edit) and note it.

- [ ] **Step 4: Verify no Google Fonts reference remains + fonts render**

```bash
grep -rn "googleapis\|gstatic" src/ ; echo "exit=$?"   # expect no matches (exit=1)
pnpm build
pnpm dev   # confirm headings use Space Grotesk, code uses Space Mono; Ctrl-C
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: self-host fonts via @fontsource (drop Google Fonts CDN)"
```

---

## Task 4: Generate the public barrel (`src/index.ts`)

**Files:**
- Create: `scripts/gen-barrel.mjs`, `src/index.ts` (generated)
- Modify: `package.json` (add `gen:barrel` script)

**Interfaces:**
- Consumes: every `src/components/<cat>/<Name>/index.ts`, every `src/sections/<Name>/index.ts`, and the curated `lib` allowlist.
- Produces: `src/index.ts` re-exporting the full public surface. Later tasks build from this entry. The curated `lib` surface is exactly: `./lib/useColorScheme`, `./lib/ThemePicker`, `./lib/theme`, `./lib/Frame`, `./lib/SectionShell`, `./lib/HeroBleed`.

- [ ] **Step 1: Write the generator (mirrors `gen-tests.mjs`)**

Create `scripts/gen-barrel.mjs`:

```js
// Generates src/index.ts — the public barrel (single import door).
// Walks components/ + sections/ (each dir has an index.ts) and re-exports them,
// plus a curated, hand-maintained lib allowlist. internal/ is never exported.
import fs from 'node:fs';
import path from 'node:path';

const lines = [
  '// AUTO-GENERATED by scripts/gen-barrel.mjs — do not edit by hand.',
  '// Run `pnpm gen:barrel` after adding/removing a component or section.',
  '',
];

// Curated public lib surface (order matters for readability only).
const LIB = [
  './lib/useColorScheme',
  './lib/ThemePicker',
  './lib/theme',
  './lib/Frame',
  './lib/SectionShell',
  './lib/HeroBleed',
];

function collectComponents() {
  const root = 'src/components';
  const out = [];
  for (const cat of fs.readdirSync(root).sort()) {
    const catDir = path.join(root, cat);
    if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (!fs.statSync(dir).isDirectory()) continue;
      if (!fs.existsSync(path.join(dir, 'index.ts'))) continue;
      out.push(`./components/${cat}/${name}`);
    }
  }
  return out;
}

function collectSections() {
  const root = 'src/sections';
  const out = [];
  for (const name of fs.readdirSync(root).sort()) {
    const dir = path.join(root, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (!fs.existsSync(path.join(dir, 'index.ts'))) continue;
    out.push(`./sections/${name}`);
  }
  return out;
}

lines.push('// ── components ──');
for (const p of collectComponents()) lines.push(`export * from '${p}';`);
lines.push('', '// ── sections ──');
for (const p of collectSections()) lines.push(`export * from '${p}';`);
lines.push('', '// ── lib (curated public primitives) ──');
for (const p of LIB) lines.push(`export * from '${p}';`);
lines.push('');

fs.writeFileSync('src/index.ts', lines.join('\n'));
console.log(`wrote src/index.ts (${collectComponents().length} components, ${collectSections().length} sections)`);
```

- [ ] **Step 2: Add the script and run it**

In `package.json` `scripts`, add: `"gen:barrel": "node scripts/gen-barrel.mjs"`. Then:

```bash
pnpm gen:barrel
```
Expected stdout: `wrote src/index.ts (88 components, 18 sections)`.

- [ ] **Step 3: Verify the barrel type-checks and has no internal leakage**

```bash
pnpm exec tsc -b            # barrel must compile against all re-exports
grep -n "internal\|explorer\|demos\|pages\|stories" src/index.ts ; echo "exit=$?"
```
Expected: `tsc` succeeds; grep finds nothing (`exit=1`). If `tsc` reports a name collision (two modules export the same identifier), resolve it by narrowing that one export in `gen-barrel.mjs` to a named re-export and re-run — record the collision in the commit message.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add generated public barrel src/index.ts + gen-barrel script"
```

---

## Task 5: Add the two-build pipeline (JS+types and one stylesheet)

**Files:**
- Create: `vite.lib.ts`, `vite.css.ts`, `src/styles/bundle.ts`
- Modify: `package.json` (devDeps + build scripts)

**Interfaces:**
- Consumes: `src/index.ts` (JS build entry); `src/styles/bundle.ts` (CSS build entry).
- Produces: `dist/index.js` + `dist/**/<module>.js` (preserveModules, tree-shakeable, deps externalized, CSS stripped, directives preserved), `dist/index.d.ts` + per-module `.d.ts`, and `dist/raditz.css` (tokens + all component/section styles, one file, fonts copied to `dist/assets/`).

- [ ] **Step 1: Add build dev-dependencies**

```bash
pnpm add -D vite-plugin-dts rollup-preserve-directives
```

- [ ] **Step 2: Create the CSS-build entry**

Create `src/styles/bundle.ts` (the single CSS entry — imports tokens, component styles, section styles in cascade order):

```ts
// CSS-build entry. Imported only by vite.css.ts to emit one stylesheet.
import './styles.css'; // tokens: Radix scales → fonts → tokens → reset
import './components'; // every component's co-located .scss (aggregated)
import '../sections/sections.css'; // section styles
```

- [ ] **Step 3: Create the single-stylesheet build config**

Create `vite.css.ts`:

```ts
import { defineConfig } from 'vite';

// Builds ONE stylesheet (dist/raditz.css) from src/styles/bundle.ts.
// cssCodeSplit:false guarantees a single file; the throwaway JS chunk is ignored.
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // vite.lib.ts already populated dist/
    cssCodeSplit: false,
    lib: {
      entry: 'src/styles/bundle.ts',
      formats: ['es'],
      fileName: () => '_styles-bundle.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css') ? 'raditz.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
```

- [ ] **Step 4: Create the JS + types build config**

Create `vite.lib.ts`:

```ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

// Empty-module loader: keeps the JS bundle CSS-free (styles ship via dist/raditz.css).
// Component index.ts files do `import './X.scss'`; here those resolve to nothing.
function ignoreStyles() {
  return {
    name: 'raditz-ignore-styles',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.endsWith('.scss') || id.endsWith('.css')) return '\0empty-style:' + id;
      return null;
    },
    load(id: string) {
      if (id.startsWith('\0empty-style:')) return 'export default {}';
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    ignoreStyles(),
    preserveDirectives(),
    dts({ include: ['src'], exclude: ['**/*.stories.tsx', '**/*.test.tsx'], rollupTypes: false }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: { entry: 'src/index.ts', formats: ['es'] },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id.startsWith('react/jsx-runtime') ||
        id.startsWith('@visx/') ||
        id === 'date-fns' ||
        id.startsWith('date-fns/'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
```

- [ ] **Step 5: Add the build scripts**

In `package.json` `scripts`, add (keep existing `build` for the explorer/showroom app):

```json
"build:lib": "vite build --config vite.lib.ts",
"build:css": "vite build --config vite.css.ts",
"build:pkg": "pnpm build:lib && pnpm build:css"
```

- [ ] **Step 6: Run the package build and inspect output**

```bash
pnpm build:pkg
ls dist/index.js dist/index.d.ts dist/raditz.css            # all three must exist
ls dist/components/controls/Button/Button.js               # preserveModules layout
grep -rl "@visx\|date-fns" dist/components/controls/Button/ ; echo "exit=$?"  # Button must NOT inline visx/date-fns (exit=1)
grep -c "cdn.jsdelivr\|googleapis" dist/raditz.css          # expect 0
head -1 dist/raditz.css                                     # sanity: real CSS, not JS
```
Expected: the three artifacts exist; `Button.js` does not reference visx/date-fns (`exit=1`); `dist/raditz.css` has 0 CDN references and contains real CSS (tokens + component rules + `@font-face`); `dist/assets/` holds the woff2 font files.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "build: add two-build package pipeline (tree-shakeable ESM + d.ts + single stylesheet)"
```

---

## Task 6: Wire `package.json` as a package + prove consumption

**Files:**
- Create: `scripts/check-consumer.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `dist/` from Task 5.
- Produces: a package manifest a git-dep consumer resolves correctly (`exports`, `files`, `sideEffects`, `peerDependencies`, `prepare`), and a green consumption check.

- [ ] **Step 1: Update `package.json` manifest fields**

Apply these changes to `package.json` (keep `"private": true`, `"name": "raditz"`, `packageManager`, and the existing `pnpm.onlyBuiltDependencies`):

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": ["**/*.css"],
  "files": ["dist", "catalog"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./styles.css": "./dist/raditz.css"
  },
  "scripts": {
    "prepare": "pnpm build:pkg"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

Concretely:
- Move `react` and `react-dom` out of `dependencies` into `peerDependencies` (`>=18`). Keep them in `devDependencies` for local dev/tests (add `"react": "^18.3.1"`, `"react-dom": "^18.3.1"` under `devDependencies` if not already pulled transitively — they are needed to run Storybook/tests locally).
- Keep `@visx/*`, `date-fns`, `@radix-ui/colors`, `@fontsource-variable/space-grotesk`, `@fontsource/space-mono` in `dependencies` (they are real runtime deps of shipped components/styles).
- Merge the new `scripts` keys with the existing ones (`dev`, `build`, `preview`, `storybook`, `build-storybook`, `test`, `test:watch`, `gen:barrel`, `build:lib`, `build:css`, `build:pkg`). `prepare` runs on install, so a git-dep consumer auto-builds `dist/`.
- `files` lists `catalog` ahead of its creation in Plan 2 — harmless (pnpm ignores a missing entry).

- [ ] **Step 2: Guard — re-verify the clean-source assumptions hold**

```bash
grep -rn "from '@/" src/ ; echo "aliases exit=$?"                                  # expect exit=1
grep -rEn "from '\.\.?/[^']*\.(tsx?|scss|css)'" src/components src/sections src/lib | grep -v "\.scss'" ; echo "ext exit=$?"  # only .scss co-loc imports allowed; expect exit=1
grep -rn "cdn.jsdelivr\|googleapis\|gstatic" src/ dist/raditz.css ; echo "cdn exit=$?"  # expect exit=1
```
Expected: all three `exit=1` (no matches). If any matches, stop and fix before continuing — these are the package's compatibility invariants.

- [ ] **Step 3: Write the consumption check (failing first)**

Create `scripts/check-consumer.mjs`:

```js
// Verifies the built package is consumable: artifacts exist, exports resolve,
// and leaf component chunks don't inline externalized heavy deps.
import fs from 'node:fs';
import { createRequire } from 'node:module';

const must = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };

must(fs.existsSync('dist/index.js'), 'dist/index.js missing — run pnpm build:pkg');
must(fs.existsSync('dist/index.d.ts'), 'dist/index.d.ts missing');
must(fs.existsSync('dist/raditz.css'), 'dist/raditz.css missing');

const css = fs.readFileSync('dist/raditz.css', 'utf8');
must(!/cdn\.jsdelivr|googleapis|gstatic/.test(css), 'CDN reference leaked into dist/raditz.css');
must(/@font-face|--/.test(css), 'dist/raditz.css does not look like real CSS');

// exports map: importing the package entry resolves and yields named exports.
const mod = await import(new URL('../dist/index.js', import.meta.url));
must(typeof mod === 'object' && Object.keys(mod).length > 50, 'barrel exported too few names');

// tree-shaking guard: Button leaf must not inline visx/date-fns.
const btn = 'dist/components/controls/Button/Button.js';
must(fs.existsSync(btn), `${btn} missing (preserveModules layout changed?)`);
must(!/@visx|date-fns/.test(fs.readFileSync(btn, 'utf8')), 'Button.js inlined an externalized dep');

console.log('OK: package is consumable (artifacts, exports, tree-shaking all pass)');
```

Run it against a deliberately stale/missing dist to see it fail first:

```bash
rm -rf dist
node scripts/check-consumer.mjs ; echo "exit=$?"
```
Expected: `FAIL: dist/index.js missing — run pnpm build:pkg` and `exit=1`.

- [ ] **Step 4: Build, then make the check pass**

```bash
pnpm build:pkg
node scripts/check-consumer.mjs ; echo "exit=$?"
```
Expected: `OK: package is consumable …` and `exit=0`.

- [ ] **Step 5: Prove a real external Vite consumer renders**

```bash
# Scratch consumer in a temp dir, installing this repo as a git-dep-equivalent (file: link).
cd /tmp && rm -rf rdz-consume && pnpm create vite@latest rdz-consume --template react-ts && cd rdz-consume
pnpm add "link:/Users/tom/dev/raditz"
```
Then edit `/tmp/rdz-consume/src/main.tsx` to import the stylesheet and `src/App.tsx` to render a Raditz component:

```tsx
// src/main.tsx — add at top
import 'raditz/styles.css';
```
```tsx
// src/App.tsx
import { Button } from 'raditz';
export default function App() {
  return <Button>Hello from Raditz</Button>;
}
```
Then:

```bash
cd /tmp/rdz-consume && pnpm build && pnpm preview   # open URL: styled Button, correct font/colour; Ctrl-C
cd /Users/tom/dev/raditz                            # return to the library repo
```
Expected: the consumer builds and the Button renders styled (tokens + font + colour applied) — proving the package boundary works end to end. (Use the exact public export name from `src/index.ts`; if `Button` isn't the exported identifier, pick any confirmed export.)

- [ ] **Step 6: Verify the library's own dev/test/build are still green**

```bash
pnpm test
pnpm build
```
Expected: tests pass; the app/explorer build succeeds (regression guard — the move/vendor changes didn't break the workshop).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: wire package.json as a package (exports/files/peerDeps/prepare) + consumer check"
```

---

## Self-Review (against the spec)

**Spec coverage (Phase-1 scope):**
- §0 Rename cascade — already complete (prior commits); not in this plan. ✔
- §1 Public barrel — Task 4. ✔
- §2 package.json as a package — Task 6 (exports/files/sideEffects/peerDeps/prepare/main/module/types). ✔
- §3 Styles relocation — Task 1. ✔
- §4 Vendored colours + self-hosted fonts — Tasks 2 & 3. ✔
- §6/§7 build (build-once, framework-agnostic, tree-shaking, `"use client"` *preservation*) — Task 5. ✔ (`"use client"` *adding*, templates, no-flash, `transpilePackages` doc → Plan 3.)
- §5 LLM-consumption layer (catalog/llms.txt, product CLAUDE.md) — **Plan 2/3** (deliberately deferred; noted below). ✔
- §6 flows automation (raditz-new/promote, rdz:link/unlink, release skill) — **Plan 2/3**. ✔

**Open implementation questions resolved here:** exports surface = bundled `styles.css` only (no per-token subpaths); build tool = Vite library mode (already on Vite+sass; native SCSS, dts plugin, directive-preservation plugin); fonts = `@fontsource*` packages (offline, versioned, no manual download). The remaining two open questions (skill config path; `raditz-new` framework inference) belong to Plan 3.

**Placeholder scan:** every code/CSS/JS step contains real content; verification steps show exact commands + expected output/exit codes. No TBD/TODO. ✔

**Type/name consistency:** `build:lib`/`build:css`/`build:pkg`, `gen:barrel`, `src/styles/bundle.ts`, `vite.lib.ts`, `vite.css.ts`, `dist/raditz.css`, `scripts/check-consumer.mjs`, `scripts/gen-barrel.mjs` are used identically across Tasks 4–6. The `ignoreStyles` plugin (Task 5) is what makes the `Button.js`-has-no-visx check (Task 6) and the single-stylesheet contract coexist. ✔

## Follow-on plans (not this document)

- **Plan 2 — LLM-consumption + release gating:** `scripts/gen-catalog.mjs` → `catalog/llms.txt` (props + canonical story snippet per public component), and the in-repo `.claude/skills/release/` skill (build + `pnpm test` + axe a11y gate → commit + tag + `CHANGELOG.md`). Depends on this plan's barrel + build.
- **Plan 3 — Templates + orchestration:** `templates/next` (App Router: `raditz/styles.css` in root layout, ThemeProvider, SSR no-flash script, `transpilePackages`-not-needed note) + `templates/vite`; the `"use client"` codemod over interactive components; global `~/.claude/skills/raditz-new` + `raditz-promote`; `pnpm rdz:link`/`rdz:unlink` overrides; product `CLAUDE.md`. Depends on Plans 1 & 2.
