# Scene v2 — layered primitives, expanded catalog, tone theming

**Date:** 2026-07-06 · **Status:** approved design, pre-implementation
**Component:** `src/components/motion/Scene/` (category `motion`)

## Problem

Scene's current presets read as a purpose-specific (gamified) set, not a neutral
multi-purpose thumbnail kit:

1. The showroom presents badge chips ("4 PTS", "+1 PT", "LIVE") on most tiles and
   uses game-flavoured copy, so the *default impression* is cluttered/niche even
   though `badge` is technically opt-in.
2. `.rdz-scene` sets `border-radius: inherit` + `overflow: hidden`, so inside a
   rounded card it inherits all four corners and clips its own wash — the
   thumbnail floats as a rounded rect instead of sitting flush like a normal
   card image.
3. Presets are monolithic recipes; a project can't mix its own scene from the
   underlying decorations, and the catalog is thin for common product uses
   (analytics, chat, dev tools, security, commerce…).
4. Colour is ad-hoc: `tone` takes a raw CSS colour, and `bg='secondary'`
   conflates hue with background treatment. There's no strategy for theming a
   grid of scene cards coherently.

## Design

### 1. Model — presets are recipes over exported layers

`Scene` stays the canvas (`bg`, `tone`, `ratio`, `fill`, `paused`, new `speed`).
Two mutually exclusive modes, enforced in the prop types (discriminated union —
`preset` XOR `children`):

```tsx
// one-liner recipe (existing call sites unchanged)
<Scene preset="rings" icon={<FiTarget />} />

// composed from the same layers
<Scene bg="gradient" tone="info">
  <Scene.Glow />
  <Scene.Rings count={3} />
  <Scene.Icon><FiZap /></Scene.Icon>
  <Scene.Badge>NEW</Scene.Badge>   {/* only renders when you add it */}
</Scene>
```

Every preset is implemented by rendering the same exported layer components —
one source of truth. The SCSS moves from `[data-preset=…]` selectors to
layer-modifier classes; keyframes are reused as-is where they exist.

### 2. Layer components (compound, `Scene.X`)

Decoration layers (frame a hero icon):

| Layer | Props | Notes |
|---|---|---|
| `Scene.Icon` | `motion?: 'none'\|'flash'\|'bob'\|'pulse'\|'spin'\|'float'` | hero glyph; `spin` = slow rotate (gears/globes), `float` = drift + soft shadow |
| `Scene.Glow` | `strength?: 'soft'\|'full'` | throbbing radial glow |
| `Scene.Rings` | `count?: number` (default 3) | expanding rings |
| `Scene.Halo` | — | breathing disc |
| `Scene.Sparks` | `shape?: 'spark'\|'star'`, `count?: number` | merges today's spark/stars |
| `Scene.Orbit` | `count?: number` | orbiting dot rings |
| `Scene.Beam` | — | soft diagonal light sweep behind the icon |
| `Scene.Badge` | children | one-shot popping chip — **never rendered by any preset** |

Illustration layers (self-contained, usable full-canvas or mixed behind an
icon/badge): `Scene.Bars`, `Scene.Waves`, `Scene.Grid`, `Scene.Constellation`,
`Scene.Route`, `Scene.Stack` (existing) + the eight new ones in §3.

### 3. Expanded catalog — ~23 presets

Icon companions (9): `flash`, `rings`, `halo`, `spark`, `stars`, `orbit`, `pop`,
**`beam`** (Beam + Icon), **`drift`** (Icon float + faint Halo — the quietest,
enterprise-calm option).

Illustrations (14): existing `bars`, `waves`, `grid`, `constellation`, `route`,
`stack`, plus eight new bespoke SVG scenes for regular product-card uses:

| Preset | Shows | Regular use |
|---|---|---|
| `trend` | line chart drawing upward, soft area fill, pulsing end-dot | analytics, growth |
| `chat` | message bubbles popping in staggered, typing-dots on the last | support, messaging, AI |
| `terminal` | window chrome + prompt line typing with blinking caret | dev tools, CLIs, APIs |
| `window` | browser frame, skeleton content blocks shimmering in | builders, templates, dashboards |
| `gauge` | arc meter sweeping to ~70% with glowing tip | performance, scores |
| `shield` | shield outline drawing on, check fading in, one scan pass | security, compliance |
| `pins` | dotted map fragment, two pins dropping with ripples | location, logistics |
| `card` | payment-card silhouette, shine sweep + tap ripple | commerce, billing |

