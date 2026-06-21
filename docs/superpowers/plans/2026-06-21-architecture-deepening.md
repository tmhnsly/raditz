# Architecture Deepening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn four shallow/duplicated areas into deep modules — the codegen *source-surface*, one *Section-action* renderer, a shared *Section-header*, and collapsed section clones — improving locality, leverage, and testability without changing any behaviour.

**Architecture:** Behaviour-preserving refactors. The library is already deep at its core (Overlay, Menu-surface, Table-model…); these target friction in the codegen scripts and the recently-grown section-content layer. Every refactor is gated by the existing 478-test suite + `release:preflight` drift gate + `build:pkg`/`check-consumer` — generated artifacts and rendered output must stay byte-identical except where a deepening intentionally fixes a latent bug.

**Tech Stack:** Node ESM scripts, TypeScript/React 18, Vitest, pnpm. Architecture vocabulary per the `improve-codebase-architecture` LANGUAGE.md; domain vocabulary per `CONTEXT.md`.

## Global Constraints

- Package manager is **pnpm**. These are **refactors — no behaviour change**: `pnpm test` stays green (478), `pnpm release:preflight` stays OK (generated `src/index.ts`/`catalog/llms.txt` unchanged unless a task adds a public export), `pnpm build:pkg && node scripts/check-consumer.mjs` stay green, `pnpm exec tsc -b` clean.
- **The deletion test governs**: a deepened module must concentrate complexity, not move it. If a sub-part only moves a trivial idiom, decline it and record an ADR (see Task 3).
- New deepened modules get named in `CONTEXT.md` (Task 5) using domain vocabulary; new public exports flow through `gen:barrel`/`gen:catalog`.
- jest-dom is NOT installed — native assertions only.
- Commit per task; clean tree after each.

## File Structure

- `scripts/public-surface.mjs` — deepened into the **source-surface** module (walk + predicate + resolved file paths). Consumed by `gen-barrel.mjs`, `gen-catalog.mjs`, `gen-tests.mjs`. `gen-section-tests.mjs` is **deleted** (merged into `gen-tests.mjs`).
- `scripts/public-surface.test.mjs` (or a vitest spec) — tests the source-surface.
- `src/lib/SectionShell.tsx` — gains `SectionActionButton` (Task 2) and `SectionHeader` (Task 3).
- `src/sections/**` — inline action sites → `SectionActionButton`; header blocks → `SectionHeader`; clones collapsed (Task 4).
- `docs/adr/0001-section-body-override-stays-in-variant.md` — ADR (Task 3).
- `CONTEXT.md` — names the new modules (Task 5).

---

## Task 1: Deepen `public-surface.mjs` into the source-surface module

**Files:** `scripts/public-surface.mjs` (deepen), `scripts/gen-barrel.mjs`, `scripts/gen-catalog.mjs`, `scripts/gen-tests.mjs` (consume), `scripts/gen-section-tests.mjs` (delete), `scripts/public-surface.test.mjs` (new test).

**Interfaces — Produces:**
- `export const LIB` (unchanged — the curated lib allowlist).
- `export function sourceSurface(): { components: Entry[]; sections: Entry[] }` where
  `Entry = { category: string | null; name: string; dir: string; componentFile: string; storyFile: string; testFile: string }`.
  Rules: a dir under `src/components/<cat>/<name>` or `src/sections/<name>` is **public iff it contains a `*.stories.tsx`**; `internal` category excluded; `componentFile` is the dir's real component source — resolve `<dir>/<name>.tsx` if it exists, else the first `.tsx` that is not `*.stories.tsx`/`*.test.tsx` (fixes the basename≠dirname fragility); `storyFile`/`testFile` are `<dir>/<name>.stories.tsx`/`.test.tsx`.

- [ ] **Step 1: Write the failing test**

