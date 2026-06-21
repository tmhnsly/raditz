# Architecture Deepening (round 2) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Extract four pieces of pure derivation logic that are still fused to a side-effect (DOM mutation, JSX, or a component module) into tested pure modules — the theme palette-resolution, chart domain padding, the explorer's Sidebar-model, and the Slider tick geometry.

**Architecture:** Behaviour-preserving pure-extraction refactors, the established codebase pattern (Scale, Page-model, Table-model, Pure cores, Source-surface). Each leaves the consumer a thin adapter and adds unit tests that reach the logic through its own interface. Gated by the existing 489-test suite + `release:preflight` drift gate + `build:pkg`/`check-consumer`.

**Tech Stack:** TypeScript/React 18, Vitest, pnpm. Architecture vocab per `improve-codebase-architecture` LANGUAGE.md; domain vocab per `CONTEXT.md`.

## Global Constraints

- pnpm. **No behaviour change**: `pnpm test` stays green (489), `pnpm release:preflight` OK, `pnpm build:pkg && node scripts/check-consumer.mjs` OK, `pnpm exec tsc -b` clean. Rendered output / set CSS vars must be identical.
- Each extraction must **concentrate** complexity (deletion test) — don't relocate a trivial idiom. Where a chart constant differs per caller (LineChart 0.12 vs ScatterChart 0.08), preserve each caller's value (pass as a param) — do NOT unify (that would change behaviour).
- Only Task 1 adds a public export (`themeVars` from `lib/theme`, reachable via the barrel) → catalog regenerates in Task 5. Tasks 2–4 touch `internal/*` (not public) — no barrel/catalog change.
- jest-dom NOT installed — native assertions.
- Commit per task; clean tree after each. Naming the deepened modules in `CONTEXT.md` happens in Task 5.

## File Structure

- `src/lib/theme.ts` — add pure `themeVars()`; `applyTheme` becomes a thin DOM adapter over it. Test: `src/lib/theme.test.tsx` (extend).
- `src/components/internal/scale.ts` — add `paddedDomain()` (+ a shared tooltip-flip threshold); `LineChart.tsx`/`ScatterChart.tsx` consume it. Test: `scale.test.ts` (extend/create).
- `src/explorer/registry.ts` — add `ancestorsOf`/`filterTree`/`allBranchIds` (the Sidebar-model); `Sidebar.tsx` consumes them. Test: `registry.test.ts` (extend).
- `src/components/internal/primitiveUtils.ts` — add `sliderTicks()`; `Slider.tsx` consumes it. Test: `primitiveUtils.test.ts` (extend/create).
- `CONTEXT.md` — names the four (Task 5).

---

## Task 1: Extract `themeVars` (theme palette-resolution) from `applyTheme`

**Files:** `src/lib/theme.ts`, `src/lib/theme.test.tsx`.

**Interfaces — Produces:** `export function themeVars(accent: Accent, gray: GrayChoice, radius?: RadiusChoice, motion?: MotionChoice): Record<string, string>` — the full resolved CSS-custom-property map `applyTheme` writes (every `--*` it currently sets via `setProperty`): `--accent-1..12`, `--neutral-1..12`, `--neutral-a1..6`, `--on-accent`, `--accent-2-solid/-ink/-surface`, the four semantic triples `--<name>`/`-ink`/`-surface`/`--on-<name>`, and `--radius-factor`. (`data-motion` is an attribute, NOT a var — it stays set by `applyTheme`.) `applyTheme` becomes: loop `themeVars(...)` onto `document.documentElement.style` + set `data-motion`.

- [ ] **Step 1: Write the failing test** (`src/lib/theme.test.tsx`, append):

