# Raditz Templates & Orchestration — Plan (Phase 3 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Raditz distribution system: make the built package safe under React Server Components (`"use client"` codemod), let a consuming product define its own accent/token config without editing the library, ship runnable Vite + Next.js product templates (CSS + theme wiring + project theme override + Next no-flash + product `CLAUDE.md` + `rdz:link`/`unlink`), and install the global `raditz-new` / `raditz-promote` orchestration skills.

**Architecture:** A codemod prepends `'use client';` to interactive sources (the build preserves directives; Vite/vitest ignore them). All design tokens are plain CSS custom properties driven by the `--accent-1..12` / `--neutral-1..12` ramps, so a product re-skins by overriding those in a `theme.css` loaded **after** `raditz/styles.css` — and for runtime theming, `useTheme(projectDefaults)` seeds the picker from the project's brand. Two templates under `templates/` are minimal consumers differing only in CSS mounting, theme wiring, project `theme.css`, and (Next) an SSR no-flash script. Global skills live in `~/.claude/skills/` (spoken triggers fire anywhere) but their sources are versioned in `skills/` and installed by `scripts/install-global-skills.mjs`; they locate the library via a self-written `~/.claude/raditz.json`.

**Tech Stack:** Node ESM scripts, TypeScript/React 18, Vite 6, Next.js 15 (App Router), pnpm, in-repo + global Claude Code skills.

## Global Constraints

