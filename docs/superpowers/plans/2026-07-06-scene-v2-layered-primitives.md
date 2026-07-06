# Scene v2 — Layered Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `Scene` (motion) as layered primitives — presets become recipes over exported `Scene.X` layer components — with a ~23-preset catalog, semantic tone theming, calm defaults, and flush (normal-card) rendering.

**Architecture:** `Scene` stays the canvas (`bg` × `tone` × `speed`, preset XOR children). Decoration layers live in `layers.tsx`, illustration layers in `illustrations.tsx`; `Scene.tsx` holds the canvas + preset recipes + compound attachment. All styling stays in `Scene.scss` keyed off layer classes (no more `[data-preset=…]` decoration selectors). Tone resolves via `data-tone` → CSS custom-property triplets over existing tokens.

**Tech Stack:** React 18 + strict TS, SCSS with Raditz tokens (`cqmin` container units, `--motion-scale`), Vitest + Testing Library + Storybook `composeStories`, axe gate via story tests.

**Spec:** `docs/superpowers/specs/2026-07-06-scene-v2-layered-primitives-design.md`

## Global Constraints

- **No inline styles** in library code — dynamic values ONLY via CSS custom properties in `style` (e.g. `style={{ '--i': i }}`). Stories may use inline styles.
- Components never reference raw Radix steps — semantic token aliases only (`--accent-ink`, `--neutral-9`, …). `neutral` tone rides `--neutral-*` indirection, never `--slate-*`.
- All marks sized in `cqmin`; every animation duration multiplied by `var(--motion-scale, 1)` (SCSS `$scale`); base styles form a legible resting frame under `prefers-reduced-motion`.
- Story `meta.title` stays `Components/Motion/Scene`. Never hand-edit `src/index.ts` or `catalog/llms.txt` — regenerate with `pnpm gen:barrel && pnpm gen:catalog`.
- Badge chips never render unless supplied. Showroom copy is neutral/multi-purpose (no gamification).
- Commands: test = `pnpm vitest run src/components/motion/Scene/Scene.test.tsx`, full gates = `pnpm validate:taxonomy && pnpm build && pnpm test`.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## File Structure

- `src/components/motion/Scene/Scene.tsx` — canvas, types, preset recipes, compound `Scene.X` attachment (rewrite).
- `src/components/motion/Scene/layers.tsx` — NEW: decoration layers (Icon, Glow, Rings, Halo, Sparks, Orbit, Beam, Badge).
- `src/components/motion/Scene/illustrations.tsx` — NEW: illustration layers (6 existing moved + 8 new).
- `src/components/motion/Scene/Scene.scss` — restyled: tone/bg/speed blocks, layer-modifier animations, new scene blocks.
- `src/components/motion/Scene/Scene.stories.tsx` — rewrite: 8 story groups, neutral copy.
- `src/components/motion/Scene/Scene.test.tsx` — extended.
- `src/styles/tokens/colors.css` — add `--on-neutral`.
- `src/sections/Animations/Animations.tsx` — calm SCENE_CARDS (no badges, neutral copy).
- `CONTEXT.md` — motion category description update.

---

### Task 1: Canvas — semantic tone, bg treatments, speed, flush corners, children mode

**Files:**
- Modify: `src/styles/tokens/colors.css` (semantic block, ~line 103)
- Modify: `src/components/motion/Scene/Scene.tsx`
- Modify: `src/components/motion/Scene/Scene.scss` (root + bg blocks)
- Modify: `src/components/motion/Scene/Scene.stories.tsx` (Backgrounds/Tinted stories only — keep the rest compiling)
- Test: `src/components/motion/Scene/Scene.test.tsx`

**Interfaces:**
- Consumes: existing tokens `--accent/-ink/-surface`, `--accent-2-solid/-ink/-surface`, `--success|warning|danger|info(-ink/-surface/on-)`, `--neutral-3/9/11`, `--surface`, `--bg`.
- Produces: `SceneTone`, `SceneSpeed`, `SceneBg = 'none'|'soft'|'gradient'|'solid'`; `Scene` accepts `tone`, `speed`, `children` (XOR `preset`); CSS vars `--rdz-scene-ink/-wash/-solid/-on` readable by every later layer; `data-tone`/`data-speed` attributes. Later tasks rely on `Scene` rendering `children` verbatim inside `.rdz-scene__stage`.

- [ ] **Step 1: Write the failing tests** — append to `Scene.test.tsx` (and update the two stale assertions in the existing tests: `bg="accent"` → `bg="solid"`, `--rdz-scene-color` → `--rdz-scene-ink`):

```tsx
describe('Scene v2 canvas', () => {
  it('semantic tone → data-tone attribute, no inline ink', () => {
    const { container } = render(<Scene preset="flash" tone="success" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-tone')).toBe('success');
    expect(el.style.getPropertyValue('--rdz-scene-ink')).toBe('');
  });

  it('raw-colour tone → inline --rdz-scene-ink, no data-tone', () => {
    const { container } = render(<Scene preset="flash" tone="var(--accent-2-ink)" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-tone')).toBeNull();
    expect(el.style.getPropertyValue('--rdz-scene-ink')).toBe('var(--accent-2-ink)');
  });

  it('speed sets data-speed only when not normal', () => {
    const { container: slow } = render(<Scene preset="flash" speed="slow" />);
    expect((slow.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-speed')).toBe('slow');
    const { container: normal } = render(<Scene preset="flash" />);
    expect((normal.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-speed')).toBeNull();
  });

  it('children mode renders composed content instead of a preset', () => {
    const { container } = render(<Scene><span data-testid="custom" /></Scene>);
    expect(container.querySelector('.rdz-scene__stage [data-testid="custom"]')).toBeTruthy();
    expect((container.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-preset')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `pnpm vitest run src/components/motion/Scene/Scene.test.tsx`
Expected: FAIL — `tone`/`speed`/childless-preset type errors and missing attributes.

- [ ] **Step 3: Implement**

3a. `src/styles/tokens/colors.css` — after the `--info` line (~103) add:

```css
  /* on-colour for a solid neutral fill (Scene solid bg, neutral tone) */
  --on-neutral: var(--white-a12);
```

3b. `Scene.tsx` — replace the type/props/component sections (keep `content()`, `repeat`, `Spark`, `Star` as-is for now):

```tsx
export type SceneBg = 'none' | 'soft' | 'gradient' | 'solid';
/** Semantic tone (token triplet) — or any raw CSS colour as an ink-only escape hatch. */
export type SceneTone = 'accent' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | (string & {});
export type SceneSpeed = 'slow' | 'normal' | 'fast';