```tsx
import { themeVars } from './theme';
describe('themeVars (palette resolution)', () => {
  it('resolves the accent ramp + auto gray pairing', () => {
    const v = themeVars('iris', 'auto');
    expect(v['--accent-9']).toBe('var(--iris-9)');
    expect(v['--neutral-9']).toBe('var(--slate-9)'); // iris pairs with slate
  });
  it('picks a semantic scale AWAY from the accent', () => {
    expect(themeVars('green', 'auto')['--success']).toBe('var(--jade-9)'); // not green
    expect(themeVars('grass', 'auto')['--success']).toBe('var(--jade-9)'); // grass→jade
  });
  it('gives light accents dark on-accent text', () => {
    expect(themeVars('sky', 'auto')['--on-accent']).toBe('var(--black-a12)');
    expect(themeVars('cyan', 'auto')['--on-accent']).toBe('var(--white-a12)');
  });
  it('sets the secondary complement + radius factor', () => {
    expect(themeVars('cyan', 'auto')['--accent-2-solid']).toBe('var(--gold-9)');
    expect(themeVars('cyan', 'auto', 'round')['--radius-factor']).toBe('2.0');
  });
});
```

- [ ] **Step 2: Run — expect failure** (`pnpm exec vitest run src/lib/theme.test.tsx` → FAIL: `themeVars` not exported).

- [ ] **Step 3: Implement `themeVars`; rewrite `applyTheme` as an adapter over it.** Move the derivation (the `--accent-*`/`--neutral-*` loops, `--on-accent`, the `COMPLEMENT` `--accent-2-*` block, the `SEMANTIC_FAMILIES`/`pickAway`/`onSolid` loop, `RADIUS_FACTOR`) into `themeVars`, building and returning the `Record<string,string>`. `applyTheme`:

```ts
export function applyTheme(accent, choice, radius = 'default', motion = 'smooth') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const vars = themeVars(accent, choice, radius, motion);
  for (const [k, val] of Object.entries(vars)) root.style.setProperty(k, val);
  root.setAttribute('data-motion', motion);
}
```
Keep `themeVars` defaulting `radius`/`motion` so it can be called standalone. The set of properties written must be IDENTICAL to before (same keys, same values).

- [ ] **Step 4: Run the test — expect 4 pass.**

- [ ] **Step 5: Verify no behaviour change** — `pnpm exec vitest run src/lib/theme.test.tsx` (the existing `useTheme` tests that assert `document.documentElement.style.getPropertyValue('--accent-9')` after `useTheme(...)` must still pass — proves `applyTheme` still writes the same vars); `pnpm exec tsc -b` clean.

- [ ] **Step 6: Commit** — `git add src/lib/theme.ts src/lib/theme.test.tsx && git commit -m "refactor(theme): extract pure themeVars() from applyTheme's DOM side-effect"`.

---

## Task 2: `paddedDomain` (+ shared tooltip-flip) in the Scale module

**Files:** `src/components/internal/scale.ts`, `src/components/internal/scale.test.ts` (extend/create), `src/components/data/LineChart/LineChart.tsx`, `src/components/data/ScatterChart/ScatterChart.tsx`.

**Interfaces — Produces:**
- `export function paddedDomain(values: number[], factor: number): [number, number]` — `[min - range*factor, max + range*factor]`, with the existing `range === 0 → ±1` fallback (so a flat series still gets a visible band) and an empty-array guard (`[0, 1]` or similar — match current behaviour).
- `export const TOOLTIP_FLIP_PCT = 92` (or `export function tooltipBelow(pctY: number): boolean`) — the shared "flip the tooltip below the point when it's near the top" threshold both charts hardcode as `py < 92`.

- [ ] **Step 1: Write the failing test** (`scale.test.ts`):

```ts
import { paddedDomain, TOOLTIP_FLIP_PCT } from './scale';
describe('paddedDomain', () => {
  it('expands by range*factor', () => {
    expect(paddedDomain([0, 10], 0.1)).toEqual([-1, 11]);
  });
  it('falls back to ±1 for a flat series (range 0)', () => {
    expect(paddedDomain([5, 5], 0.12)).toEqual([4, 6]);
  });
  it('exposes the shared tooltip-flip threshold', () => {
    expect(TOOLTIP_FLIP_PCT).toBe(92);
  });
});
```
(Adjust the empty-array expectation to whatever the charts do today after you read them.)

- [ ] **Step 2: Run — expect failure.**