Create `scripts/public-surface.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { sourceSurface, LIB } from './public-surface.mjs';

describe('sourceSurface', () => {
  const s = sourceSurface();
  it('finds the public components and sections (story-gated, internal excluded)', () => {
    expect(s.components.length).toBe(86);
    expect(s.sections.length).toBe(18);
    expect(s.components.some((e) => e.category === 'internal')).toBe(false);
  });
  it('resolves each entry to a real component source file', () => {
    const fs = require('node:fs');
    for (const e of [...s.components, ...s.sections]) {
      expect(fs.existsSync(e.componentFile), e.componentFile).toBe(true);
      expect(fs.existsSync(e.storyFile), e.storyFile).toBe(true);
    }
  });
  it('keeps the curated lib allowlist', () => {
    expect(LIB).toContain('./lib/SectionShell');
  });
});
```
(If `require` isn't available in the ESM test, use `import fs from 'node:fs'` at top.)

- [ ] **Step 2: Run it — expect failure** (`pnpm exec vitest run scripts/public-surface.test.mjs` → FAIL: `sourceSurface` not exported).

- [ ] **Step 3: Implement `sourceSurface` in `public-surface.mjs`**

Add the walk (keep `LIB`):

```js
import fs from 'node:fs';
import path from 'node:path';

function hasStory(dir) {
  return fs.readdirSync(dir).some((f) => f.endsWith('.stories.tsx'));
}
function resolveComponentFile(dir, name) {
  const preferred = path.join(dir, `${name}.tsx`);
  if (fs.existsSync(preferred)) return preferred;
  const tsx = fs.readdirSync(dir).find((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx'));
  return tsx ? path.join(dir, tsx) : preferred;
}
function entry(category, name, dir) {
  return {
    category, name, dir,
    componentFile: resolveComponentFile(dir, name),
    storyFile: path.join(dir, `${name}.stories.tsx`),
    testFile: path.join(dir, `${name}.test.tsx`),
  };
}
export function sourceSurface() {
  const components = [];
  const compRoot = 'src/components';
  for (const cat of fs.readdirSync(compRoot).sort()) {
    const catDir = path.join(compRoot, cat);
    if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (fs.statSync(dir).isDirectory() && hasStory(dir)) components.push(entry(cat, name, dir));
    }
  }
  const sections = [];
  const secRoot = 'src/sections';
  for (const name of fs.readdirSync(secRoot).sort()) {
    const dir = path.join(secRoot, name);
    if (fs.statSync(dir).isDirectory() && hasStory(dir)) sections.push(entry(null, name, dir));
  }
  return { components, sections };
}
```

- [ ] **Step 4: Run the test — expect 3 pass.**

- [ ] **Step 5: Refactor the consumers to use `sourceSurface()`**

- `gen-barrel.mjs`: replace its `collectComponents`/`collectSections` walks with `sourceSurface()`; emit `export * from './components/<cat>/<name>'` and `'./sections/<name>'` from the entries; keep the `LIB` loop. Output must be byte-identical to today.
- `gen-catalog.mjs`: replace its `collect()`/`hasStory()` with `sourceSurface()`; map each entry's `componentFile`/`storyFile` into the existing docgen + story-example logic (keep the lib-utility + enum-expansion + utilities-block logic untouched).
- `gen-tests.mjs`: rewrite to iterate `sourceSurface().components` AND `.sections`, writing each `testFile` from the right template (component smoke vs section smoke — keep the existing two templates, selected by `category === null`). Preserve the optional `onlyArg` filter (`process.argv[2]` matching `<cat>/<name>` or `<name>`).
- Delete `scripts/gen-section-tests.mjs`.

- [ ] **Step 6: Verify outputs unchanged**

```bash
pnpm gen:barrel && pnpm gen:catalog
git diff --stat src/index.ts catalog/llms.txt   # expect NO diff (identical output)
pnpm exec node scripts/gen-tests.mjs && git diff --stat 'src/**/*.test.tsx'  # regenerated smoke tests identical
pnpm release:preflight                            # OK
pnpm exec vitest run scripts/public-surface.test.mjs  # 3 pass
pnpm exec tsc -b                                  # clean
```
Expected: barrel/catalog/test files unchanged; preflight OK. (If any diff appears, the refactor changed behaviour — fix until identical.)

- [ ] **Step 7: Commit**

```bash
git add scripts/ ; git commit -m "refactor(scripts): deepen public-surface into the source-surface module (one walk, resolved file paths)"
```

---

## Task 2: One deep `SectionActionButton` renderer (kill inline CTA Button sites)

**Files:** `src/lib/SectionShell.tsx` (add `SectionActionButton`, refactor `SectionActions`), `src/sections/{Pricing,Cta,Announcement,Newsletter,Navbar}/*.tsx`, plus a test.

**Interfaces — Consumes:** `SectionAction`, `Button`. **Produces:**
- `export function SectionActionButton(props: { action: SectionAction; size?: ButtonProps['size']; defaultVariant?: ButtonProps['variant']; className?: string }): ReactElement` — renders one `<Button>` forwarding **all** `SectionAction` fields: `href`, `onClick`, `icon`, `variant = action.variant ?? defaultVariant`, `size = action.size ?? size`, plus the optional `className`; children = `action.label`.
- `SectionActions` becomes `actions.map((a) => <SectionActionButton action={a} size={size} key={...} />)` inside its row `<div>`.

- [ ] **Step 1: Write the failing test** — `src/lib/SectionShell.test.tsx` (create or extend):

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionActionButton } from './SectionShell';