const SEMANTIC_TONES = new Set(['accent', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral']);

interface SceneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Backdrop treatment. @default 'gradient' */
  bg?: SceneBg;
  /** Hue family (semantic, token-driven) or raw CSS colour (ink only). @default 'accent' */
  tone?: SceneTone;
  /** Local tempo override (scales --motion-scale for this scene). @default 'normal' */
  speed?: SceneSpeed;
  /** Aspect ratio of the self-sizing canvas (ignored when `fill`). @default '16 / 9' */
  ratio?: string;
  /** Fill a positioned parent (`inset: 0`) instead of self-sizing. @default false */
  fill?: boolean;
  /** Freeze the animation. @default false */
  paused?: boolean;
}
export interface ScenePresetProps extends SceneBaseProps {
  /** Which recipe to play. */
  preset: ScenePreset;
  /** Hero glyph for icon-companion presets. */
  icon?: React.ReactNode;
  /** Optional chip near the icon — never rendered unless supplied. */
  badge?: React.ReactNode;
  children?: never;
}
export interface SceneComposedProps extends SceneBaseProps {
  preset?: never;
  icon?: never;
  badge?: never;
  /** Compose your own scene from `Scene.X` layers. */
  children: React.ReactNode;
}
export type SceneProps = ScenePresetProps | SceneComposedProps;

export function Scene(props: SceneProps): React.ReactElement {
  const {
    preset, icon, badge, children,
    bg = 'gradient', tone = 'accent', speed = 'normal',
    ratio = '16 / 9', fill = false, paused = false, className, style, ...rest
  } = props as ScenePresetProps & SceneComposedProps;
  const semantic = SEMANTIC_TONES.has(tone);
  return (
    <div
      className={cx('rdz-scene', fill && 'rdz-scene--fill', paused && 'is-paused', className)}
      data-preset={preset}
      data-bg={bg}
      data-tone={semantic && tone !== 'accent' ? tone : undefined}
      data-speed={speed !== 'normal' ? speed : undefined}
      aria-hidden="true"
      style={{ '--rdz-scene-ratio': ratio, ...(semantic || !tone ? null : { '--rdz-scene-ink': tone }), ...style } as React.CSSProperties}
      {...rest}
    >
      <span className="rdz-scene__stage">{children ?? content(preset, icon, badge)}</span>
    </div>
  );
}
```

(`data-tone="accent"` is omitted because accent is the root default — one less attribute in the common case; the test above uses `success`.)

3c. `Scene.scss` — replace the root block and bg washes:

```scss
.rdz-scene {
  position: relative; display: block; width: 100%; min-width: 0; max-width: 100%;
  aspect-ratio: var(--rdz-scene-ratio, 16 / 9);
  overflow: hidden; isolation: isolate;   // NB: border-radius:inherit removed — flush like an <img>; the card clips.
  container-type: size;
  /* tone triplet — data-tone repoints all four; a raw `tone` overrides --rdz-scene-ink inline */
  --rdz-scene-ink: var(--accent-ink);
  --rdz-scene-wash: var(--accent-surface);
  --rdz-scene-solid: var(--accent);
  --rdz-scene-on: var(--on-accent);
}

/* local tempo */
.rdz-scene[data-speed='slow'] { --motion-scale: 1.5; }
.rdz-scene[data-speed='fast'] { --motion-scale: 0.7; }

/* ── semantic tones ── */
.rdz-scene[data-tone='secondary'] { --rdz-scene-ink: var(--accent-2-ink); --rdz-scene-wash: var(--accent-2-surface); --rdz-scene-solid: var(--accent-2-solid); --rdz-scene-on: var(--on-accent); }
.rdz-scene[data-tone='success']   { --rdz-scene-ink: var(--success-ink);  --rdz-scene-wash: var(--success-surface);  --rdz-scene-solid: var(--success);  --rdz-scene-on: var(--on-success); }
.rdz-scene[data-tone='warning']   { --rdz-scene-ink: var(--warning-ink);  --rdz-scene-wash: var(--warning-surface);  --rdz-scene-solid: var(--warning);  --rdz-scene-on: var(--on-warning); }
.rdz-scene[data-tone='danger']    { --rdz-scene-ink: var(--danger-ink);   --rdz-scene-wash: var(--danger-surface);   --rdz-scene-solid: var(--danger);   --rdz-scene-on: var(--on-danger); }
.rdz-scene[data-tone='info']      { --rdz-scene-ink: var(--info-ink);     --rdz-scene-wash: var(--info-surface);     --rdz-scene-solid: var(--info);     --rdz-scene-on: var(--on-info); }
.rdz-scene[data-tone='neutral']   { --rdz-scene-ink: var(--neutral-11);   --rdz-scene-wash: var(--neutral-3);        --rdz-scene-solid: var(--neutral-9); --rdz-scene-on: var(--on-neutral); }

/* ── background treatments (tone-driven) ── */
.rdz-scene[data-bg='none']     { background: none; }
.rdz-scene[data-bg='soft']     { background: var(--surface); }
.rdz-scene[data-bg='gradient'] { background: linear-gradient(150deg, var(--rdz-scene-wash), color-mix(in srgb, var(--rdz-scene-wash) 45%, var(--bg))); }
/* theme-safe depth: a white-alpha sheen reads as a light source in BOTH themes
   (mixing toward --neutral-12 would invert on theme toggle) */
.rdz-scene[data-bg='solid']    { background: linear-gradient(150deg, var(--white-a5), transparent 55%) var(--rdz-scene-solid); --rdz-scene-ink: var(--rdz-scene-on); }
```

Also: `.rdz-scene__stage { … color: var(--rdz-scene-ink); }` (was `--rdz-scene-color`), and delete the old `--rdz-scene-color` default + old `[data-bg='accent'|'secondary']` blocks. Run `grep -rn "rdz-scene-color" src/` — update any stragglers to `--rdz-scene-ink`.

3d. `Scene.stories.tsx` — in `Backgrounds` change the array to `['gradient', 'solid', 'soft', 'none']`; in `Tinted` change `tone="var(--warning)"` → `tone="warning"`, `tone="var(--danger)"` → `tone="danger"`, `tone="var(--accent-2, var(--accent))"` → `tone="secondary"`. Update the existing test asserting `--rdz-scene-color`/`bg="accent"` accordingly (ratio/tone test now: `tone="var(--accent-2-ink)"` asserts `--rdz-scene-ink`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/motion/Scene/Scene.test.tsx` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/Scene src/styles/tokens/colors.css
git commit -m "feat(motion): Scene canvas v2 — semantic tone/bg/speed, children mode, flush corners"
```

---

### Task 2: Decoration layers + SCSS layer-modifier refactor

**Files:**
- Create: `src/components/motion/Scene/layers.tsx`
- Modify: `src/components/motion/Scene/Scene.tsx` (compound attach)
- Modify: `src/components/motion/Scene/Scene.scss` (decoration blocks)
- Test: `src/components/motion/Scene/Scene.test.tsx`

**Interfaces:**
- Consumes: `Scene` children mode (Task 1); `cx` from `../../internal`.
- Produces (Task 3 recipes consume these exact signatures):
  - `SceneIcon({ motion?: 'none'|'flash'|'bob'|'pulse'|'spin'|'float', children?: ReactNode })` — renders `.rdz-scene__icon` (or `.rdz-scene__core` fallback) with `.rdz-scene__m-<motion>`.
  - `SceneGlow({ strength?: 'soft'|'full' })`, `SceneRings({ count?: number, duration?: number })`, `SceneHalo({ strength?: 'soft'|'full' })`, `SceneSparks({ shape?: 'spark'|'star', count?: number })` (max 5), `SceneOrbit({ count?: number })` (max 3), `SceneBeam()`, `SceneBadge({ children })`.
  - Compound: `Scene.Icon/.Glow/.Rings/.Halo/.Sparks/.Orbit/.Beam/.Badge`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe('Scene layers', () => {
  it('composes decorations with parameters', () => {
    const { container } = render(
      <Scene>
        <Scene.Glow strength="soft" />
        <Scene.Rings count={5} />
        <Scene.Icon motion="spin"><svg data-testid="g" /></Scene.Icon>
        <Scene.Sparks shape="star" count={4} />
        <Scene.Orbit count={2} />
        <Scene.Beam />
      </Scene>,
    );
    expect(container.querySelector('.rdz-scene__glow--soft')).toBeTruthy();
    expect(container.querySelectorAll('.rdz-scene__ring')).toHaveLength(5);
    expect(container.querySelector('.rdz-scene__icon.rdz-scene__m-spin [data-testid="g"]')).toBeTruthy();
    expect(container.querySelectorAll('.rdz-scene__spark')).toHaveLength(4);
    expect(container.querySelectorAll('.rdz-scene__orbit')).toHaveLength(2);
    expect(container.querySelector('.rdz-scene__beam')).toBeTruthy();
  });

  it('Icon without children falls back to a core disc, badge only renders when added', () => {
    const { container } = render(<Scene><Scene.Icon motion="float" /></Scene>);
    expect(container.querySelector('.rdz-scene__core.rdz-scene__m-float')).toBeTruthy();
    expect(container.querySelector('.rdz-scene__badge')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify FAIL** (`Scene.Glow` undefined).

- [ ] **Step 3: Implement** — create `layers.tsx`:

```tsx
'use client';
import * as React from 'react';
import { cx } from '../../internal';

type Vars = React.CSSProperties;

export type SceneIconMotion = 'none' | 'flash' | 'bob' | 'pulse' | 'spin' | 'float';

/** Hero glyph (or a plain core disc when no glyph is given). */
export function SceneIcon({ motion = 'none', children }: { motion?: SceneIconMotion; children?: React.ReactNode }): React.ReactElement {
  const m = motion !== 'none' ? `rdz-scene__m-${motion}` : undefined;
  return children != null
    ? <span className={cx('rdz-scene__icon', m)}>{children}</span>
    : <span className={cx('rdz-scene__core', m)} />;
}

/** Throbbing radial glow behind the hero. */
export function SceneGlow({ strength = 'full' }: { strength?: 'soft' | 'full' }): React.ReactElement {
  return <span className={cx('rdz-scene__glow', strength === 'soft' && 'rdz-scene__glow--soft')} />;
}

/** Expanding concentric rings. `duration` in seconds sets the emit cadence. */
export function SceneRings({ count = 3, duration = 3 }: { count?: number; duration?: number }): React.ReactElement {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="rdz-scene__ring" style={{ '--i': i, '--n': count, '--rdz-rings-dur': `${duration}s` } as Vars} />
      ))}
    </>
  );
}