- [ ] **Step 3: Implement `paddedDomain` + `TOOLTIP_FLIP_PCT` in `scale.ts`.** Read LineChart:65-72 and ScatterChart:25-49 first to reproduce their exact current math (incl. the `|| 1` fallback) — `paddedDomain` must produce the SAME domain each chart computes today.

- [ ] **Step 4: Run the test — expect pass.**

- [ ] **Step 5: Refactor the charts to consume it — preserving each caller's constant.**
- `LineChart.tsx`: replace its inline y-domain padding with `paddedDomain(yValues, 0.12)`; replace the `py < 92` tooltip check with `py < TOOLTIP_FLIP_PCT` (or `tooltipBelow(py)`).
- `ScatterChart.tsx`: replace its `pad()` helper / inline domain math with `paddedDomain(values, 0.08)` (keep its 0.08 — do NOT change it to 0.12); replace its `py < 92` with the shared threshold. ScatterChart's isolated radius scale (one caller) stays — do NOT extract it (hypothetical seam).

- [ ] **Step 6: Verify no behaviour change** — `pnpm exec vitest run src/components/internal/scale.test.ts src/components/data/LineChart/ src/components/data/ScatterChart/`; the chart story smoke tests pass (same render); `pnpm exec tsc -b` clean.

- [ ] **Step 7: Commit** — `git add src/components/internal/scale.ts src/components/internal/scale.test.ts src/components/data/LineChart src/components/data/ScatterChart && git commit -m "refactor(charts): share paddedDomain + tooltip-flip threshold via the Scale module"`.

---

## Task 3: Sidebar-model — pure tree-navigation logic into `registry.ts`

**Files:** `src/explorer/registry.ts`, `src/explorer/registry.test.ts` (extend), `src/explorer/Sidebar.tsx`.

**Interfaces — Produces (in `registry.ts`, operating on the existing `TreeItem` type):**
- `export function ancestorsOf(slug: string): string[]` — all ancestor prefix slugs of a slash-path.
- `export function filterTree(nodes: TreeItem[], query: string): TreeItem[]` — fuzzy-filter keeping ancestors of matches (uses the same `fuzzyScore`/`fuzzyFilter` the Sidebar uses today).
- `export function allBranchIds(nodes: TreeItem[]): string[]` — all branch-node ids (expand-all-on-search).

- [ ] **Step 1: Write the failing test** (`registry.test.ts`, append) — build a small `TreeItem[]`, assert `filterTree` keeps a matching leaf AND its ancestor branches and drops non-matches; `ancestorsOf('a/b/c')` → `['a','a/b']` (match the real slug scheme — read Sidebar.tsx); `allBranchIds` collects branch ids only.

- [ ] **Step 2: Run — expect failure.**

- [ ] **Step 3: Move the three functions from `Sidebar.tsx:18-50` into `registry.ts`** (exported); keep `LABEL_OVERRIDE`/`AutoCollapse`/presentation in `Sidebar.tsx`; import the three from `registry`. Preserve exact behaviour (same fuzzy scorer, same ancestor-keeping rule).

- [ ] **Step 4: Run the test — expect pass.**

- [ ] **Step 5: Verify no behaviour change** — `pnpm exec vitest run src/explorer/registry.test.ts`; the explorer still type-checks + renders (`pnpm exec tsc -b`); the existing explorer tests (if any) pass. (Explorer is app-only — not in the package; no barrel/catalog impact.)

- [ ] **Step 6: Commit** — `git add src/explorer/registry.ts src/explorer/registry.test.ts src/explorer/Sidebar.tsx && git commit -m "refactor(explorer): move Sidebar fuzzy-filter/ancestor/expand logic into the tested registry"`.

---

## Task 4: `sliderTicks` in `primitiveUtils`

**Files:** `src/components/internal/primitiveUtils.ts`, `src/components/internal/primitiveUtils.test.ts` (extend/create), `src/components/controls/Slider/Slider.tsx`.

**Interfaces — Produces:** `export function sliderTicks(min: number, max: number, step: number): number[]` — the interior tick percentages (excluding the 0% and 100% endpoints), matching `Slider.tsx:48-53`'s current `n = Math.round((max-min)/step)` then `(i/n)*100` for interior `i`.