- Package manager is **pnpm** everywhere; `"private": true`, `name: "raditz"` for the library.
- `"use client"` is **added to sources** but the build must keep working: `pnpm build:pkg`, `pnpm build` (app), and `pnpm test` stay green (Vite/vitest treat the directive as an inert string). The directive must be the **first line** of the module.
- Codemod scope: `src/components/**` + `src/sections/**` (`.tsx`, excluding `*.stories.tsx`/`*.test.tsx`) **plus** `src/lib/ThemePicker.tsx`. Do **NOT** add it to `src/lib/useColorScheme.ts` or `src/lib/theme.ts` — they export server-safe values (`ACCENTS`, `applyTheme`, …) consumed via client components.
- **Project theming (this phase's added requirement):** A consumer must set its own accent/tokens WITHOUT editing the library. The lever is the `--accent-1..12` / `--neutral-1..12` ramps (everything — `--accent`, `--accent-ink`, `--accent-surface`, … — derives; `--accent` = `var(--accent-9)`). Two supported paths, both documented in the templates:
  1. **Static brand (no JS):** override the ramps (or any token) in `src/theme.css`, imported AFTER `raditz/styles.css`. Works for built-in Radix scales and fully custom brand hues. Do NOT also run the runtime picker (its inline styles win).
  2. **Runtime/picker:** `useTheme({ accent: 'iris', … })` seeds the picker from the project brand; persisted user choice still wins. `theme.css` then governs only non-accent tokens.
  `useTheme()` must remain backward-compatible (no-arg = cyan default).
- Theme facts templates must match exactly: dark mode = `useColorScheme()` toggles `class="dark"` on `<html>`, key `rdz-color-scheme` (`'light'`/`'dark'`; absent = OS). Default cyan/slate theme ships in `styles.css`. The Next no-flash script reads `localStorage['rdz-color-scheme']` (explicit wins) else `matchMedia('(prefers-color-scheme: dark)')`.
- Git-dep slug is `github:tmhnsly/raditz#<ref>`; templates carry a placeholder ref `raditz-new` rewrites to the current tag (or default branch when no tag).
- `transpilePackages` is **not** used in the Next template; document why.
- Global skills install to `~/.claude/skills/` from in-repo `skills/` sources; reversible (file copy).
- `dist/`, `dist-app/` stay git-ignored. Commit all in-repo work; clean tree after each task. `~/.claude/` files are outside the repo (not committed) — expected for the skills task.

## File Structure

**Created (in-repo):**
- `scripts/add-use-client.mjs` — idempotent `"use client"` codemod.
- `src/lib/theme.test.tsx` — tests `useTheme` project-default behaviour.
- `templates/vite/` — `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/ThemeRuntime.tsx`, `src/theme.css`, `scripts/rdz-link.mjs`, `CLAUDE.md`, `.gitignore`.
- `templates/next/` — `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/theme-runtime.tsx`, `app/page.tsx`, `app/theme.css`, `scripts/rdz-link.mjs`, `CLAUDE.md`, `.gitignore`.
- `skills/raditz-new/SKILL.md`, `skills/raditz-promote/SKILL.md` — versioned global-skill sources.
- `scripts/install-global-skills.mjs` — installs `skills/*` into `~/.claude/skills/`.

**Modified:**
- ~48 sources under `src/components`/`src/sections` + `src/lib/ThemePicker.tsx` — gain `'use client';`.
- `src/lib/theme.ts` — `useTheme` accepts `ThemeDefaults`.
- `package.json` — add scripts `codemod:use-client`, `rdz:install-skills`.

---

## Task 1: `"use client"` codemod

**Files:**
- Create: `scripts/add-use-client.mjs`
- Modify: ~48 `.tsx` sources (by running the script), `package.json` (script)

**Interfaces:**
- Consumes: `src/components/**`, `src/sections/**`, `src/lib/ThemePicker.tsx`.
- Produces: client-marked sources; `vite.lib.ts` + `rollup-preserve-directives` carry the directive into `dist/**`; the Next template relies on it.

- [ ] **Step 1: Write the codemod**

Create `scripts/add-use-client.mjs`:

```js
// Prepends 'use client'; to component/section sources that use client-only React
// features, so the built package works under React Server Components (Next App
// Router). Vite + vitest treat the directive as an inert string. Idempotent.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src/components', 'src/sections'];
const EXTRA = ['src/lib/ThemePicker.tsx'];

// A module must run on the client if it uses hooks, JSX event handlers, or browser globals.
const CLIENT_RE =
  /\b(useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|useId|useImperativeHandle|useSyncExternalStore|useTransition|useDeferredValue|useMemo|useCallback|useInsertionEffect)\b|\bon[A-Z][A-Za-z]*=|\b(document|window|localStorage|sessionStorage|navigator|matchMedia|requestAnimationFrame|IntersectionObserver|ResizeObserver)\b/;

const DIRECTIVE = "'use client';";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.tsx') && !e.name.endsWith('.stories.tsx') && !e.name.endsWith('.test.tsx')) out.push(p);
  }
  return out;
}

function alreadyDirective(src) {
  const firstCode = src.replace(/^﻿/, '').trimStart();
  return /^['"]use client['"];?/.test(firstCode);
}

const files = [...ROOTS.flatMap((r) => walk(r)), ...EXTRA.filter((f) => fs.existsSync(f))];
let added = 0;
const changed = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!CLIENT_RE.test(src)) continue;       // static → leave as a server component
  if (alreadyDirective(src)) continue;      // idempotent
  fs.writeFileSync(file, `${DIRECTIVE}\n${src}`);
  added++;
  changed.push(file);
}
console.log(`add-use-client: marked ${added} file(s) as client (of ${files.length} scanned).`);
for (const c of changed.sort()) console.log(`  + ${c}`);
```

- [ ] **Step 2: Add the script and run it**

In `package.json` `scripts`, add `"codemod:use-client": "node scripts/add-use-client.mjs"`. Then:

```bash
cd /Users/tom/dev/raditz
pnpm codemod:use-client
```
Expected: `add-use-client: marked ~47-48 file(s) as client (of 109 scanned).`

- [ ] **Step 3: Verify the split (interactive marked, static not)**

```bash
f=$(grep -rl "useState" src/components --include='*.tsx' | grep -v stories | grep -v test | head -1)
echo "interactive sample: $f"; head -1 "$f"     # expect: 'use client';
head -1 src/sections/Hero/Hero.tsx              # expect: NOT 'use client';
head -1 src/lib/ThemePicker.tsx                 # expect: 'use client';
pnpm codemod:use-client                          # expect: marked 0 file(s)
```

- [ ] **Step 4: Verify build carries the directive and nothing breaks**

```bash
pnpm build:pkg
node scripts/check-consumer.mjs                  # expect: OK
grep -rl "use client" dist/components | head -3  # expect non-empty
grep -L "use client" dist/sections/Hero/Hero.js 2>/dev/null && echo "Hero dist server-ok"
pnpm test                                         # expect: 377 passed
pnpm build                                         # app → dist-app/, green
```

- [ ] **Step 5: Commit**

```bash
git add scripts/add-use-client.mjs package.json src/components src/sections src/lib/ThemePicker.tsx
git commit -m "feat: add use-client codemod + mark interactive components for RSC"
git status --short
```

---

## Task 2: Project theme configuration (`useTheme` project defaults)

**Files:**
- Modify: `src/lib/theme.ts`
- Create: `src/lib/theme.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `useTheme(projectDefaults?: ThemeDefaults)` and the exported `ThemeDefaults` type (re-exported through the barrel). Templates' `theme.css` + `CLAUDE.md` (Tasks 3/4) document the static-brand path; this enables the runtime-picker brand baseline.

- [ ] **Step 1: Write the failing test**

Create `src/lib/theme.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from './theme';

const accent9 = () => document.documentElement.style.getPropertyValue('--accent-9');

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('style');
});