Construction rules for bespoke scenes (same as `route`/`constellation`): token
inks only, `cqmin` sizing, `vector-effect: non-scaling-stroke`, every loop rides
`--motion-scale`, and base styles form a legible resting frame under
`prefers-reduced-motion`. Stylish and tasteful: few strokes, generous negative
space, one focal motion per scene — no busy multi-part loops.

### 4. Colour theming strategy — semantic `tone` × background treatment

Two orthogonal axes, both resolving to the existing token triplets
(`--<tone>`, `--<tone>-ink`, `--<tone>-surface`, `--on-<tone>`):

- **`tone`** picks the hue family:
  `'accent' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'`
  — or any raw CSS colour string as an escape hatch (behaves like today's
  `tone`, ink-only). `secondary` maps to the accent-2 (gold) triplet; `neutral`
  maps to the vendored Slate scale (`--slate-9/11/3`). Default `'accent'`.
- **`bg`** picks the treatment: `'none' | 'soft' | 'gradient' | 'solid'`.
  `gradient` washes with the tone's `-surface`; `solid` fills with the tone base
  and flips ink to `--on-<tone>`. (Today's `bg='accent'` → `solid`;
  `bg='secondary'` is removed — that hue now comes from `tone="secondary"`.)

Internally the resolved tone sets three custom properties
(`--rdz-scene-ink`, `--rdz-scene-wash`, `--rdz-scene-solid` + on-colour) that
every layer and wash reads — so badge ink, glow alpha, and washes all cohere
from a single `tone` choice, and dark mode follows the tokens for free.

**Grid strategy (documented, not automated):** pick one tone per product area,
or rotate a small palette across a card grid
(`tones[i % tones.length]` with e.g. `['accent','info','secondary','success']`).
The showroom demonstrates the rotation; no auto-rotation magic in the API.

### 5. Calm, neutral defaults + normal-card appearance

- No preset renders a badge; showroom copy becomes neutral/multi-purpose;
  badges appear in exactly one "With badge" story. The `Animations` section
  demo follows the same restraint.
- Drop `border-radius: inherit` — Scene renders flush with square corners like
  an `<img>` thumbnail; the parent card's `overflow: hidden` does the clipping.
  Internal `overflow: hidden` stays so marks clip to the canvas.
- `speed?: 'slow' | 'normal' | 'fast'` on `Scene` scales `--motion-scale`
  locally (≈1.6 / 1 / 0.7) so one card can be calmer or livelier than the app.

### 6. Showroom / stories — default example scenes per use

Stories group the catalog by use with neutral copy, doubling as the "default
example set" a consuming project copies from:

1. **Icon tiles** — the 9 companions on realistic feature cards.
2. **Product scenes** — chat/terminal/window/shield/card/pins.
3. **Data scenes** — trend/gauge/bars/grid/constellation/route/waves/stack.
4. **Tones** — one grid showing the tone rotation strategy.
5. **Backgrounds** — none/soft/gradient/solid.
6. **Composed** — layer mixing (illustration + badge, icon over waves…).
7. **With badge** — the only story that shows chips.
8. **Square ratio** — compact tiles.

### 7. Testing & verification

- Existing tests keep passing through the preset path.
- New tests: composed scenes render their layers; presets render the same marks
  as their layer-recipe equivalents (spot-check 2–3); badge absent unless
  supplied; semantic `tone` sets the expected custom properties; raw-colour
  `tone` still works; axe gate over all new stories.
- Gates: `pnpm validate:taxonomy`, `pnpm gen:barrel && pnpm gen:catalog`,
  `pnpm build`, `pnpm test`.
- Docs: CONTEXT.md + `catalog/llms.txt` updated in the same change.

### Consumers / breaking changes

Pre-1.0; blast radius is internal: `Animations` section (preset+icon+badge —
still valid), `Spotlight`/`Vignette` stories. Only breaks: `bg='accent'` →
`bg='solid'` and `bg='secondary'` → `tone="secondary"`; both only appear in
Scene's own stories. `SceneBg`/`ScenePreset` types stay exported; new
`SceneTone` type added.

## Out of scope

- Auto-rotation of tones in the API (documented pattern only).
- Interactive/hover-triggered scenes (Scene stays decorative, `aria-hidden`).
- Self-hosted fonts, Vignette changes, or other motion components.