/** Soft breathing disc. */
export function SceneHalo({ strength = 'full' }: { strength?: 'soft' | 'full' }): React.ReactElement {
  return <span className={cx('rdz-scene__halo', strength === 'soft' && 'rdz-scene__halo--soft')} />;
}

const SparkGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.7 6 5.3 10.6 12 12-6.7 1.4-11.3 6-12 12-.7-6-5.3-10.6-12-12C6.7 10.6 11.3 6 12 0Z" /></svg>
);
const StarGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5l3 6.4 7 .9-5.2 4.8 1.4 6.9L12 17.9 5.8 20.5l1.4-6.9L2 8.8l7-.9z" /></svg>
);

/** Glyphs twinkling around the hero (max 5 placement slots). */
export function SceneSparks({ shape = 'spark', count = 3 }: { shape?: 'spark' | 'star'; count?: number }): React.ReactElement {
  const Glyph = shape === 'star' ? StarGlyph : SparkGlyph;
  return (
    <>
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className={`rdz-scene__spark rdz-scene__spark--${i}`}><Glyph /></span>
      ))}
    </>
  );
}

/** Dots circling the hero on up to three orbit rings. */
export function SceneOrbit({ count = 3 }: { count?: number }): React.ReactElement {
  return (
    <>
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <span key={i} className={`rdz-scene__orbit rdz-scene__orbit--${i}`}><span className="rdz-scene__orbit-dot" /></span>
      ))}
    </>
  );
}

/** Soft diagonal light sweep across the canvas. */
export function SceneBeam(): React.ReactElement {
  return <span className="rdz-scene__beam" />;
}