- [ ] **Step 1: Write the failing test** (`primitiveUtils.test.ts`):

```ts
import { sliderTicks } from './primitiveUtils';
describe('sliderTicks', () => {
  it('returns interior marks for an even division', () => {
    expect(sliderTicks(0, 100, 10)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90]);
  });
  it('handles a non-zero min', () => {
    expect(sliderTicks(0, 50, 25)).toEqual([50]); // one interior mark at 50%
  });
});
```
(Confirm the exact expected values against `Slider.tsx`'s current formula before finalizing — the test must encode TODAY's behaviour.)

- [ ] **Step 2: Run — expect failure. Step 3: Implement `sliderTicks` (reproduce Slider's exact formula). Step 4: Run — expect pass.**

- [ ] **Step 5: Refactor `Slider.tsx`** to use `sliderTicks(min, max, step)` for its tick array. Verify the Slider story renders the same tick marks; `pnpm exec tsc -b` clean; `pnpm exec vitest run src/components/controls/Slider/`.

- [ ] **Step 6: Commit** — `git add src/components/internal/primitiveUtils.ts src/components/internal/primitiveUtils.test.ts src/components/controls/Slider/Slider.tsx && git commit -m "refactor(slider): extract sliderTicks geometry into primitiveUtils"`.

---

## Task 5: Name the modules in CONTEXT.md + regenerate + full gate

**Files:** `CONTEXT.md`; regenerate `src/index.ts`/`catalog/llms.txt` (themeVars is a new public export).

- [ ] **Step 1: Regenerate** — `pnpm gen:barrel && pnpm gen:catalog`; `pnpm release:preflight` OK (commit regenerated artifacts); confirm `themeVars` appears in `catalog/llms.txt`.
- [ ] **Step 2: Update CONTEXT.md** (Shared internals area, concise, file's voice):
  - **Palette-resolution**: `themeVars(accent, gray, radius, motion)` in `lib/theme` is the pure accent→token-map (gray pairing, the `COMPLEMENT` secondary, the pick-away semantic scales, light-accent on-accent text, radius factor); `applyTheme` is a thin DOM adapter over it, so the palette rules are unit-tested (not buried in a `setProperty` loop). Same play as the Pure cores.
  - **paddedDomain** (in *Scale*): the shared chart y-domain padding + the `TOOLTIP_FLIP_PCT` threshold; LineChart/ScatterChart consume it (each keeps its own padding factor — 0.12 vs 0.08 — documented, not unified).
  - **Sidebar-model** (in `explorer/registry`): `ancestorsOf`/`filterTree`/`allBranchIds` — the "what's visible/expanded for this query/route" logic, now beside the registry it operates on and covered by `registry.test.ts`.
  - **sliderTicks** (in *primitiveUtils*): interior tick geometry, tested for the uneven-step/non-zero-min edges.
- [ ] **Step 3: Full gate** — `pnpm test` green (489 + the new unit tests); `pnpm build:pkg && node scripts/check-consumer.mjs`; `pnpm exec tsc -b`.
- [ ] **Step 4: Commit** — `git add CONTEXT.md src/index.ts catalog/llms.txt && git commit -m "docs: name themeVars, paddedDomain, Sidebar-model, sliderTicks in CONTEXT.md + regenerate"`.

---

## Self-Review

- Candidate 1 (theme palette) → Task 1; 2 (paddedDomain) → Task 2; 3 (Sidebar-model) → Task 3; 4 (sliderTicks) → Task 4; CONTEXT/regen → Task 5. Carousel was considered and declined (DOM-entangled) — not in scope.
- **No behaviour change** is the binding invariant: Task 1's existing `useTheme` DOM tests prove `applyTheme` still writes identical vars; Tasks 2–4 keep the chart/explorer/slider tests green; the new unit tests encode TODAY's behaviour (read the source first).
- Type/name consistency: `themeVars`, `paddedDomain`/`TOOLTIP_FLIP_PCT`, `ancestorsOf`/`filterTree`/`allBranchIds`, `sliderTicks` used identically across tasks. Only `themeVars` is public (Task 5 regen); the rest are `internal`/`explorer` (no public surface change).