describe('SectionActionButton', () => {
  it('forwards every SectionAction field (href, onClick, icon, variant, size)', () => {
    const onClick = vi.fn();
    render(<SectionActionButton action={{ label: 'Go', href: '/x', onClick, icon: 'arrow-right', variant: 'soft', size: 'lg' }} />);
    const el = screen.getByText('Go').closest('a, button')!;
    expect(el.getAttribute('href')).toBe('/x');
    fireEvent.click(el); expect(onClick).toHaveBeenCalled();
  });
  it('applies defaultVariant only when the action omits variant', () => {
    const { rerender } = render(<SectionActionButton action={{ label: 'A' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.className).toContain('rdz-btn--outline');
    rerender(<SectionActionButton action={{ label: 'A', variant: 'primary' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.className).toContain('rdz-btn--primary');
  });
});
```

- [ ] **Step 2: Run it — expect failure** (`SectionActionButton` not exported).

- [ ] **Step 3: Implement `SectionActionButton`; refactor `SectionActions` to use it.** In `src/lib/SectionShell.tsx`.

- [ ] **Step 4: Run the test — expect pass.**

- [ ] **Step 5: Replace the inline Button sites with `SectionActionButton`**

- `Pricing.tsx` (both PricingA tier button ~line 65 and PricingB ~line 137): `<SectionActionButton action={tier.action} defaultVariant={tier.popular ? 'primary' : 'outline'} className="sx-price__btn" />` — kills the copy-pasted popular/outline logic across A/B.
- `Cta.tsx` (CtaB email button ~line 45): `<SectionActionButton action={emailCapture.action} defaultVariant... size="lg" />` (keep the `lg` default via `size`/`defaultVariant`).
- `Announcement.tsx` AnnouncementB (~line 57): `<SectionActionButton action={action} defaultVariant="primary" size="sm" />`. **Leave AnnouncementA's `<a className="sx-ann__link">` as-is** — it is a deliberate banner *text link*, not a Button (it already forwards `href`+`onClick`).
- `Newsletter.tsx` (~line 35): `<SectionActionButton action={action} />`.
- `Navbar.tsx` `BarActions` (~line 92): map `SectionActionButton` (no row wrapper) instead of re-implementing the Button map.

- [ ] **Step 6: Verify** — `pnpm exec tsc -b` clean; `pnpm test` green (478); the Pricing/Cta/Announcement/Newsletter/Navbar section tests still pass; `pnpm exec vitest run src/lib/SectionShell.test.tsx` passes.

- [ ] **Step 7: Commit**

```bash
git add src/lib/SectionShell.tsx src/lib/SectionShell.test.tsx src/sections
git commit -m "refactor(sections): route every CTA through one SectionActionButton (no more dropped onClick/icon)"
```

---

## Task 3: Shared `SectionHeader` (+ ADR declining the body-override)

**Files:** `src/lib/SectionShell.tsx` (add `SectionHeader`), `src/sections/{Features,Stats,Team,Blog,Comparison}/*.tsx` (and any other section whose header is the eyebrow/heading-in-a-div shape), `docs/adr/0001-section-body-override-stays-in-variant.md` (new), a test.

**Interfaces — Produces:**
- `export function SectionHeader(props: { eyebrow?: ReactNode; heading?: ReactNode; className?: string }): ReactElement | null` — returns `null` when both absent; else `<div className={className ?? 'col sx-sec__head'}>{eyebrow && <span className="eyebrow2">{eyebrow}</span>}{heading && <h3 className="h-section">{heading}</h3>}</div>`. (Uniform `eyebrow2` + `h-section`; the `className` param carries each section's wrapper modifier.)

- [ ] **Step 1: Write the failing test** (`src/lib/SectionShell.test.tsx`, append):

```tsx
import { SectionHeader } from './SectionShell';
describe('SectionHeader', () => {
  it('renders null when empty, eyebrow+heading when given', () => {
    const { container, rerender } = render(<SectionHeader />);
    expect(container.firstChild).toBeNull();
    rerender(<SectionHeader eyebrow="Why" heading="Wired" />);
    expect(screen.getByText('Why')).toBeTruthy();
    expect(screen.getByText('Wired')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — expect failure. Step 3: Implement `SectionHeader`. Step 4: Run — expect pass.**

- [ ] **Step 5: Replace eyebrow/heading header blocks with `SectionHeader`**

Apply where the header is the `<div class="…head"><span eyebrow2><h3 h-section></div>` shape:
- `Features.tsx` A/B/C (lines ~26/54/92, byte-identical today): `<SectionHeader eyebrow={eyebrow} heading={heading} className="col sx-feat__head" />` — collapses 3 copies.
- `Stats.tsx` (×2): `<SectionHeader heading={heading} className="col sx-stat__head" />`.
- `Team.tsx`: `<SectionHeader heading={heading} className="col sx-team__head" />`.
- `Blog.tsx`, `Comparison.tsx`: apply if their header matches (heading in a wrapper); if a section uses a bare `<h2>` with no wrapper and no eyebrow (Faq, Testimonials), **leave it** — forcing it through `SectionHeader` would only add config. Use judgment per the deletion test; only convert where the markup matches.
- Do **not** convert Hero (its eyebrow is a `rdz-badge`, deliberately distinct) or Pricing's centered title+sub block.

- [ ] **Step 6: Write the ADR** — `docs/adr/0001-section-body-override-stays-in-variant.md`:

```markdown
# ADR 0001: The section body-override stays an in-variant idiom

## Status
Accepted (2026-06-21)

## Context
Every section variant renders its content as `{children ?? (<>…default body…</>)}` —
the `children` escape hatch overrides the auto-rendered body inside the themed
`SectionShell`. This idiom appears ~33 times. A deepening review proposed moving the
guard into `SectionShell` (e.g. a `body` prop, with the shell choosing `children ?? body`).

## Decision
Leave the `children ?? body` guard in each variant. Do NOT move it into `SectionShell`.

## Consequences
- The deletion test fails for this move: the guard is a one-token idiom, not complexity
  that concentrates. Relocating it would change `SectionShell`'s children contract for
  ~20 callers (every section + HeroBleed + the Showcase page) to net out a trivial gain,
  and would shift — not remove — the "forget it" failure mode (a section that forgets to
  pass `body` renders nothing just as one that forgets the guard does).
- `SectionShell` stays deep on **layout** and now **header** (`SectionHeader`); content
  framing stays the variant's job. Revisit only if section bodies start sharing structure
  (then a real shared body module, not a guard relocation, would be the move).
```

- [ ] **Step 7: Verify** — `tsc -b` clean; `pnpm test` green; Features/Stats/Team section tests pass; `SectionHeader` test passes.

- [ ] **Step 8: Commit**

```bash
git add src/lib/SectionShell.tsx src/lib/SectionShell.test.tsx src/sections docs/adr
git commit -m "refactor(sections): shared SectionHeader; ADR-0001 keeps body-override in-variant"
```

---

## Task 4: Collapse the structural section clones (internal seams)

**Files:** `src/sections/Navbar/Navbar.tsx`, `src/sections/Pricing/Pricing.tsx`, `src/sections/SocialProof/SocialProof.tsx`.

**Interfaces — Produces (all module-private internal seams, not new public exports):**
- `Navbar.tsx`: a private `NavCore` inner component holding the shared `useState`/`useRef` + bar + burger + `NavSheet` wiring, parameterized by `frameClassName`, brand-glyph classNames, and action `size`. `NavbarA/B/C` become thin presets.
- `Pricing.tsx`: a private `TierCard` rendering one tier (popular badge, name, blurb, price, `SectionActionButton`, features list); `PricingA` and `PricingB` both render it (PricingB passes the period-toggled price).
- `SocialProof.tsx`: a private `LogoMark` for the node/src/text three-branch; `SocialProofA`/`B` both use it.

- [ ] **Step 1: Extract `NavCore`** in `Navbar.tsx`; `NavbarA/B/C` delegate to it with their per-variant class/size args. Keep `'use client'`, the overlay/burger behaviour, and `NavbarD` (the tab bar) untouched.
- [ ] **Step 2: Extract `TierCard`** in `Pricing.tsx`; A and B render it; B threads the toggled price. Keep `'use client'`.
- [ ] **Step 3: Extract `LogoMark`** in `SocialProof.tsx`; A and B use it (differ only by class).
- [ ] **Step 4: Verify** — `pnpm exec tsc -b` clean; `pnpm test` green; the Navbar/Pricing/SocialProof section tests pass unchanged (behaviour preserved); `pnpm release:preflight` OK (no public-surface change). Spot-confirm the rendered DOM is unchanged (the existing story smoke + content tests cover this).
- [ ] **Step 5: Commit**

```bash
git add src/sections/Navbar src/sections/Pricing src/sections/SocialProof
git commit -m "refactor(sections): collapse NavbarA/B/C, Pricing tiers, SocialProof logos onto shared cores"
```

---

## Task 5: Name the modules in CONTEXT.md + regenerate + full gate

**Files:** `CONTEXT.md`, regenerate `src/index.ts`/`catalog/llms.txt`.

- [ ] **Step 1: Regenerate the public surface** (`SectionActionButton`, `SectionHeader` are new public exports from `SectionShell`):

```bash
pnpm gen:barrel && pnpm gen:catalog
pnpm release:preflight   # OK (commit regenerated artifacts)
grep -q "SectionActionButton" catalog/llms.txt && grep -q "SectionHeader" catalog/llms.txt && echo "new exports documented"
```

- [ ] **Step 2: Update CONTEXT.md** — add to the "Shared internals" area:
  - **Source-surface**: `scripts/public-surface.mjs` is the one walk that answers "which dirs are public (has-a-story) and where their files live"; gen-barrel/gen-catalog/gen-tests are thin adapters over it (kills the 4 duplicated walks + the basename fragility).
  - **Section-action**: `SectionActionButton` (in `SectionShell`) is the one renderer from a `SectionAction` to a `<Button>`; `SectionActions` maps it. Every CTA crosses this seam, so field-forwarding (href/onClick/icon/variant/size) is tested once.
  - **Section-header**: `SectionHeader` (in `SectionShell`) is the shared eyebrow+heading block; sections pass their wrapper class. (`SectionShell` is now deep on layout, header, and section-action rendering.)
  - **Internal seams**: note `NavCore`/`TierCard`/`LogoMark` collapsed the variant clones.
  - Link ADR-0001 (body-override stays in-variant).

- [ ] **Step 3: Full gate**

```bash
pnpm test 2>&1 | tail -3            # green (478 + the new SectionShell/source-surface tests)
pnpm build:pkg && node scripts/check-consumer.mjs
pnpm exec tsc -b
```

- [ ] **Step 4: Commit**

```bash
git add CONTEXT.md src/index.ts catalog/llms.txt
git commit -m "docs: name source-surface, SectionActionButton, SectionHeader in CONTEXT.md + regenerate catalog"
```

---

## Self-Review (against the candidates)

- Candidate 1 (source-surface) → Task 1. Candidate 2 (section-action) → Task 2. Candidate 3 (header dedup) → Task 3; the body-override sub-part is **declined with ADR-0001** (deletion test fails). Candidate 4 (clones) → Task 4. CONTEXT/catalog → Task 5. The flagged scheme-precedence duplication is intentionally **not** addressed (the no-flash script is a separate pre-hydration runtime; unifying moves complexity into a string-template — out of scope, noted).
- **No behaviour change** is the binding invariant: Task 1 asserts byte-identical generated output; Tasks 2–4 keep the 478-test suite + section tests green; only intentional fixes (uniform eyebrow class) may change rendered output, and those are covered by tests.
- Type/name consistency: `sourceSurface`, `SectionActionButton`, `SectionHeader`, `NavCore`/`TierCard`/`LogoMark` are used identically across tasks; `SectionActionButton` (Task 2) is reused by `TierCard` (Task 4).