/** One-shot popping chip — only exists when you add it. */
export function SceneBadge({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="rdz-scene__badge">{children}</span>;
}
```

In `Scene.tsx`, import the layers and attach the compound at the bottom (rename the function to `SceneRoot`, export `const Scene = Object.assign(SceneRoot, { Icon: SceneIcon, Glow: SceneGlow, Rings: SceneRings, Halo: SceneHalo, Sparks: SceneSparks, Orbit: SceneOrbit, Beam: SceneBeam, Badge: SceneBadge })` — illustrations join in Task 3).

`Scene.scss` — replace the decoration blocks (delete every `[data-preset='flash'|'rings'|'spark'|'stars'|'orbit'|'pop']` selector and the `.rdz-scene__star*` classes):

```scss
/* ── icon motions (apply to __icon or __core) ── */
.rdz-scene__m-flash { animation: rdzScFlash calc(2.2s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__m-bob   { animation: rdzScBob   calc(3s   * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__m-pulse { animation: rdzScThrob calc(2.4s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__m-spin  { animation: rdzScSpin  calc(14s  * #{$scale}) linear infinite; }
.rdz-scene__m-float { animation: rdzScDrift calc(3.6s * #{$scale}) var(--ease-in-out) infinite; }

/* rings — parameterised: --i / --n / --rdz-rings-dur come from <SceneRings> */
.rdz-scene__ring {
  z-index: 0; width: 40cqmin; height: 40cqmin; border-radius: 50%;
  border: 0.6cqmin solid currentColor; opacity: 0;
  animation: rdzScRing calc(var(--rdz-rings-dur, 3s) * #{$scale}) var(--ease-decel) infinite;
  animation-delay: calc(var(--rdz-rings-dur, 3s) * #{$scale} * (var(--i, 0) / var(--n, 3)) * -1);
}

.rdz-scene__glow--soft { opacity: 0.4; }      /* renamed from --faint */
.rdz-scene__halo--soft { --rdz-halo-max: 0.4; }

/* sparks — 5 asymmetric, top-right-led slots */
.rdz-scene__spark { position: absolute; z-index: 2; color: currentColor; opacity: 0; animation: rdzScTwinkle calc(2.5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__spark svg { width: 100%; height: 100%; display: block; }
.rdz-scene__spark--0 { left: 60%; top: 8%;  width: 15cqmin; height: 15cqmin; animation-delay: calc(2.5s * #{$scale} * 0); }
.rdz-scene__spark--1 { left: 16%; top: 28%; width: 9cqmin;  height: 9cqmin;  animation-delay: calc(2.5s * #{$scale} * 0.42); }
.rdz-scene__spark--2 { left: 58%; top: 66%; width: 11cqmin; height: 11cqmin; animation-delay: calc(2.5s * #{$scale} * 0.72); }
.rdz-scene__spark--3 { left: 78%; top: 40%; width: 8cqmin;  height: 8cqmin;  animation-delay: calc(2.5s * #{$scale} * 0.2); }
.rdz-scene__spark--4 { left: 30%; top: 72%; width: 10cqmin; height: 10cqmin; animation-delay: calc(2.5s * #{$scale} * 0.55); }

/* orbit sizes move from :nth-of-type to index classes (compose-safe) */
.rdz-scene__orbit--0 { width: 46cqmin; height: 46cqmin; }
.rdz-scene__orbit--1 { width: 68cqmin; height: 68cqmin; animation-duration: calc(11s * #{$scale}); animation-direction: reverse; }
.rdz-scene__orbit--2 { width: 90cqmin; height: 90cqmin; animation-duration: calc(15s * #{$scale}); }

/* beam — one soft diagonal sweep */
.rdz-scene__beam { position: absolute; inset: 0; z-index: 0; background: linear-gradient(115deg, transparent 32%, color-mix(in srgb, currentColor 16%, transparent) 50%, transparent 68%); animation: rdzScBeam calc(4.5s * #{$scale}) var(--ease-in-out) infinite; }
```

Halo keyframes gain the strength var, plus two new keyframes:

```scss
@keyframes rdzScHalo  { 0%, 100% { opacity: calc(var(--rdz-halo-max, 0.7) * 0.2); transform: scale(0.85); } 50% { opacity: var(--rdz-halo-max, 0.7); transform: scale(1.05); } }
@keyframes rdzScDrift { 0%, 100% { transform: translateY(2%);  filter: drop-shadow(0 2cqmin 3cqmin color-mix(in srgb, currentColor 24%, transparent)); }
                        50%      { transform: translateY(-4%); filter: drop-shadow(0 5cqmin 5cqmin color-mix(in srgb, currentColor 12%, transparent)); } }
@keyframes rdzScBeam  { 0% { transform: translateX(-60%); } 55%, 100% { transform: translateX(60%); } }
```

Keep the old preset path rendering (Task 1's `content()`) working: in `content()` swap `rdz-scene__star`→`rdz-scene__spark` usages and `--faint`→`--soft`, and change the 'stars' case to reuse the spark class (`sparks(3, 'rdz-scene__spark', Star)`). Update the old preset test that queried `.rdz-scene__spark` count (still 3 — passes).

Reduced-motion block: replace `.rdz-scene__star` reference with nothing (class gone); keep the rest.

- [ ] **Step 4: Run tests** → PASS.
- [ ] **Step 5: Commit** — `feat(motion): Scene decoration layers (Icon/Glow/Rings/Halo/Sparks/Orbit/Beam/Badge)`

---

### Task 3: Illustration layers + preset recipes (+ `beam`, `drift`)

**Files:**
- Create: `src/components/motion/Scene/illustrations.tsx` (existing six moved)
- Modify: `src/components/motion/Scene/Scene.tsx` (recipes replace `content()`; delete `repeat`/`sparks`/`Spark`/`Star` from Scene.tsx — glyphs live in layers.tsx, `repeat` moves to illustrations.tsx)
- Modify: `src/components/motion/Scene/Scene.scss` (only: nothing needed for the six — verify class blocks unchanged)
- Test: `src/components/motion/Scene/Scene.test.tsx`

**Interfaces:**
- Consumes: all Task 2 layer signatures.
- Produces: `SceneBars/SceneWaves/SceneGrid/SceneConstellation/SceneRoute/SceneStack()` (no props) in illustrations.tsx; `ScenePreset` gains `'beam' | 'drift'`; compound gains `.Bars/.Waves/.Grid/.Constellation/.Route/.Stack`. Recipe table below is the contract Tasks 4–7 build on.

- [ ] **Step 1: Failing tests**

```tsx
describe('Scene recipes', () => {
  it('presets render the same marks as their layer recipes', () => {
    const { container: preset } = render(<Scene preset="rings" icon={<svg />} />);
    const { container: composed } = render(
      <Scene><Scene.Glow strength="soft" /><Scene.Rings count={4} /><Scene.Icon><svg /></Scene.Icon></Scene>,
    );
    const marks = (c: HTMLElement) =>
      Array.from(c.querySelectorAll('.rdz-scene__stage *')).map((el) => (el as HTMLElement).className).sort();
    expect(marks(preset as HTMLElement)).toEqual(marks(composed as HTMLElement));
  });

  it('new companion presets: beam sweeps, drift floats with a soft halo', () => {
    const { container: beam } = render(<Scene preset="beam" icon={<svg />} />);
    expect(beam.querySelector('.rdz-scene__beam')).toBeTruthy();
    const { container: drift } = render(<Scene preset="drift" icon={<svg />} />);
    expect(drift.querySelector('.rdz-scene__halo--soft')).toBeTruthy();
    expect(drift.querySelector('.rdz-scene__icon.rdz-scene__m-float')).toBeTruthy();
  });

  it('illustrations exist as layers too', () => {
    const { container } = render(<Scene><Scene.Waves /><Scene.Badge>NEW</Scene.Badge></Scene>);
    expect(container.querySelector('.rdz-scene__wave')).toBeTruthy();
    expect(container.querySelector('.rdz-scene__badge')?.textContent).toBe('NEW');
  });
});
```

- [ ] **Step 2: Run** → FAIL (no `beam` preset, no `Scene.Waves`).

- [ ] **Step 3: Implement** — `illustrations.tsx` starts with the moved code (verbatim JSX from today's `content()` cases, one exported function per scene — `SceneBars` returns the `__bars` span, etc.; move the `repeat` helper here). Then in `Scene.tsx`:

```tsx
export type ScenePreset =
  | 'flash' | 'rings' | 'halo' | 'spark' | 'stars' | 'orbit' | 'pop' | 'beam' | 'drift'
  | 'bars' | 'waves' | 'grid' | 'constellation' | 'route' | 'stack'
  | 'trend' | 'chat' | 'terminal' | 'window' | 'gauge' | 'shield' | 'pins' | 'card';

function recipe(preset: ScenePreset, icon: React.ReactNode, badge: React.ReactNode): React.ReactNode {
  const chip = badge != null ? <SceneBadge>{badge}</SceneBadge> : null;
  switch (preset) {
    case 'flash': return <><SceneGlow /><SceneRings count={2} duration={2.2} /><SceneIcon motion="flash">{icon}</SceneIcon>{chip}</>;
    case 'rings': return <><SceneGlow strength="soft" /><SceneRings count={4} /><SceneIcon>{icon}</SceneIcon>{chip}</>;
    case 'halo':  return <><SceneHalo /><SceneIcon>{icon}</SceneIcon>{chip}</>;
    case 'spark': return <><SceneIcon>{icon}</SceneIcon><SceneSparks />{chip}</>;
    case 'stars': return <><SceneIcon>{icon}</SceneIcon><SceneSparks shape="star" />{chip}</>;
    case 'orbit': return <><SceneOrbit /><SceneIcon>{icon}</SceneIcon>{chip}</>;
    case 'pop':   return <><SceneIcon motion="bob">{icon}</SceneIcon>{chip}</>;
    case 'beam':  return <><SceneBeam /><SceneIcon>{icon}</SceneIcon>{chip}</>;
    case 'drift': return <><SceneHalo strength="soft" /><SceneIcon motion="float">{icon}</SceneIcon>{chip}</>;
    case 'bars': return <><SceneBars />{chip}</>;
    case 'waves': return <><SceneWaves />{chip}</>;
    case 'grid': return <><SceneGrid />{chip}</>;
    case 'constellation': return <><SceneConstellation />{chip}</>;
    case 'route': return <><SceneRoute />{chip}</>;
    case 'stack': return <><SceneStack />{chip}</>;
    case 'trend': return <><SceneTrend />{chip}</>;
    case 'chat': return <><SceneChat />{chip}</>;
    case 'terminal': return <><SceneTerminal />{chip}</>;
    case 'window': return <><SceneWindow />{chip}</>;
    case 'gauge': return <><SceneGauge />{chip}</>;
    case 'shield': return <><SceneShield />{chip}</>;
    case 'pins': return <><ScenePins />{chip}</>;
    case 'card': return <><SceneCard />{chip}</>;
  }
}
```

For this task, add placeholder-free stubs for the eight new scenes in `illustrations.tsx` that Tasks 4–6 fill with real content — each already returns its final root element so the recipe switch compiles and renders (e.g. `export function SceneTrend() { return <svg className="rdz-scene__trend" viewBox="0 0 100 60" aria-hidden="true" />; }` — Tasks 4–6 replace the empty bodies with the full marks). Extend `Object.assign` with `Bars … Card` (all fourteen). Delete `content()`, `ICON_PRESETS`, and the now-unused helpers from `Scene.tsx`. Update the component JSDoc to describe recipes-over-layers.

- [ ] **Step 4: Run the full Scene test file** — old preset tests (`flash` rings=2, `spark` count=3, `bars`=7, `grid`=16) must still pass through the recipe path. → PASS.
- [ ] **Step 5: Commit** — `feat(motion): Scene presets become recipes over layers; beam + drift companions`

---

### Task 4: Bespoke scenes — `trend` + `gauge` (SVG draw pattern)

**Files:**
- Modify: `src/components/motion/Scene/illustrations.tsx`
- Modify: `src/components/motion/Scene/Scene.scss`
- Test: `src/components/motion/Scene/Scene.test.tsx`

**Interfaces:** Consumes recipe wiring (Task 3). Produces final `SceneTrend`, `SceneGauge` with the class names below (stories in Task 7 rely on presets only).

- [ ] **Step 1: Failing tests**

```tsx
it('trend draws a line, area and end-dot; gauge has track, fill and tip', () => {
  const { container: t } = render(<Scene preset="trend" />);
  expect(t.querySelector('.rdz-scene__trend-line')).toBeTruthy();
  expect(t.querySelector('.rdz-scene__trend-area')).toBeTruthy();
  expect(t.querySelector('.rdz-scene__trend-dot')).toBeTruthy();
  const { container: g } = render(<Scene preset="gauge" />);
  expect(g.querySelector('.rdz-scene__gauge-track')).toBeTruthy();
  expect(g.querySelector('.rdz-scene__gauge-fill')).toBeTruthy();
  expect(g.querySelector('.rdz-scene__gauge-tip')).toBeTruthy();
});
```

- [ ] **Step 2: Run** → FAIL (stubs are empty).

- [ ] **Step 3: Implement** — replace the stubs:

```tsx
/** Line chart drawing itself upward — soft area fill, pulsing end-dot. */
export function SceneTrend(): React.ReactElement {
  return (
    <svg className="rdz-scene__trend" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__trend-area" d="M10 48 C 26 46 34 36 50 32 S 74 20 90 14 L 90 52 L 10 52 Z" />
      <path className="rdz-scene__trend-line" pathLength={1} d="M10 48 C 26 46 34 36 50 32 S 74 20 90 14" fill="none" />
      <circle className="rdz-scene__trend-dot" cx="90" cy="14" r="3.2" />
    </svg>
  );
}

/** Arc meter sweeping to ~70% with a glowing tip. */
export function SceneGauge(): React.ReactElement {
  return (
    <svg className="rdz-scene__gauge" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__gauge-track" d="M18 50 A 34 34 0 1 1 82 50" fill="none" />
      <path className="rdz-scene__gauge-fill" pathLength={1} d="M18 50 A 34 34 0 1 1 82 50" fill="none" />
      <circle className="rdz-scene__gauge-tip" r="3.4" />
    </svg>
  );
}
```

`Scene.scss` additions:

```scss
/* ── trend — line draws up, area fades in, end-dot pops (5.5s cycle) ── */
.rdz-scene__trend { position: absolute; inset: 0; width: 100%; height: 100%; }
.rdz-scene__trend-line { stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; animation: rdzScTrendLine calc(5.5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__trend-area { fill: currentColor; opacity: 0.12; animation: rdzScTrendArea calc(5.5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__trend-dot  { fill: currentColor; transform-box: fill-box; transform-origin: center; animation: rdzScTrendDot calc(5.5s * #{$scale}) var(--ease-in-out) infinite; }

/* ── gauge — arc sweeps to 70%, glowing tip rides the arc (4.5s cycle) ── */
.rdz-scene__gauge { position: absolute; inset: 0; width: 100%; height: 100%; }
.rdz-scene__gauge-track { stroke: currentColor; stroke-width: 5; stroke-linecap: round; opacity: 0.16; }
.rdz-scene__gauge-fill  { stroke: currentColor; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0.3; animation: rdzScGauge calc(4.5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__gauge-tip   { fill: currentColor; filter: drop-shadow(0 0 1.8cqmin currentColor); offset-path: path('M18 50 A 34 34 0 1 1 82 50'); offset-distance: 70%; animation: rdzScGaugeTip calc(4.5s * #{$scale}) var(--ease-in-out) infinite; }

@keyframes rdzScTrendLine { 0%, 6% { stroke-dashoffset: 1; opacity: 1; } 48%, 88% { stroke-dashoffset: 0; opacity: 1; } 96%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes rdzScTrendArea { 0%, 38% { opacity: 0; } 58%, 88% { opacity: 0.12; } 96%, 100% { opacity: 0; } }
@keyframes rdzScTrendDot  { 0%, 44% { opacity: 0; transform: scale(0.4); } 52% { opacity: 1; transform: scale(1.2); } 58%, 88% { opacity: 1; transform: scale(1); } 96%, 100% { opacity: 0; } }
@keyframes rdzScGauge     { 0%, 8% { stroke-dashoffset: 1; opacity: 1; } 50%, 86% { stroke-dashoffset: 0.3; opacity: 1; } 95%, 100% { stroke-dashoffset: 0.3; opacity: 0; } }
@keyframes rdzScGaugeTip  { 0%, 8% { offset-distance: 0%; opacity: 0; } 14% { opacity: 1; } 50%, 86% { offset-distance: 70%; opacity: 1; } 95%, 100% { offset-distance: 70%; opacity: 0; } }
```

Reduced-motion additions (inside the existing block): `.rdz-scene__trend-line, .rdz-scene__gauge-fill { stroke-dashoffset: 0.3; }` is wrong for trend — instead: `.rdz-scene__trend-line { stroke-dashoffset: 0; } .rdz-scene__trend-dot { opacity: 1; } .rdz-scene__gauge-tip { opacity: 1; }` (base styles above already rest at drawn/70%).

- [ ] **Step 4: Run tests** → PASS. Also eyeball in Storybook if running (`preset="trend"` via Illustrations story comes in Task 7 — optional now).
- [ ] **Step 5: Commit** — `feat(motion): Scene trend + gauge bespoke scenes`

---

### Task 5: Bespoke scenes — `chat`, `terminal`, `window` (chrome/skeleton pattern)

**Files/Interfaces:** same shape as Task 4 — final `SceneChat`, `SceneTerminal`, `SceneWindow`.

- [ ] **Step 1: Failing tests**

```tsx
it('chat pops bubbles with typing dots; terminal types with a caret; window shimmers skeletons', () => {
  const { container: c } = render(<Scene preset="chat" />);
  expect(c.querySelectorAll('.rdz-scene__bubble')).toHaveLength(3);
  expect(c.querySelectorAll('.rdz-scene__chat-dot')).toHaveLength(3);
  const { container: t } = render(<Scene preset="terminal" />);
  expect(t.querySelector('.rdz-scene__term-caret')).toBeTruthy();
  expect(t.querySelector('.rdz-scene__frame-bar')).toBeTruthy();
  const { container: w } = render(<Scene preset="window" />);
  expect(w.querySelectorAll('.rdz-scene__skel')).toHaveLength(4);
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** — illustrations:

```tsx
/** Message bubbles popping in, typing-dots on the last. */
export function SceneChat(): React.ReactElement {
  return (
    <span className="rdz-scene__chat">
      <span className="rdz-scene__bubble rdz-scene__bubble--0" />
      <span className="rdz-scene__bubble rdz-scene__bubble--1" />
      <span className="rdz-scene__bubble rdz-scene__bubble--2">
        <span className="rdz-scene__chat-dot" /><span className="rdz-scene__chat-dot" /><span className="rdz-scene__chat-dot" />
      </span>
    </span>
  );
}

/** Window chrome + a prompt line typing with a blinking caret. */
export function SceneTerminal(): React.ReactElement {
  return (
    <span className="rdz-scene__frame rdz-scene__frame--terminal">
      <span className="rdz-scene__frame-bar"><span /><span /><span /></span>
      <span className="rdz-scene__term-line">
        <span className="rdz-scene__term-prompt" />
        <span className="rdz-scene__term-text" />
        <span className="rdz-scene__term-caret" />
      </span>
      <span className="rdz-scene__term-out" />
    </span>
  );
}

/** Browser frame with skeleton content blocks shimmering in. */
export function SceneWindow(): React.ReactElement {
  return (
    <span className="rdz-scene__frame rdz-scene__frame--window">
      <span className="rdz-scene__frame-bar"><span /><span /><span /></span>
      <span className="rdz-scene__win-body">
        <span className="rdz-scene__skel rdz-scene__skel--0" />
        <span className="rdz-scene__skel rdz-scene__skel--1" />
        <span className="rdz-scene__skel rdz-scene__skel--2" />
        <span className="rdz-scene__skel rdz-scene__skel--3" />
      </span>
    </span>
  );
}
```

SCSS:

```scss
/* ── shared window chrome (terminal / window) ── */
.rdz-scene__frame { position: absolute; inset: 0; margin: auto; width: 64cqmin; height: 46cqmin; border-radius: 3cqmin; border: 0.6cqmin solid color-mix(in srgb, currentColor 45%, transparent); background: color-mix(in srgb, currentColor 6%, transparent); display: flex; flex-direction: column; }
.rdz-scene__frame-bar { display: flex; gap: 1.8cqmin; padding: 2.4cqmin 3cqmin; border-bottom: 0.4cqmin solid color-mix(in srgb, currentColor 25%, transparent); }
.rdz-scene__frame-bar > span { width: 2.6cqmin; height: 2.6cqmin; border-radius: 50%; background: currentColor; opacity: 0.5; }

/* ── chat — three bubbles pop in a 7s conversation loop ── */
.rdz-scene__chat { position: absolute; inset: 0; margin: auto; width: 62cqmin; height: 44cqmin; }
.rdz-scene__bubble { position: absolute; border-radius: 3.4cqmin; background: color-mix(in srgb, currentColor 18%, transparent); opacity: 0; animation: rdzScBubble calc(7s * #{$scale}) var(--ease-spring) infinite; }
.rdz-scene__bubble--0 { left: 0; top: 0;   width: 58%; height: 24%; border-bottom-left-radius: 1cqmin; }
.rdz-scene__bubble--1 { right: 0; top: 32%; width: 48%; height: 24%; border-bottom-right-radius: 1cqmin; background: color-mix(in srgb, currentColor 85%, transparent); transform-origin: bottom right; animation-delay: calc(7s * #{$scale} * 0.14); }
.rdz-scene__bubble--2 { left: 0; bottom: 0; width: 40%; height: 26%; border-bottom-left-radius: 1cqmin; display: inline-flex; align-items: center; justify-content: center; gap: 2cqmin; animation-delay: calc(7s * #{$scale} * 0.3); }
.rdz-scene__bubble--0, .rdz-scene__bubble--2 { transform-origin: bottom left; }
.rdz-scene__chat-dot { width: 2.6cqmin; height: 2.6cqmin; border-radius: 50%; background: currentColor; animation: rdzScChatDot calc(1.2s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__chat-dot:nth-child(2) { animation-delay: calc(1.2s * #{$scale} * 0.2); }
.rdz-scene__chat-dot:nth-child(3) { animation-delay: calc(1.2s * #{$scale} * 0.4); }

/* ── terminal — prompt types, caret blinks, an output line lands (6s loop) ── */
.rdz-scene__frame--terminal { justify-content: flex-start; }
.rdz-scene__term-line { display: flex; align-items: center; gap: 1.8cqmin; padding: 4cqmin 4cqmin 0; }
.rdz-scene__term-prompt { width: 3cqmin; height: 3.6cqmin; background: currentColor; clip-path: polygon(0 0, 100% 50%, 0 100%); flex: none; }
.rdz-scene__term-text { height: 3cqmin; border-radius: 0.8cqmin; background: color-mix(in srgb, currentColor 55%, transparent); width: 0; animation: rdzScType calc(6s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__term-caret { width: 1.4cqmin; height: 4cqmin; background: currentColor; animation: rdzScBlink calc(1s * #{$scale}) steps(1) infinite; flex: none; }
.rdz-scene__term-out { margin: 3cqmin 4cqmin 0 8.8cqmin; height: 3cqmin; border-radius: 0.8cqmin; background: color-mix(in srgb, currentColor 25%, transparent); opacity: 0; animation: rdzScTermOut calc(6s * #{$scale}) var(--ease-in-out) infinite; }

/* ── window — skeleton blocks shimmer in ── */
.rdz-scene__win-body { position: relative; flex: 1; padding: 3cqmin; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 2fr 1fr; gap: 2.4cqmin; }
.rdz-scene__skel { border-radius: 1.4cqmin; background: currentColor; opacity: 0.15; animation: rdzScSkel calc(3.2s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__skel--0 { grid-column: 1 / -1; }
.rdz-scene__skel--1 { animation-delay: calc(3.2s * #{$scale} * 0.15); }
.rdz-scene__skel--2 { animation-delay: calc(3.2s * #{$scale} * 0.3); }
.rdz-scene__skel--3 { grid-column: 1 / -1; height: 40%; animation-delay: calc(3.2s * #{$scale} * 0.45); }

@keyframes rdzScBubble  { 0% { opacity: 0; transform: scale(0.6); } 5% { opacity: 1; transform: scale(1.04); } 8%, 86% { opacity: 1; transform: scale(1); } 96%, 100% { opacity: 0; transform: scale(1); } }
@keyframes rdzScChatDot { 0%, 60%, 100% { opacity: 0.35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-30%); } }
@keyframes rdzScType    { 0%, 8% { width: 0; } 46%, 90% { width: 60%; } 97%, 100% { width: 0; } }
@keyframes rdzScBlink   { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes rdzScTermOut { 0%, 52% { opacity: 0; transform: translateY(20%); } 60%, 90% { opacity: 1; transform: translateY(0); } 97%, 100% { opacity: 0; } }
@keyframes rdzScSkel    { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.45; } }
```

Reduced-motion additions: `.rdz-scene__bubble { opacity: 1; } .rdz-scene__term-text { width: 60%; } .rdz-scene__term-out { opacity: 1; } .rdz-scene__skel { opacity: 0.35; }`.

- [ ] **Step 4: Run tests** → PASS.
- [ ] **Step 5: Commit** — `feat(motion): Scene chat + terminal + window bespoke scenes`

---

### Task 6: Bespoke scenes — `shield`, `pins`, `card`

**Files/Interfaces:** same shape — final `SceneShield`, `ScenePins`, `SceneCard`. `SceneShield` uses `React.useId()` for its clip-path id.

- [ ] **Step 1: Failing tests**

```tsx
it('shield draws with a check and scan; pins drop with ripples; card has chip and shine', () => {
  const { container: s } = render(<Scene preset="shield" />);
  expect(s.querySelector('.rdz-scene__shield-outline')).toBeTruthy();
  expect(s.querySelector('.rdz-scene__shield-check')).toBeTruthy();
  expect(s.querySelector('.rdz-scene__shield-scan')).toBeTruthy();
  const { container: p } = render(<Scene preset="pins" />);
  expect(p.querySelectorAll('.rdz-scene__pin')).toHaveLength(2);
  expect(p.querySelectorAll('.rdz-scene__pin-ripple')).toHaveLength(2);
  const { container: c } = render(<Scene preset="card" />);
  expect(c.querySelector('.rdz-scene__pay-chip')).toBeTruthy();
  expect(c.querySelector('.rdz-scene__pay-shine')).toBeTruthy();
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** — illustrations:

```tsx
const SHIELD_D = 'M50 8 L70 15 V 32 C 70 44 61 52 50 56 C 39 52 30 44 30 32 V 15 Z';

/** Shield outline draws on, check lands, one soft scan pass. */
export function SceneShield(): React.ReactElement {
  const clipId = React.useId();
  return (
    <svg className="rdz-scene__shield" viewBox="0 0 100 60" aria-hidden="true">
      <clipPath id={clipId}><path d={SHIELD_D} /></clipPath>
      <path className="rdz-scene__shield-outline" pathLength={1} d={SHIELD_D} fill="none" />
      <rect className="rdz-scene__shield-scan" clipPath={`url(#${clipId})`} x="28" y="4" width="44" height="9" />
      <path className="rdz-scene__shield-check" pathLength={1} d="M42 32 L48 38 L59 26" fill="none" />
    </svg>
  );
}

/** Dotted map fragment; two pins drop with landing ripples. */
export function ScenePins(): React.ReactElement {
  return (
    <svg className="rdz-scene__pins" viewBox="0 0 100 60" aria-hidden="true">
      <g className="rdz-scene__pins-dots">
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i} cx={18 + (i % 5) * 16} cy={16 + Math.floor(i / 5) * 14} r="1.4" />
        ))}
      </g>
      <circle className="rdz-scene__pin-ripple rdz-scene__pin-ripple--0" cx="34" cy="31" r="6" />
      <circle className="rdz-scene__pin-ripple rdz-scene__pin-ripple--1" cx="66" cy="45" r="6" />
      {/* teardrop with a punched hole (evenodd: outer drop + inner circle subpath) */}
      <path className="rdz-scene__pin rdz-scene__pin--0" fillRule="evenodd"
        d="M34 31 C 29 25 26 22 26 17 A 8 8 0 1 1 42 17 C 42 22 39 25 34 31 Z M34 20 a 3 3 0 1 0 0-6 a 3 3 0 1 0 0 6 Z" />
      <path className="rdz-scene__pin rdz-scene__pin--1" fillRule="evenodd"
        d="M66 45 C 61 39 58 36 58 31 A 8 8 0 1 1 74 31 C 74 36 71 39 66 45 Z M66 34 a 3 3 0 1 0 0-6 a 3 3 0 1 0 0 6 Z" />
    </svg>
  );
}

/** Payment card — chip, number lines, shine sweep, tap ripple. */
export function SceneCard(): React.ReactElement {
  return (
    <span className="rdz-scene__pay">
      <span className="rdz-scene__pay-chip" />
      <span className="rdz-scene__pay-line rdz-scene__pay-line--0" />
      <span className="rdz-scene__pay-line rdz-scene__pay-line--1" />
      <span className="rdz-scene__pay-shine" />
      <span className="rdz-scene__pay-ring" />
    </span>
  );
}
```

SCSS:

```scss
/* ── shield — outline draws, check lands, one scan pass (7s loop) ── */
.rdz-scene__shield { position: absolute; inset: 0; width: 100%; height: 100%; }
.rdz-scene__shield-outline { stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; animation: rdzScShieldDraw calc(7s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__shield-check { stroke: currentColor; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; animation: rdzScCheckDraw calc(7s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__shield-scan { fill: color-mix(in srgb, currentColor 18%, transparent); opacity: 0; animation: rdzScScan calc(7s * #{$scale}) var(--ease-in-out) infinite; }

/* ── pins — staggered drop + ripple (6s loop) ── */
.rdz-scene__pins { position: absolute; inset: 0; width: 100%; height: 100%; }
.rdz-scene__pins-dots circle { fill: currentColor; opacity: 0.22; }
.rdz-scene__pin { fill: currentColor; transform-box: fill-box; transform-origin: center bottom; animation: rdzScPinDrop calc(6s * #{$scale}) var(--ease-spring) infinite; }
.rdz-scene__pin--1, .rdz-scene__pin-ripple--1 { animation-delay: calc(6s * #{$scale} * 0.18); }
.rdz-scene__pin-ripple { fill: none; stroke: currentColor; stroke-width: 1.4; vector-effect: non-scaling-stroke; transform-box: fill-box; transform-origin: center; opacity: 0; animation: rdzScPinRipple calc(6s * #{$scale}) var(--ease-decel) infinite; }

/* ── card — payment card with shine + tap ripple ── */
.rdz-scene__pay { position: absolute; inset: 0; margin: auto; width: 58cqmin; height: 37cqmin; border-radius: 3.5cqmin; border: 0.6cqmin solid color-mix(in srgb, currentColor 50%, transparent); background: color-mix(in srgb, currentColor 8%, transparent); overflow: hidden; animation: rdzScBob calc(4.5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__pay-chip { position: absolute; left: 8%; top: 16%; width: 15%; height: 20%; border-radius: 1cqmin; background: currentColor; opacity: 0.8; }
.rdz-scene__pay-line { position: absolute; left: 8%; height: 7%; border-radius: 0.9cqmin; background: currentColor; }
.rdz-scene__pay-line--0 { bottom: 26%; width: 46%; opacity: 0.45; }
.rdz-scene__pay-line--1 { bottom: 13%; width: 30%; opacity: 0.3; }
.rdz-scene__pay-shine { position: absolute; inset: -30%; background: linear-gradient(115deg, transparent 42%, color-mix(in srgb, currentColor 22%, transparent) 50%, transparent 58%); animation: rdzScBeam calc(5s * #{$scale}) var(--ease-in-out) infinite; }
.rdz-scene__pay-ring { position: absolute; right: 8%; top: 18%; width: 11cqmin; height: 11cqmin; border-radius: 50%; border: 0.6cqmin solid currentColor; opacity: 0; animation: rdzScTapRing calc(5s * #{$scale}) var(--ease-decel) infinite; }

@keyframes rdzScShieldDraw { 0%, 4% { stroke-dashoffset: 1; opacity: 1; } 34%, 88% { stroke-dashoffset: 0; opacity: 1; } 96%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes rdzScCheckDraw  { 0%, 36% { stroke-dashoffset: 1; opacity: 0; } 40% { opacity: 1; } 52%, 88% { stroke-dashoffset: 0; opacity: 1; } 96%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes rdzScScan       { 0%, 56% { opacity: 0; transform: translateY(0); } 62% { opacity: 1; } 78%, 100% { opacity: 0; transform: translateY(48px); } }
@keyframes rdzScPinDrop    { 0%, 6% { opacity: 0; transform: translateY(-16%); } 14% { opacity: 1; transform: translateY(3%); } 18%, 86% { opacity: 1; transform: translateY(0); } 95%, 100% { opacity: 0; } }
@keyframes rdzScPinRipple  { 0%, 14% { opacity: 0; transform: scale(0.2); } 20% { opacity: 0.5; } 42%, 100% { opacity: 0; transform: scale(1.7); } }
@keyframes rdzScTapRing    { 0%, 55% { opacity: 0; transform: scale(0.4); } 62% { opacity: 0.7; } 85%, 100% { opacity: 0; transform: scale(1.5); } }
```

(Scan translate uses `px` in SVG user space via `transform-box: view-box`? No — keep it simple: add `transform-box: fill-box;` NO. The rect animates within a 60-unit viewBox; CSS `translateY(48px)` on SVG children maps 1px = 1 user unit — correct here.)

Reduced-motion additions: `.rdz-scene__pin, .rdz-scene__pin-ripple { opacity: 1; transform: none; } .rdz-scene__pin-ripple { opacity: 0; } .rdz-scene__pay-shine, .rdz-scene__pay-ring, .rdz-scene__shield-scan { opacity: 0; }` (outline/check bases already rest drawn).

- [ ] **Step 4: Run tests** → PASS.
- [ ] **Step 5: Commit** — `feat(motion): Scene shield + pins + card bespoke scenes`

---

### Task 7: Stories rework — 8 groups, neutral copy, tone strategy demo

**Files:**
- Rewrite: `src/components/motion/Scene/Scene.stories.tsx`
- Test: `src/components/motion/Scene/Scene.test.tsx` (story-iteration test picks the new stories up automatically)

**Interfaces:** Consumes the full preset catalog + compound layers. Produces the showroom's "default example set". Stories may use inline styles.

- [ ] **Step 1: Rewrite the stories file** (complete file):

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FiZap, FiTarget, FiUsers, FiStar, FiGlobe, FiGift, FiFeather, FiSun, FiHeart } from 'react-icons/fi';
import { Scene, type ScenePreset, type SceneBg, type SceneTone } from './Scene';

const meta = {
  title: 'Components/Motion/Scene',
  component: Scene,
  parameters: {
    replay: true,
    docs: { description: { component: 'Animated card-thumbnail primitives. Presets are one-prop recipes built from exported `Scene.X` layers — compose your own when the recipes don\'t fit. Semantic `tone` × `bg` theming rides the design tokens; badge chips only render when supplied.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--space-4)' };
const card: React.CSSProperties = { overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-edge)', background: 'var(--panel)' };
const body: React.CSSProperties = { padding: 'var(--space-4)' };
const ic = { size: 40 } as const;

function Tile({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      {children}
      <div style={body}>
        <strong>{title}</strong>
        {desc && <p className="muted" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--fs-body-s)' }}>{desc}</p>}
      </div>
    </div>
  );
}

const ICON_TILES: { preset: ScenePreset; icon: React.ReactNode; title: string; desc: string }[] = [
  { preset: 'flash', icon: <FiZap {...ic} />, title: 'Instant', desc: 'Actions land the moment you click.' },
  { preset: 'rings', icon: <FiTarget {...ic} />, title: 'Reach', desc: 'Publish to every device at once.' },
  { preset: 'halo', icon: <FiSun {...ic} />, title: 'Focus', desc: 'One place for the work that matters.' },
  { preset: 'spark', icon: <FiStar {...ic} />, title: 'Highlights', desc: 'Surface the moments worth sharing.' },
  { preset: 'stars', icon: <FiHeart {...ic} />, title: 'Favourites', desc: 'Pin what your team loves.' },
  { preset: 'orbit', icon: <FiGlobe {...ic} />, title: 'Integrations', desc: 'Every tool in your stack, connected.' },
  { preset: 'pop', icon: <FiGift {...ic} />, title: 'Releases', desc: 'Ship updates on your own schedule.' },
  { preset: 'beam', icon: <FiUsers {...ic} />, title: 'Spotlight', desc: 'Put your best work front and centre.' },
  { preset: 'drift', icon: <FiFeather {...ic} />, title: 'Calm by default', desc: 'Quiet motion for serious surfaces.' },
];

const PRODUCT_TILES: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'chat', title: 'Support', desc: 'Conversations, resolved in-thread.' },
  { preset: 'terminal', title: 'Developer-first', desc: 'A CLI that keeps up with you.' },
  { preset: 'window', title: 'Templates', desc: 'Start from a page, not a blank file.' },
  { preset: 'shield', title: 'Security', desc: 'Protected by default, verified always.' },
  { preset: 'card', title: 'Billing', desc: 'Payments without the paperwork.' },
  { preset: 'pins', title: 'Logistics', desc: 'Know where everything is, live.' },
];

const DATA_TILES: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'trend', title: 'Growth', desc: 'Watch the numbers move up.' },
  { preset: 'gauge', title: 'Performance', desc: 'Fast, and measurably so.' },
  { preset: 'bars', title: 'Analytics', desc: 'Trends and breakdowns at a glance.' },
  { preset: 'grid', title: 'Coverage', desc: 'Every surface, accounted for.' },
  { preset: 'constellation', title: 'Network', desc: 'See how everything links up.' },
  { preset: 'route', title: 'Automation', desc: 'Flows that run themselves.' },
  { preset: 'waves', title: 'Audio', desc: 'Sound, visualised.' },
  { preset: 'stack', title: 'Compose', desc: 'Build pages from ready-made parts.' },
];

export const IconTiles: Story = {
  render: () => (
    <div style={grid}>
      {ICON_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} icon={c.icon} /></Tile>
      ))}
    </div>
  ),
};

export const ProductScenes: Story = {
  render: () => (
    <div style={grid}>
      {PRODUCT_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} /></Tile>
      ))}
    </div>
  ),
};

export const DataScenes: Story = {
  render: () => (
    <div style={grid}>
      {DATA_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} /></Tile>
      ))}
    </div>
  ),
};

/** The grid strategy: rotate a small tone palette across cards. */
export const Tones: Story = {
  render: () => {
    const rotation: SceneTone[] = ['accent', 'info', 'secondary', 'success', 'neutral'];
    const presets: ScenePreset[] = ['flash', 'chat', 'trend', 'orbit', 'shield'];
    return (
      <div style={grid}>
        {presets.map((p, i) => (
          <Tile key={p} title={String(rotation[i])} desc="tones[i % tones.length]">
            <Scene preset={p} tone={rotation[i]} icon={p === 'flash' || p === 'orbit' ? <FiZap {...ic} /> : undefined} />
          </Tile>
        ))}
      </div>
    );
  },
};

export const Backgrounds: Story = {
  render: () => (
    <div style={grid}>
      {(['gradient', 'solid', 'soft', 'none'] as SceneBg[]).map((bg) => (
        <Tile key={bg} title={bg}><Scene preset="flash" bg={bg} icon={<FiZap {...ic} />} /></Tile>
      ))}
    </div>
  ),
};

/** Layers compose freely — mix illustrations, decorations and chips. */
export const Composed: Story = {
  render: () => (
    <div style={grid}>
      <Tile title="Icon over waves" desc="Scene.Waves + Scene.Icon">
        <Scene tone="info"><Scene.Waves /><Scene.Icon motion="float"><FiGlobe {...ic} /></Scene.Icon></Scene>
      </Tile>
      <Tile title="Quiet spotlight" desc="Beam + soft halo">
        <Scene bg="soft"><Scene.Beam /><Scene.Halo strength="soft" /><Scene.Icon><FiSun {...ic} /></Scene.Icon></Scene>
      </Tile>
      <Tile title="Dense radar" desc="Rings ×5, fast">
        <Scene speed="fast"><Scene.Glow strength="soft" /><Scene.Rings count={5} /><Scene.Icon><FiTarget {...ic} /></Scene.Icon></Scene>
      </Tile>
    </div>
  ),
};

/** Chips are strictly opt-in — this is the only story that shows them. */
export const WithBadge: Story = {
  render: () => (
    <div style={grid}>
      <Tile title="Announcement"><Scene preset="pop" icon={<FiGift {...ic} />} badge="NEW" /></Tile>
      <Tile title="Live status"><Scene preset="rings" tone="danger" icon={<FiTarget {...ic} />} badge="LIVE" /></Tile>
      <Tile title="Composed chip">
        <Scene tone="success"><Scene.Trend /><Scene.Badge>+24%</Scene.Badge></Scene>
      </Tile>
    </div>
  ),
};

export const SquareRatio: Story = {
  name: 'Square ratio',
  render: () => (
    <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))' }}>
      <div style={card}><Scene preset="flash" ratio="1 / 1" icon={<FiZap {...ic} />} /></div>
      <div style={card}><Scene preset="gauge" ratio="1 / 1" /></div>
      <div style={card}><Scene preset="chat" ratio="1 / 1" /></div>
      <div style={card}><Scene preset="orbit" ratio="1 / 1" icon={<FiGlobe {...ic} />} /></div>
    </div>
  ),
};
```

(The old `Tinted` and `Illustrations` stories are superseded by `Tones`/`ProductScenes`/`DataScenes` — delete them.)

- [ ] **Step 2: Run the Scene test file** (story-iteration + axe render all new stories): `pnpm vitest run src/components/motion/Scene/Scene.test.tsx` → PASS.
- [ ] **Step 3: Visual check** — if the dev showroom is running, open `#/components/motion` and confirm: flush square-bottom thumbnails inside cards, no chips outside WithBadge, tones rotate. (Skippable in headless execution; the human partner reviews after.)
- [ ] **Step 4: Commit** — `feat(motion): Scene showroom — use-grouped stories, neutral copy, tone strategy`

---

### Task 8: Calm the Animations section demo

**Files:**
- Modify: `src/sections/Animations/Animations.tsx` (SCENE_CARDS, ~line 34)
- Test: existing section tests (`pnpm vitest run src/sections`)

**Interfaces:** Consumes the new preset catalog. No badge chips; neutral copy; shows two new scenes.

- [ ] **Step 1: Replace SCENE_CARDS**

```tsx
const SCENE_CARDS: { preset: ScenePreset; icon?: ReactNode; title: string; desc: string }[] = [
  { preset: 'flash', icon: <Icon name="sparkles" />, title: 'Instant', desc: 'Actions land the moment you click.' },
  { preset: 'orbit', icon: <Icon name="link" />, title: 'Integrations', desc: 'Every tool in your stack, connected.' },
  { preset: 'trend', title: 'Growth', desc: 'Watch the numbers move up.' },
  { preset: 'chat', title: 'Support', desc: 'Conversations, resolved in-thread.' },
  { preset: 'constellation', title: 'Network', desc: 'See how everything links up.' },
  { preset: 'route', title: 'Automation', desc: 'Flows that run themselves.' },
];
```

And in `AnimationsC`, drop the badge pass-through: `<Scene preset={c.preset} icon={c.icon} />` (remove `badge={c.badge}` and the `badge?: ReactNode` field).

- [ ] **Step 2: Run** `pnpm vitest run src/sections` → PASS.
- [ ] **Step 3: Commit** — `fix(sections): Animations demo uses calm neutral Scene defaults`

---

### Task 9: Docs, generated artifacts, full gates

**Files:**
- Modify: `CONTEXT.md` (~line 731 motion category description)
- Regenerate: `src/index.ts`, `catalog/llms.txt`

- [ ] **Step 1: Update CONTEXT.md** — motion bullet: describe Scene as "layered card-thumbnail primitives: ~23 presets (9 icon companions + 14 illustrations incl. bespoke trend/chat/terminal/window/gauge/shield/pins/card) that are recipes over exported `Scene.X` layers; semantic `tone` × `bg` theming over token triplets; badge chips strictly opt-in; renders flush (card clips it)". Also update the line-686 Vignette cross-reference if its wording still says "Scenes are product-supplied".
- [ ] **Step 2: Regenerate + validate**

```bash
pnpm validate:taxonomy && pnpm gen:barrel && pnpm gen:catalog
git diff --stat   # expect only src/index.ts / catalog/llms.txt churn (if any)
```

- [ ] **Step 3: Full gates**

```bash
pnpm build && pnpm test
```

Expected: both green (test includes the axe a11y sweep over every story).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(motion): Scene v2 — layered primitives, 23-preset catalog, semantic tone theming

Presets are now recipes over exported Scene.X layers; adds beam/drift
companions and 8 bespoke scenes (trend/chat/terminal/window/gauge/shield/
pins/card); semantic tone x bg treatments over token triplets; calm
neutral showroom; flush card rendering."
```

---

## Self-Review Notes

- **Spec coverage:** §1 model → T1+T3; §2 layers → T2; §3 catalog (9+14) → T3–T6; §4 theming (tone triplets, neutral via `--neutral-*`, grid rotation demo) → T1+T7; §5 calm defaults + flush corners + speed → T1, T7, T8; §6 stories → T7; §7 tests/gates/docs → every task + T9; consumers → T8 (Animations), Spotlight/Vignette stories unaffected (they don't pass `bg`).
- **Type consistency:** layer names/signatures declared in T2 "Produces" are the ones T3 recipes and T7 stories use; illustration component names (`SceneTrend`…`SceneCard`) consistent across T3 stubs and T4–T6 finals; `--rdz-scene-ink/-wash/-solid/-on` used identically in T1 SCSS and later blocks.
- **Known judgment calls:** `data-tone` omitted for the default accent tone; `--faint`→`--soft` rename; spark/star share one class family; SVG scan uses px≡user-unit translation. All intentional.