describe('useTheme project defaults', () => {
  it('applies the cyan default with no project default and nothing persisted', () => {
    renderHook(() => useTheme());
    expect(accent9()).toBe('var(--cyan-9)');
  });

  it('applies a project default accent when nothing is persisted', () => {
    renderHook(() => useTheme({ accent: 'iris' }));
    expect(accent9()).toBe('var(--iris-9)');
  });

  it('persisted user choice wins over the project default', () => {
    localStorage.setItem('rdz-theme', JSON.stringify({ accent: 'jade', gray: 'auto', radius: 'default', motion: 'smooth' }));
    renderHook(() => useTheme({ accent: 'iris' }));
    expect(accent9()).toBe('var(--jade-9)');
  });
});
```

- [ ] **Step 2: Run it — expect failure**

```bash
pnpm exec vitest run src/lib/theme.test.tsx
```
Expected: FAIL — the project-default test gets `var(--cyan-9)` (current `useTheme` ignores arguments).

- [ ] **Step 3: Implement project defaults in `theme.ts`**

In `src/lib/theme.ts`, export a public defaults type and thread it through `load` + `useTheme`. Replace the existing `load()` and `useTheme()`:

```ts
/** Project-level theme baseline a consuming product can pass to useTheme(). */
export type ThemeDefaults = {
  accent?: Accent;
  gray?: GrayChoice;
  radius?: RadiusChoice;
  motion?: MotionChoice;
};

function load(projectDefaults?: ThemeDefaults): ThemeState {
  const base: ThemeState = { ...DEFAULTS, ...projectDefaults };
  if (typeof localStorage !== 'undefined') {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '');
      if (v && ACCENTS.includes(v.accent)) {
        return {
          accent: v.accent,
          gray: v.gray ?? base.gray,
          radius: RADII.includes(v.radius) ? v.radius : base.radius,
          motion: MOTIONS.includes(v.motion) ? v.motion : base.motion,
        };
      }
    } catch { /* ignore */ }
  }
  return base;
}

/** App-wide theme: pick an accent, gray (or 'auto'), corner radius, and motion
 * feel. Applies to <html> and persists to localStorage. A product may pass its
 * brand baseline via `projectDefaults` (used until the user picks something). */
export function useTheme(projectDefaults?: ThemeDefaults) {
  const [state, setState] = useState<ThemeState>(() => load(projectDefaults));
  useEffect(() => {
    applyTheme(state.accent, state.gray, state.radius, state.motion);
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);
  return {
    accent: state.accent,
    gray: state.gray,
    radius: state.radius,
    motion: state.motion,
    setAccent: (accent: Accent) => setState((s) => ({ ...s, accent })),
    setGray: (gray: GrayChoice) => setState((s) => ({ ...s, gray })),
    setRadius: (radius: RadiusChoice) => setState((s) => ({ ...s, radius })),
    setMotion: (motion: MotionChoice) => setState((s) => ({ ...s, motion })),
    reset: () => setState({ ...DEFAULTS, ...projectDefaults }),
  };
}
```
(Leave `ThemeState`, `DEFAULTS`, `KEY`, `applyTheme` as they are. Note `reset()` now returns to the project baseline, not bare cyan.)

- [ ] **Step 4: Run the test — expect pass**

```bash
pnpm exec vitest run src/lib/theme.test.tsx   # expect: 3 passed
```

- [ ] **Step 5: Verify the barrel/catalog/build still hold**

```bash
pnpm gen:barrel && pnpm gen:catalog            # ThemeDefaults now in the public surface
pnpm release:preflight                          # OK (commit regenerated artifacts if it reports drift)
grep -q "ThemeDefaults" catalog/llms.txt && echo "ThemeDefaults documented"
pnpm exec tsc -b                                # types clean
pnpm test                                        # full suite green (now 380 with the 3 new)
```
If `release:preflight` reports drift, the catalog gained the `ThemeDefaults` export — that is expected; include the regenerated `catalog/llms.txt` (and `src/index.ts` if changed) in this task's commit.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.tsx catalog/llms.txt src/index.ts
git commit -m "feat: useTheme accepts project brand defaults (ThemeDefaults)"
git status --short
```

---

## Task 3: Vite product template (with project theme.css)

**Files:**
- Create: `templates/vite/{package.json,vite.config.ts,tsconfig.json,index.html,.gitignore,CLAUDE.md}`, `templates/vite/src/{main.tsx,App.tsx,ThemeRuntime.tsx,theme.css}`, `templates/vite/scripts/rdz-link.mjs`

**Interfaces:**
- Consumes: built `raditz` (`raditz` + `raditz/styles.css`), `useColorScheme`, `Button`.
- Produces: a copyable Vite scaffold with a project `theme.css` override hook. `raditz-new` (Task 5) copies it; `rdz:link` repoints to a local checkout.

- [ ] **Step 1: package.json + link script**

Create `templates/vite/package.json`:

```json
{
  "name": "raditz-vite-app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "rdz:link": "node scripts/rdz-link.mjs link",
    "rdz:unlink": "node scripts/rdz-link.mjs unlink"
  },
  "dependencies": {
    "raditz": "github:tmhnsly/raditz#REPLACE_WITH_TAG",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.5"
  }
}
```

Create `templates/vite/scripts/rdz-link.mjs`:

```js
// Toggle a pnpm override pointing `raditz` at a local library checkout for live
// fixes (the "link" flow). Usage: node scripts/rdz-link.mjs link|unlink
// RADITZ_PATH overrides the default sibling path ../raditz.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const mode = process.argv[2];
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.pnpm ||= {};
pkg.pnpm.overrides ||= {};

if (mode === 'link') {
  const target = process.env.RADITZ_PATH || '../raditz';
  pkg.pnpm.overrides.raditz = `link:${target}`;
  console.log(`Linked raditz → ${target}. Rebuild the library (pnpm build:pkg) to propagate edits.`);
} else if (mode === 'unlink') {
  delete pkg.pnpm.overrides.raditz;
  if (Object.keys(pkg.pnpm.overrides).length === 0) delete pkg.pnpm.overrides;
  console.log('Unlinked raditz → restored the pinned git dependency.');
} else {
  console.error('usage: node scripts/rdz-link.mjs link|unlink');
  process.exit(1);
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
execSync('pnpm install', { stdio: 'inherit' });
```

- [ ] **Step 2: config + entry files**

Create `templates/vite/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()] });
```

Create `templates/vite/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

Create `templates/vite/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Raditz Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `templates/vite/src/ThemeRuntime.tsx`:

```tsx
import { useColorScheme } from 'raditz';

// Applies dark mode (class="dark" on <html>) following OS + persisted choice.
// To also use the live accent picker with YOUR brand as the baseline, call
// useTheme({ accent: 'iris' }) here too (import it from 'raditz').
export function ThemeRuntime() {
  useColorScheme();
  return null;
}
```

Create `templates/vite/src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `templates/vite/src/App.tsx`:

```tsx
import { Button } from 'raditz';
import { ThemeRuntime } from './ThemeRuntime';

export default function App() {
  return (
    <>
      <ThemeRuntime />
      <main style={{ padding: '2rem' }}>
        <Button>Hello from Raditz</Button>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Project theme override file**

Create `templates/vite/src/theme.css`:

```css
/* ─────────────────────────────────────────────────────────────────────────
   Project theme — set YOUR brand here. Imported AFTER raditz/styles.css, so
   these win. Everything (--accent, --accent-ink, --accent-surface, buttons,
   links, focus rings…) derives from the --accent-1..12 ramp; --accent = step 9.

   Option A — use a built-in Radix accent (auto light/dark, nothing else needed):
     :root {
       --accent-1: var(--iris-1);  --accent-2: var(--iris-2);  --accent-3: var(--iris-3);
       --accent-4: var(--iris-4);  --accent-5: var(--iris-5);  --accent-6: var(--iris-6);
       --accent-7: var(--iris-7);  --accent-8: var(--iris-8);  --accent-9: var(--iris-9);
       --accent-10: var(--iris-10); --accent-11: var(--iris-11); --accent-12: var(--iris-12);
     }

   Option B — a fully custom brand hue. Provide 12 steps for light AND dark
   (custom colours don't auto-flip like Radix scales do):
     :root {
       --accent-1:#f6f8ff; --accent-2:#eef2ff; --accent-3:#e0e8ff; --accent-4:#cdd9ff;
       --accent-5:#b7c6ff; --accent-6:#9db0fb; --accent-7:#7e94f2; --accent-8:#586fe6;
       --accent-9:#3b53d9; --accent-10:#3349c4; --accent-11:#3f56d6; --accent-12:#1b2147;
       --on-accent: var(--white-a12); /* text drawn on the accent fill (use --black-a12 for light brands) */
     }
     .dark {
       --accent-1:#0e1430; --accent-2:#141b3d; ... --accent-12:#dbe2ff;
     }

   You can override ANY token here too: --radius-factor, --font-display, spacing, etc.
   NOTE: if you mount the runtime picker (useTheme), it writes the accent ramp as
   inline styles that beat this file — set the brand via useTheme({ accent: … })
   instead and keep this file for non-accent tokens.
   ───────────────────────────────────────────────────────────────────────── */

/* Default: inherit Raditz's cyan brand. Replace with Option A or B above. */
```

- [ ] **Step 4: Product CLAUDE.md + gitignore**

Create `templates/vite/.gitignore`:

```
node_modules
dist
```

Create `templates/vite/CLAUDE.md`:

```markdown
# Working in this product

This app consumes **Raditz**, a pre-built design-system package. Treat it as a
read-only dependency.

## Rules
- **Never edit `node_modules/raditz`.** It is built output; edits are wiped on install.
- **Never re-implement a component that exists in Raditz.** Import it:
  `import { Button, HeroA } from 'raditz'`. The stylesheet is imported once in
  `src/main.tsx`: `import 'raditz/styles.css'`.
- **Discover components** in `node_modules/raditz/catalog/llms.txt`.
- Dark mode is wired in `src/ThemeRuntime.tsx` (`useColorScheme`).

## Brand / theming
- This project's tokens live in `src/theme.css` (imported AFTER `raditz/styles.css`).
  Set your accent by repointing the `--accent-1..12` ramp (built-in Radix scale or a
  custom hue) — everything derives from it. Override any other token there too.
- For a live theme picker that starts from your brand, call
  `useTheme({ accent: 'iris' })` from a client component (see `ThemeRuntime.tsx`).
  Do not use both the picker AND a CSS accent override — the picker's inline styles win.

## Changing Raditz itself
Do it in the library repo, not here:
- A brand-new reusable component → the **raditz-promote** workflow.
- A fix to an existing component → `pnpm rdz:link`, fix in the library, cut a
  release, then `pnpm rdz:unlink`.
```

- [ ] **Step 5: Verify the template builds against the real package (via link, offline) incl. theme.css**

```bash
pnpm build:pkg
rm -rf /tmp/rdz-vite && cp -r templates/vite /tmp/rdz-vite && cd /tmp/rdz-vite
# set a real brand override to prove theme.css wins:
printf ':root{--accent-9: var(--iris-9);}\n' >> src/theme.css
RADITZ_PATH=/Users/tom/dev/raditz node scripts/rdz-link.mjs link
pnpm build
ls dist/index.html && echo "vite template builds"
grep -rl "rdz-btn" dist/assets/*.css >/dev/null && echo "raditz styles bundled"
grep -rl "iris-9" dist/assets/*.css >/dev/null && echo "project theme.css override bundled after styles"
cd /Users/tom/dev/raditz && rm -rf /tmp/rdz-vite
```
Expected: builds; `.rdz-btn` styles present; the `iris-9` override is present in the consumer CSS — proving the project theme override path works.

- [ ] **Step 6: Commit**

```bash
git add templates/vite
git commit -m "feat: add Vite product template (raditz consumer + theme wiring + project theme.css + rdz:link)"
git status --short
```

---

## Task 4: Next.js App Router product template (with project theme.css)

**Files:**
- Create: `templates/next/{package.json,next.config.ts,tsconfig.json,.gitignore,CLAUDE.md}`, `templates/next/app/{layout.tsx,theme-runtime.tsx,page.tsx,theme.css}`, `templates/next/scripts/rdz-link.mjs`

**Interfaces:**
- Consumes: built `raditz` (`raditz` + `raditz/styles.css`), `useColorScheme`, `Button`.
- Produces: a Next App Router scaffold with SSR no-flash + project `theme.css`. `raditz-new` copies it.

- [ ] **Step 1: package.json + link script**

Create `templates/next/package.json`:

```json
{
  "name": "raditz-next-app",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "rdz:link": "node scripts/rdz-link.mjs link",
    "rdz:unlink": "node scripts/rdz-link.mjs unlink"
  },
  "dependencies": {
    "next": "^15.0.0",
    "raditz": "github:tmhnsly/raditz#REPLACE_WITH_TAG",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.3"
  }
}
```

Create `templates/next/scripts/rdz-link.mjs`:

```js
// Toggle a pnpm override pointing `raditz` at a local library checkout for live
// fixes (the "link" flow). Usage: node scripts/rdz-link.mjs link|unlink
// RADITZ_PATH overrides the default sibling path ../raditz.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const mode = process.argv[2];
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.pnpm ||= {};
pkg.pnpm.overrides ||= {};

if (mode === 'link') {
  const target = process.env.RADITZ_PATH || '../raditz';
  pkg.pnpm.overrides.raditz = `link:${target}`;
  console.log(`Linked raditz → ${target}. Rebuild the library (pnpm build:pkg) to propagate edits.`);
} else if (mode === 'unlink') {
  delete pkg.pnpm.overrides.raditz;
  if (Object.keys(pkg.pnpm.overrides).length === 0) delete pkg.pnpm.overrides;
  console.log('Unlinked raditz → restored the pinned git dependency.');
} else {
  console.error('usage: node scripts/rdz-link.mjs link|unlink');
  process.exit(1);
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
execSync('pnpm install', { stdio: 'inherit' });
```

- [ ] **Step 2: next.config + tsconfig**

Create `templates/next/next.config.ts`:

```ts
import type { NextConfig } from 'next';

// NOTE: `transpilePackages: ['raditz']` is intentionally NOT set. Raditz ships
// pre-built ESM + types + one CSS file in dist/, so Next consumes it directly.
const nextConfig: NextConfig = {};

export default nextConfig;
```

Create `templates/next/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Root layout with SSR no-flash, client theme runtime, project theme.css**

Create `templates/next/app/theme.css`:

```css
/* ─────────────────────────────────────────────────────────────────────────
   Project theme — set YOUR brand here. Imported AFTER raditz/styles.css in
   app/layout.tsx, so these win. Everything derives from --accent-1..12
   (--accent = step 9).

   Built-in Radix accent (auto light/dark):
     :root { --accent-1: var(--iris-1); … --accent-12: var(--iris-12); }
   Custom brand hue — provide 12 steps for :root AND .dark, and set --on-accent.
   Override any other token here too (--radius-factor, --font-display, …).
   NOTE: the runtime picker (useTheme) writes inline accent styles that beat
   this file — for picker + brand, use useTheme({ accent: … }) instead.
   ───────────────────────────────────────────────────────────────────────── */

/* Default: inherit Raditz's cyan brand. Replace with your accent above. */
```

Create `templates/next/app/theme-runtime.tsx`:

```tsx
'use client';
import { useColorScheme } from 'raditz';

// Applies dark mode after hydration (the inline script in layout handles first paint).
// For the live accent picker with your brand baseline, also call useTheme({ accent: … }).
export function ThemeRuntime() {
  useColorScheme();
  return null;
}
```

Create `templates/next/app/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import { ThemeRuntime } from './theme-runtime';

// Pre-paint: set class="dark" before first paint to avoid a light→dark flash.
// Mirrors useColorScheme exactly: explicit localStorage value wins, else OS.
const noFlash = `(function(){try{var k='rdz-color-scheme',v=localStorage.getItem(k);` +
  `var d=v==='dark'||(v!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);` +
  `if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        <ThemeRuntime />
        {children}
      </body>
    </html>
  );
}
```

Create `templates/next/app/page.tsx`:

```tsx
import { Button } from 'raditz';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <Button>Hello from Raditz</Button>
    </main>
  );
}
```

- [ ] **Step 4: Product CLAUDE.md + gitignore**

Create `templates/next/.gitignore`:

```
node_modules
.next
```

Create `templates/next/CLAUDE.md`:

```markdown
# Working in this product

This app consumes **Raditz**, a pre-built design-system package. Treat it as a
read-only dependency.

## Rules
- **Never edit `node_modules/raditz`.** Built output; edits are wiped on install.
- **Never re-implement a component that exists in Raditz.** Import it:
  `import { Button, HeroA } from 'raditz'`. The stylesheet is imported once in
  `app/layout.tsx` (App Router allows global CSS only in the root layout).
- **Discover components** in `node_modules/raditz/catalog/llms.txt`.
- Interactive Raditz components carry `"use client"`, so they work in Server
  Components. Dark mode: the inline no-flash script in `app/layout.tsx` sets the
  theme before paint; `app/theme-runtime.tsx` keeps it in sync.
- `transpilePackages` is NOT needed — Raditz ships built output.

## Brand / theming
- This project's tokens live in `app/theme.css` (imported AFTER `raditz/styles.css`).
  Set your accent by repointing `--accent-1..12` (a Radix scale or a custom hue);
  everything derives from it. Override any other token there too.
- For a live picker starting from your brand, call `useTheme({ accent: 'iris' })`
  in a client component. Don't combine the picker with a CSS accent override.

## Changing Raditz itself
- New reusable component → the **raditz-promote** workflow.
- Fix an existing component → `pnpm rdz:link`, fix in the library, release, `pnpm rdz:unlink`.
```

- [ ] **Step 5: Verify structurally (and build if Next installs)**

```bash
grep -q "import 'raditz/styles.css'" templates/next/app/layout.tsx && echo "css in root layout"
grep -q "import './theme.css'" templates/next/app/layout.tsx && echo "project theme.css imported after styles"
grep -q "suppressHydrationWarning" templates/next/app/layout.tsx && echo "no-flash hydration guard"
grep -q "rdz-color-scheme" templates/next/app/layout.tsx && echo "no-flash reads correct storage key"
head -1 templates/next/app/theme-runtime.tsx | grep -q "use client" && echo "theme-runtime is a client component"
grep -q "transpilePackages" templates/next/next.config.ts && echo "FAIL: transpilePackages present" || echo "no transpilePackages (correct)"

pnpm build:pkg
rm -rf /tmp/rdz-next && cp -r templates/next /tmp/rdz-next && cd /tmp/rdz-next
RADITZ_PATH=/Users/tom/dev/raditz node scripts/rdz-link.mjs link || echo "install skipped (offline)"
if [ -d node_modules/next ]; then pnpm build && echo "next template builds"; else echo "SKIPPED next build (offline); structural checks stand"; fi
cd /Users/tom/dev/raditz && rm -rf /tmp/rdz-next
```
Expected: all structural checks pass; the Next build succeeds or is honestly reported skipped (directive preservation from Task 1 + the Vite consumer proof from Task 3 cover the mechanics).

- [ ] **Step 6: Commit**

```bash
git add templates/next
git commit -m "feat: add Next.js App Router template (CSS+theme.css in layout + SSR no-flash + rdz:link)"
git status --short
```

---

## Task 5: Global orchestration skills (`raditz-new`, `raditz-promote`)

**Files:**
- Create: `skills/raditz-new/SKILL.md`, `skills/raditz-promote/SKILL.md`, `scripts/install-global-skills.mjs`
- Modify: `package.json` (`rdz:install-skills`)
- Side effect (outside repo): `~/.claude/skills/raditz-new/`, `~/.claude/skills/raditz-promote/`

**Interfaces:**
- Consumes: `templates/` (Tasks 3/4), the in-repo `release` skill (Phase 2), `scripts/add-use-client.mjs` (Task 1), `gen:barrel`/`gen:catalog`.
- Produces: spoken-trigger automation available anywhere; `~/.claude/raditz.json` config (self-written first run).

- [ ] **Step 1: Author `skills/raditz-new/SKILL.md`**

```markdown
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
```

- [ ] **Step 2: Author `skills/raditz-promote/SKILL.md`**

```markdown
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
`github:OWNER/REPO#<newTag>` to receive the component.
```

- [ ] **Step 3: Write the installer**

Create `scripts/install-global-skills.mjs`:

```js
// Installs versioned global-skill sources (skills/*) into ~/.claude/skills/ so
// their spoken triggers fire from any directory. Re-runnable (overwrites).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const src = 'skills';
const dest = path.join(os.homedir(), '.claude', 'skills');
const names = fs.readdirSync(src).filter((n) => fs.statSync(path.join(src, n)).isDirectory());

for (const name of names) {
  const from = path.join(src, name);
  const to = path.join(dest, name);
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) fs.copyFileSync(path.join(from, file), path.join(to, file));
  console.log(`installed ${name} → ${to}`);
}
console.log(`Done. ${names.length} global skill(s) installed to ${dest}.`);
```

In `package.json` `scripts`, add `"rdz:install-skills": "node scripts/install-global-skills.mjs"`.

- [ ] **Step 4: Install and verify**

```bash
pnpm rdz:install-skills
head -4 skills/raditz-new/SKILL.md
head -4 skills/raditz-promote/SKILL.md
grep -q "templates/" skills/raditz-new/SKILL.md && echo "raditz-new references templates"
grep -q "release" skills/raditz-promote/SKILL.md && echo "raditz-promote chains to release"
grep -q "raditz.json" skills/raditz-new/SKILL.md && echo "config mechanism documented"
test -f ~/.claude/skills/raditz-new/SKILL.md && echo "raditz-new installed"
test -f ~/.claude/skills/raditz-promote/SKILL.md && echo "raditz-promote installed"
```
Expected: every check prints its confirmation. (Skills can't be executed in a test — verification is structural + install; real exercise is a future spoken trigger.)

- [ ] **Step 5: Commit**

```bash
git add skills scripts/install-global-skills.mjs package.json
git commit -m "feat: add global raditz-new + raditz-promote skills with installer"
git status --short   # ~/.claude/skills/ is outside the repo — not in this commit (expected)
```

---

## Self-Review (against the spec §5/§6/§7 + the project-theming requirement)

**Spec coverage:**
- §7 `"use client"` (interactive marked, static stays RSC, build preserves) — Task 1. ✔
- **Project theming** (consumer defines its own accent/tokens without editing the library): static path via `theme.css` (Tasks 3/4) + runtime path via `useTheme(projectDefaults)` (Task 2). ✔
- §7 CSS placement + SSR no-flash + no `transpilePackages` — Tasks 3 & 4. ✔
- §6 Consume/bootstrap (`raditz-new`) — Task 5 + bundled `CLAUDE.md`. ✔
- §6 Grow/promote (`raditz-promote` → `release`) — Task 5. ✔
- §6 Fix/link (`rdz:link`/`unlink`) — Tasks 3 & 4. ✔
- §5 product `CLAUDE.md` (read-only rules + catalog pointer + theming) — bundled in both templates. ✔
- Open questions resolved: skill config = self-written `~/.claude/raditz.json`; framework inference = detect keyword, default Next.

**Placeholder scan:** all scripts/config/markdown complete; verification gives exact commands + expected output. The only literal placeholder is the templates' `REPLACE_WITH_TAG`, deterministically rewritten by `raditz-new` Step 4 — by design. ✔

**Type/name consistency:** `codemod:use-client`/`add-use-client.mjs`, `useTheme`/`ThemeDefaults`, `rdz:link`/`rdz-link.mjs`, `rdz:install-skills`/`install-global-skills.mjs`, `skills/raditz-new`/`raditz-promote`, `~/.claude/raditz.json`, key `rdz-color-scheme`, slug `tmhnsly/raditz`, `theme.css` import-after-styles are consistent across tasks. `raditz-promote` references the real Phase-2 `release` skill + Task-1 `codemod:use-client`. ✔

**Verification honesty:** Task 4's Next build and Task 5's skill execution can't be fully exercised offline; the plan states this and falls back to structural checks + the directive proof (Task 1) and the Vite consumer + theme-override proof (Task 3). ✔

## Done = Phase 3 complete → whole distribution system built
The three flows then work — **consume** (`raditz-new`), **grow** (`raditz-promote` → `release`), **fix** (`rdz:link`/`unlink`) — and a product can brand itself via `theme.css` or `useTheme({accent})`. Recommended real-world follow-up (out of scope): run `/release` to cut `v0.1.0` and `git push --follow-tags`, so `raditz-new` pins a tag.
