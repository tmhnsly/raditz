# Raditz

The domain language of the Raditz component library. These terms name the
seams and modules the library is built from, so architecture reviews and refactors
speak the same way. Architecture vocabulary (module, interface, seam, adapter,
leverage, locality, depth) is defined separately in the
`improve-codebase-architecture` skill's LANGUAGE.md; this file names the *things*.

## Language

### Overlay layer

**Overlay**:
The internal module that renders any "thing in a fixed layer that opens, dismisses,
and disappears" — owning visibility-gating, dismissal, scroll-lock, focus, scrim,
and positioning behind one interface. Lives in `src/components/internal/`. It
portals to `<body>` so `position: fixed` stays viewport-relative even when an
ancestor (transform/filter/backdrop-filter) would otherwise become its containing
block; positions are passed to CSS as custom properties, not presentational styles.
_Avoid_: portal, popup, layer, modal (those name topologies or mechanisms, not the module).

**Topology**:
Which shape an **Overlay** takes, selected by its `position`: `centered` and `side`
are *modal* topologies (scrim + scroll-lock + focus-trap); `anchored` and `point`
are *anchored* topologies (positioned against a trigger or pointer, no scrim).
_Avoid_: variant, type, mode.

**Trigger**:
The element that opens an **Overlay** and the state-driver behind it (click for
Popover, hover timers for HoverCard, external control for Dialog). A *separate
concern* from the Overlay surface — it stays in each component, not in **Overlay**.
Now a real module (realized 2026-06-19): `useTrigger` (`internal/trigger.ts`) owns the
controlled/uncontrolled open state + the anchor ref + `toggle`/`close`, so faces stop
copy-pasting it. Faces drive it their own way — Popover/DropdownMenu/DatePicker
click→`toggle`, HoverCard hover-timers→`setOpen` (which restored HoverCard's lost
controllability). Deliberately NOT folded into Overlay (the surface stays separate from
what opens it — this honours the decision below, it just kills the duplication).
_Avoid_: anchor (the anchor is the ref **Overlay** positions against; the trigger is
what the user interacts with — often the same DOM node, but distinct roles).

**Adapter face**:
A public component (Dialog, Drawer, AlertDialog, Popover, HoverCard, CommandPalette,
…) that renders an **Overlay** with a fixed flag set plus its own presentation and
**Trigger**. The deep, narrow interface end users actually consume.
_Avoid_: wrapper, variant.

**Menu-surface** _(candidate #2)_:
The module that layers roving keyboard navigation and menu-item rendering *inside*
an **Overlay**, shared by DropdownMenu, ContextMenu, Menubar, and CommandPalette's list.
**Data-driven**: takes `items: MenuItem[]` (item content is `ReactNode`; nested `items`
reserved for submenus); the surface owns the array, so it assigns item refs and drives
roving itself — no context registration.
_Avoid_: dropdown, menu (those are adapter faces over it).

**Field** _(candidate #3)_:
The forms module that owns the label↔control↔description↔validity wiring
(`id`/`htmlFor`, `aria-describedby`, `aria-invalid`, `required`) and injects it into
its control child — not a structural wrapper. Injects via **cloneElement** into the
direct control child (existing controls untouched), with a **`useField()` context
fallback** for nested/custom layouts.
_Avoid_: form-group, form-control, wrapper.

### Shared internals (deepened 2026-06-19)

**Roving**:
The one stateful arrow-key navigation module — `useRoving` over the pure
`rovingIndex` (loop/orientation/Home/End). Menu-surface, Combobox, CommandPalette
and ToggleGroup adapt it; NavBar uses `rovingIndex` directly. Tree keeps its own
2D expand/collapse nav; RadioGroup roves natively. TimePicker (3 columns) and
DatePicker (calendar grid) trap arrows with a thin DOM-focus rover +
`preventDefault` — the **freeze boundary** that stops arrows scrolling the page
while the picker is open (a 2D column/grid that `useRoving`'s single index can't model).
_Avoid_: per-component arrow handlers (except the picker freeze above).

**Scale**:
Pure chart geometry (`minMax`, `normalize`, `toPercent`, `sparklinePath`,
`donutDashes`) in `internal/scale.ts`. BarChart, Donut, Sparkline and Progress
call it instead of inlining math in JSX — so the math is unit-tested.
_Avoid_: in-closure scaling math.

**Page-model**:
Pure paging math in `internal/pageModel.ts` — `pageCount` + `buildPages` (the
ellipsised page list, used by Pagination) plus `pageSlice` + `pageRange` (the current
page's rows and its 1-based "from–to of total" label, used by DataTable). Genuinely
shared now: both call it instead of inlining slice/clamp/window math (DataTable used to
only call `pageCount` and hand-roll the rest).

**Table-model** (deepened 2026-06-19):
The pure logic behind DataTable, in `internal/tableModel.ts`: the sort comparator
(`compareValues` — type-aware, nullish-last in **both** directions) + `sortRows` +
`nextSort` (the asc→desc→off header-click cycle), and the selection algebra
(`toggleSelected`; `togglePage` — select-all-on-page that preserves off-page picks;
`pageSelectionState` — the header checkbox's all/some/none tri-state). DataTable is now
a thin **adapter** wiring React state to this + the **Page-model**, so the comparator's
null/locale edges and the selection algebra are unit-tested instead of hiding in JSX.
_Avoid_: re-implementing sort/select state inside a component.

**SectionShell** _(showcase infra, `src/lib`)_:
The one home for section layout — Frame + `.s-pad` + `.s-wrap` (where the responsive
container-query lives) + optional **SectionBackground** (+ `scrim` → on-dark, + an
optional floating `nav` slot for the hero-bleed effect). Sections are content + a
shell choice. **HeroBleed** is now a thin *preset* of SectionShell (gradient + nav
+ media-scrim defaults), not its own Frame/background/padding stack. Variants take
`props: SectionVariantProps` and **spread** them (`background="…" {...props}`),
keeping a curated backdrop default without re-threading 4 props each. Navbar
(ref/data on the wrap) stays bespoke. The dead per-section gallery aggregates
(`export function Hero()` etc.) were removed (2026-06-19): each variant's label lives
once, as its story `name`, and the explorer renders the `.variant`/`.variant__tag`
gallery from the stories — one source, no drift.

**Search**:
The shared search input (`forms/Search`) + the `fuzzyFilter` matcher, used by
Combobox, CommandPalette and the explorer so every search looks/behaves alike.

**Overlay internals** (split 2026-06-19):
`overlayHooks.ts` is now a thin re-export barrel over one file per concern —
`useDismiss`, `useFocusTrap`, `useScrollLock`, `overlayPosition` (`useOverlayPosition`),
`useRovingMenu` — and the barrel documents the combination contract (`<Overlay>` calls
position → scroll-lock → focus-trap → dismiss; dismiss defers its outside listener so the
opening click never self-dismisses). The dead `useAnchoredPosition` (a verbatim duplicate
of `useOverlayPosition`) and the zero-caller `onActivate` / `composeRefs` seams were
deleted (one adapter = hypothetical seam; zero = delete).

**Pure cores** (extracted 2026-06-19):
Form-control logic that used to hide in JSX closures now lives in tested pure modules,
the same play as **Scale** / **Page-model**: `internal/datetime.ts` (calendar math for
DatePicker), `internal/format.ts` (`formatBytes`), and co-located `OneTimePasswordField/
otp.ts`, `TagInput/tags.ts`, `Form/validate.ts`. Each control is the thin consumer; the
high-leverage `useControllableState` finally has tests, and Rating's fractional fill
reuses the `clamp` primitive.

**Source-surface** (deepened 2026-06-21):
`scripts/public-surface.mjs` is the one module that answers "which dirs are public
(has-a-story rule) and where their component/story/test files live" — a single
`sourceSurface()` walk with fully-resolved paths. `gen-barrel`, `gen-catalog`, and
`gen-tests` are thin **adapters** over it. Killed 4 duplicated tree-walks and the
basename≠dirname fragility. The walk is unit-tested (sanity bounds, file-existence, and barrel-agreement); byte-identical generated output is gated by `release:preflight`.
_Avoid_: per-script dir scans.

**Style-aggregation** (deepened 2026-06-22):
`src/styles/components.ts` and `src/styles/sections.ts` are eager `import.meta.glob`
aggregators — every component `.scss` and every section's co-located `.css` is pulled
in by pattern, not a hand-written list. Killed the "add a stylesheet, forget to
register it → silently missing from `dist/raditz.css`" footgun (the old hand-list had
no agreement test). Cascade safety: `_shared.scss` (leading `_`) and
`internal/Overlay.scss` sort first; everything else is component-/section-scoped, so
inter-file order is irrelevant, and no `.scss` `@use`s another. The app, Storybook, the
explorer, and the CSS build all import these two aggregators — one source of truth.
Section styles are now **co-located** (`src/sections/<Name>/<Name>.css` beside the
`.tsx`, matching components); `sections.css` keeps only the cross-section utilities
(page shell, `.s-pad`/grids, gap/center modifiers, the gradient-card rule).
_Avoid_: hand-maintained `import './X.scss'` lists; a section's CSS in a far-away file.

**Icon is server-renderable** (2026-06-22): `Icon` has no event handlers or hooks, so
it carries no `'use client'` — its react-icons (Lucide) graph never forces a client
boundary onto otherwise-static consumers. A *clickable* icon belongs in an interactive
control (`IconButton`/`Button`). _Avoid_: an `onClick` on `Icon` (re-adds the directive).

**Section-action** (deepened 2026-06-21):
`SectionActionButton` (in `lib/SectionShell`) is the one **renderer** from a
`SectionAction` to a `<Button>` — forwards `href`/`onClick`/`icon`/`variant`/`size`.
`SectionActions` maps it over the actions array. Every section CTA crosses this seam,
so field-forwarding is **tested once** (killed the recurring dropped-`onClick`/`icon`
bugs). `AnnouncementA`'s banner text-link is the one deliberate non-Button — its
exception is documented in its story.
_Avoid_: per-section Button renders from a raw `SectionAction`.

**Section-header** (deepened 2026-06-21):
`SectionHeader` (in `lib/SectionShell`) is the shared eyebrow+heading block —
`eyebrow2` label + `h-section` heading, with the wrapper class as a prop. Used by
Features, Stats, and Team. Bare `<h2>` and bespoke headers stay **per-section**
(deletion test: forcing them through `SectionHeader` would worsen locality). `SectionShell`
is now **deep** on three concerns: layout (Frame/`.s-pad`/`.s-wrap`), header
(`SectionHeader`), and section-action rendering (`SectionActionButton`). The
`children ?? body` override stays an in-variant idiom (see [ADR-0001](docs/adr/0001-section-body-override-stays-in-variant.md)).
`SectionHeader` also takes an optional `align` (`'start' | 'center'`) so a section can
offer a left or centred heading variant; CtaA/PricingA wire the same `align` into their
own wrap. Defaults preserve each section's current look, so a build can mix centred/left
sections for page rhythm.
_Avoid_: per-section eyebrow+heading duplication.

**Section variant cores** (internal seams, deepened 2026-06-21; NavCore re-unified 2026-06-22):
`NavCore` (shared by NavbarA/B/C; NavbarD is its own thing), `TierCard`
(PricingA/B — reuses `SectionActionButton`), and `LogoMark` (SocialProofA/B)
collapse the variant clones: one core to fix, variants are thin **presets**.
These are private internal seams — not exported. `NavCore`'s interface carries
two **behavioural** toggles, not just class strings — `animatedLinks` (render the
sliding active indicator `NavLinks` vs plain links) and `showToggle` (ship a
`ColorSchemeToggle`) — so the glass-pill `NavbarA` (default) is a preset that
switches them on, NOT a fork. (It briefly forked when the pill was added; the
open-state + sheet + burger wiring is back in one core.)
_Avoid_: copy-paste variant bodies; forking a variant when the core only varies CSS — widen the core's interface instead.

**Palette-resolution** (deepened 2026-06-21; interface 2026-06-22):
`themeVars(state)` in `lib/theme` is the pure accent→CSS-var map (gray pairing, the
`COMPLEMENT` secondary, the pick-away semantic scales, light-accent on-accent text,
radius factor); `applyTheme(state)` is a thin DOM adapter over it (CSS vars +
`data-motion`/`-title-anim`/`-reveal` attributes). Both take the theme axes as an
**options object** (`Partial<ThemeState>`; omitted fields fall back to `DEFAULTS`) — the
old positional list grew brittle and mis-orderable as axes were appended (motion → title
→ reveal), and an object adds an axis without touching a call site. Palette rules stay
unit-tested (not buried in a `setProperty` loop). Public export via `'raditz'`.
_Avoid_: positional param lists that grow one arg per axis; setProperty loops that can't be tested standalone.

**paddedDomain** (in *Scale*, deepened 2026-06-21):
Shared chart y-domain padding + the `TOOLTIP_FLIP_PCT` threshold, in `internal/scale.ts`.
LineChart (factor 0.12) and ScatterChart (factor 0.08) consume it — each keeps its own
factor, documented and not unified (the values differ intentionally).
_Avoid_: per-chart domain/tooltip-flip math.

**Sidebar-model** (in `explorer/registry`, deepened 2026-06-21):
`ancestorsOf` / `filterTree` / `allBranchIds` — the "what's visible/expanded for this
query/route" logic, now beside the registry it operates on and covered by `registry.test.ts`.
_Avoid_: expanding/filtering logic spread across the Sidebar render tree.

**sliderTicks** (in *primitiveUtils*, deepened 2026-06-21):
Interior tick geometry for Slider, in `internal/primitiveUtils.ts`. Unit-tested for
the uneven-step / non-zero-min edges.
_Avoid_: tick math inlined in the Slider render.

(Lightbox is now an **Adapter face** over **Overlay**, alongside Dialog/Drawer/etc.)

## Relationships

- An **Adapter face** renders exactly one **Overlay** and supplies its own **Trigger**.
- An **Overlay** has one **Topology** (its `position` discriminant).
- **Menu-surface** renders an **Overlay** (`focus: 'none'`) and adds roving inside it.
- Modal topologies (`centered`/`side`) default to scrim + scroll-lock + focus-trap;
  anchored topologies (`anchored`/`point`) default to none of those.

## Overlay interface (agreed 2026-06-19)

- One internal `<Overlay>` render component; existing components become **Adapter faces** over it.
- `position` is a **discriminated union** (`anchored` | `point` | `centered` | `side`) so
  illegal param combinations don't typecheck.
- Dismissal is two independent booleans (`dismissOnEscape`, `dismissOnOutside`) plus an
  `ignore` ref for the trigger. `scrim` is independent of `dismissOnOutside`
  (AlertDialog = scrim present, outside-dismiss off).
- `focus: 'trap' | 'auto' | 'none'` — roving is **not** here; it belongs to **Menu-surface**.
- `<Overlay>` renders the scrim itself.
- All geometry lives in one `useOverlayPosition` (today's `useAnchoredPosition`, generalized).
- No exit-transition state machine — render when `open`, unmount when not (matches current behavior).

## Example dialogue

> **Dev:** "Does AlertDialog need its own outside-click code like it has today?"
> **Maintainer:** "No — it's an **Adapter face**. It renders an **Overlay** with
> `dismissOnOutside={false}`. The `overlayRef`-vs-`panelRef` trick goes away; the
> intent becomes one honest flag."
> **Dev:** "And the keyboard arrows in a DropdownMenu?"
> **Maintainer:** "That's **Menu-surface**, layered inside the **Overlay** — the
> **Overlay** itself only knows `focus: 'none'` there."

## Color token naming (decided 2026-06-19)

Semantic colour tokens are **semantic-first**: each concept owns a coherent set —
`--info`, `--info-ink`, `--info-surface` (likewise success/warning/danger). We do
**not** rename the tints to `--surface-info` etc., because that would split one
concept across two namespaces and blur the line with the *neutral* surface roles
(`--surface`, `--surface-strong`), which are a different thing (neutral fills, not
semantic tints). This mirrors Radix: a scale owns its step roles; the alias owns its
concept's roles. _Avoid_: `--surface-info`, `--surface-success`.

### Theming (deepened 2026-06-19)

**Color-scheme**:
Light vs dark resolution — one rule (explicit stored choice wins, else follow the OS
via `prefers-color-scheme` and **live-follow** it; toggling back to the OS's current
value clears the override; only an override is persisted under `rdz-color-scheme`),
behind **two faces** that share the key/query/precedence in `lib/colorScheme.ts`
(server-safe, no `'use client'`):
- the **runtime** face `useColorScheme` (`src/lib`) — a shared singleton store
  (`useSyncExternalStore`, resets on zero subscribers) so a `ThemeRuntime` default-setter
  and any nav `ColorSchemeToggle` stay in sync instead of fighting `class="dark"`.
- the **pre-paint** face `colorSchemeScript(defaultScheme)` — the no-flash `<head>`
  string, so the SSR flash-guard can't drift from the runtime rule. Templates/products
  call it instead of hand-writing the IIFE.
_Avoid_: `useDarkMode` (removed — a boolean can't express "follow system"); a second
copy of the resolution rule as an inline script string.

**Surface context**:
How a region declares its colour context. Two named contexts:
- **`.dark`** — flips the whole app (Radix scales self-scope to `.dark`, and the
  semantic aliases resolve against the root scales). It is **root-only**: a `.dark`
  on a *subtree* flips raw scales but NOT the resolved semantic tokens
  (`--text → --neutral-12 → --slate-12` is substituted at `:root`), so text doesn't
  change. (This trap caused a real bug; do not claim `.dark` works on a subtree.)
- **`.rdz-on-dark`** — the subtree-safe context for content over dark media/scrim:
  re-points the *semantic* tokens (`--text`, rules, `--accent-surface`, …) to the
  `--on-media` (white-alpha) family in **one level**, so it works anywhere.

The `.rdz-btn--glass` CTA is intentionally frosted-**dark** in both themes (black-alpha
fill + `--on-media` ink) because it lives over hero media/gradients — a `--bg`-tinted
glass + `--text` ink went invisible in light mode (read fine in dark).
_Avoid_: applying `.dark` to a region (use `.rdz-on-dark`); hardcoding white text.

**Layer** (deepened 2026-06-19):
The stacking order — one ladder of `--z-*` rungs in `public/tokens/layout.css` is
the single source of truth. Every globally-stacked element (overlays, app chrome,
drawer/scrim, nav) references a rung; never a raw z-index. Rungs:
`base < content < overlay-local < raised < sticky < nav < scrim < drawer < popover
< modal < toast`. Components may still use 0/1/2 for *local* stacking inside their
own isolation context — that's not part of the global ladder. All modal **Adapter
faces** share one `.rdz-overlay` container at `--z-modal`, and their panels (Drawer,
Dialog, CommandPalette) stack *locally* above the shared scrim via the **named**
`--z-overlay-local` rung — not a bare `1` (the magic numbers read like leaks). The
`--z-scrim` / `--z-drawer` rungs are reserved for a future app-level off-canvas drawer;
no such component exists today (the Overlay unification superseded them).
_Avoid_: raw z-index numbers in app/section CSS (they collide — that caused a bug).

## Sections are content-driven (completed feat/adaptable-sections)

All 18 marketing sections (`Hero`, `Features`, `Pricing`, `Footer`, `Cta`, `Stats`,
`Testimonials`, `TestimonialCarousel`, `SocialProof`, `Blog`, `Faq`, `Team`,
`Announcement`, `Comparison`, `Newsletter`, `NotFound`, `Marquee`, `Navbar`) are
content-driven: pass real copy via props, not via child JSX or placeholder literals.

**Content model** (one interface per section type, shared by all its variants):
- `SectionBaseProps` — `background`, `parallax`, `image`, `video`, `scrim`, `children`
  (the optional override slot). `scrim` darkens an `image`/`video`/gradient backdrop
  and switches content to on-dark tokens — required to use `image` as a legible
  full-bleed section background behind copy.
- `SectionAction` — `{ label, href?, onClick?, variant?, size?, icon? }` (shared by
  every section that emits buttons).
- Per-section required essentials (e.g. `HeroProps.title`) + optional rest
  (e.g. `eyebrow`, `lede`, `actions`, `media`); item-arrays use named types
  (`FeaturesItem`, `PricingTier`, `StatItem`, `Testimonial`, …).
- `children` is always an override slot: when provided, it replaces the
  auto-rendered body, so bespoke layouts stay possible without forking a variant.
- `align?: 'start' | 'center'` (Features, Stats, Cta, Pricing) — opt-in alignment
  variant; defaults preserve each section's current look so a page can alternate
  centred/left for rhythm rather than every section sharing one alignment.

Demo copy lives exclusively in stories (`.stories.tsx`); the components carry no
placeholder strings. Specs + implementation plans: `docs/superpowers/specs/` +
`docs/superpowers/plans/`.

### Page composition & nav (revised 2026-06-22; preview-frame inverted 2026-06-22)

- **Preview-frame seam (inverted).** `Frame` is now **flat / edge-to-edge by default** —
  the real-page case, so composing a page needs no incantation and a forgotten wrapper
  no longer makes every section look like a rounded card. The bordered, rounded, shadowed
  catalog "card" is **opt-in** preview chrome via **`.rdz-preview`**, added by the explorer's
  variant wrapper (`StoryView`) and the Storybook decorator. `.rdz-page` no longer *flattens*
  anything; it just pins the nav sticky and tidies page rhythm (`.rdz-page .frame` stays
  explicitly flat so a page previewed inside `.rdz-preview` wins). The next/vite templates
  still wrap in `.rdz-page` for the sticky nav.
- **`NavbarA` is the default nav** and a **preset** over `NavCore` (see Section variant
  cores): a compact floating **glass pill** (transparent frame, blurred) with the animated
  route-aware active indicator (`NavLinks`, reads `location.pathname` or an `activeHref`
  prop) and a built-in `ColorSchemeToggle`. NavbarB/C/D unchanged.
- **Bespoke full-bleed bands** in a product use **`SectionShell`** (`background`/`image`/
  `scrim` + arbitrary children) — it owns the `.s-pad`/`.s-wrap` padding+container so a
  product never hand-writes those internal layout classes.
- **Hero bleed (`.rdz-bleed`, added 2026-06-22)**: add `rdz-bleed` alongside `rdz-page` to
  float the nav (fixed) over the first section so the hero background reaches the very top —
  no nav "band". The first section gets top clearance (`--rdz-bleed-top`); anchored sections
  get `scroll-margin-top`. Opt-in (fixed escapes an in-explorer page preview, so the sticky
  default stays for previews).
- **Buttons over media (fixed 2026-06-22)**: under `.rdz-on-dark` (a `scrim`'d section),
  `primary` (accent), `soft`, `outline` and `glass` already stay legible; `secondary` used
  to vanish (its `--text` fill went white over a `--bg` ink that stays light) — it now
  renders as a solid white pill with dark ink. So no CTA goes invisible on a photo; `glass`
  remains the premium over-media button.
- **Background rhythm** (a build-time discipline, not a component): choose section
  `background`s for FLOW — hero gets the media/one gradient, content sections stay
  `none`/`surface`, reserve a gradient or accent band for ONE mid-page emphasis + the closing
  CTA. Never two different gradients adjacent. Documented in the catalog header so every
  Raditz build sees it. See [[design-aesthetic-fullbleed]].

### Animation (added 2026-06-21)

**Reduced-motion**:
`useReducedMotion` (`internal/`) — SSR-safe `prefers-reduced-motion` hook for
JS-gated entrances (skip the hidden state, don't just shorten it). Its CSS
counterpart: the reduced-motion block in `_shared.scss` now zeroes the motion
TOKENS themselves (`--motion-scale` etc., as `data-motion="none"` does), so every
token-driven duration — including new animated components — goes instant for free.
SectionBackground's parallax effect also bails early when reduced.
_Avoid_: per-component reduced-motion selector lists for token-driven animation.

**Reveal** (scroll entrance):
`useInView` (`internal/`, one IntersectionObserver, `once` by default — its whole
lifecycle lives in the ref callback, NOT a `useEffect`, so StrictMode's simulated
unmount can't disconnect-and-orphan it) under `useRevealState` (`internal/`, the shared
reduced-motion + in-view gate returning `{ ref, revealed, reduced }` — `Reveal` AND
`TextReveal` build on it so the reveal contract lives in one place) + the
`Reveal` / `RevealGroup` components (`components/utility/Reveal`). Opt-in entrance —
fade / rise / scale / zoom / blur / slide / flip / flip-y / rotate / skew — on scroll-in;
RevealGroup auto-staggers children via a pure-CSS per-item delay. Transform/opacity/
filter only. The hidden state rides custom properties (`--rdz-reveal-tf` …) so a variant
only SETS a property and `.is-in` (which zeroes the real properties) always wins — no
specificity war between an explicit `anim` and the app-wide default. With no `anim` it
inherits the global `data-reveal` vibe (fallback `fade-rise`). Sections opt in via a
prop (e.g. `FeaturesA animate`), never by default (stays SSR-pure).
_Avoid_: scroll-event entrance handlers; baking reveal into every section.

**Icon** (revised 2026-06-22 — now react-icons-backed):
`components/foundation/Icon` renders a named icon (`<Icon name="instagram" size="1.25rem"/>`)
from ONE consistent set — the registry (`icons.ts`) maps each name to a **react-icons
(Lucide)** component, sized by a single `size` prop. This **reverses** the earlier
"dependency-free icons" decision: `react-icons` is now a real library `dependency`
(externalised in the lib build, tree-shaken per icon). Reason: the hand-drawn SVG registry
was limited (no brand logos) and visually inconsistent (mixed fills/weights); the user
chose library-wide react-icons. Add an icon = import its `Lu*` glyph + add a name.

**AnimatedIcon**:
`components/utility/AnimatedIcon` — wraps any icon (a Raditz `<Icon>`, a react-icons glyph,
raw SVG) in a looping idle animation (float/orbit/pulse/spin/wiggle) or a one-shot `draw`
(stroked icons). Icon-agnostic (styles its child only). GPU-promoted so the loop composites smoothly.

**Animation config — vibes + axes** (`lib/theme`):
Three app-wide axes set as `<html>` attributes by `applyTheme` (parallel to
`data-motion`): `data-title-anim` (`TITLE_ANIMS` → animates every `.h-display`/
`.h-section`/`.rdz-heading` on mount) and `data-reveal` (`REVEALS` → the default for
every `<Reveal>`). A `vibe` (`VIBES` + `VIBE_PRESETS`) is the headline pick — one
choice sets a coordinated `{ reveal, titleAnim, motion }` personality (Minimal /
Kinetic / Editorial / Playful); the individual axes stay overridable. `useTheme`
exposes `setVibe`/`setReveal`/`setTitleAnim`; ThemePicker has Vibe + Reveal + Title
controls. All default-safe (`none`/`fade-rise`) and CSS-driven, so a heading/reveal
follows the app's vibe with zero per-instance wiring.
_Avoid_: per-section heading/reveal animation props; a second motion system.

**TextReveal** (kinetic headlines):
`components/utility/TextReveal` + the `splitText` helper (`internal/`). Splits a string
into per-word/char spans that cascade in (flip / rise / fade / blur / mask). A11y-safe:
the full text renders once in a visually-hidden span and the fragments are `aria-hidden`,
so AT reads the heading normally. Opt-in for hero/feature headlines (not the global
title config).
_Avoid_: animating split text without the screen-reader copy.

**MotionCard** (preset card):
`components/surfaces/MotionCard` — a ready-made brand-colored animated card composing
`Card` + `Reveal` + `AnimatedIcon` + `CardArrow`. `tone` variants pull the system
gradient/accent/secondary/glass/mono tokens (theme-safe pastels); reveals on scroll;
clickable (`href`) cards get the arrow + auto `target=_blank` for external links. The
exported "drop-in polished card" so products don't re-wire the primitives.

**CardArrow** (clickable affordance):
`components/utility/CardArrow` — the consistent clickable-card arrow: a horizontal `→`
for in-site links, an up-right `↗` for external ones, with a subtle `--duration-fast`
nudge on host hover/focus (add `rdz-card-arrow-host` to the wrapper). Replaces the Blog
editorial row's ad-hoc arrow.

The `Sections/Animations` showcase composes it all (reveal-variant grid with a Replay
control, title + TextReveal gallery, AnimatedIcon cards, MotionCard presets) so it's
viewable/tunable in the explorer.

## Distribution system

The library ships as:
- **Built package** — `dist/` (ESM, tree-shaken) + `raditz/styles.css` (all tokens,
  section CSS). Import from `'raditz'`; import the stylesheet once at the app root.
- **Generated catalog** — `catalog/llms.txt` (human + LLM reference; regenerate with
  `pnpm gen:catalog`); `pnpm gen:barrel` keeps `src/index.ts` current.
- **Starter templates** — `templates/next/` and `templates/vite/`; scaffold a new
  product via `/raditz-new` (global skill).
- **Release tooling** — `pnpm release:preflight` gates drift; `/release` skill cuts a
  tagged version; `/raditz-promote` publishes to a consumer.
- **Product customisation** — brand via `theme.css` (override `--accent-*` tokens) or
  `useTheme({ accent })`; set `DEFAULT_SCHEME` in `app/theme-runtime.tsx`; set an
  app-wide animation vibe via `data-reveal`/`data-title-anim` on `<html>` (fixed) or
  by passing the axes to `useTheme({ reveal, titleAnim })` (live).
- **Published CSS is wrapped in `@layer raditz`** (post-build `scripts/wrap-css-layer.mjs`,
  run by `build:pkg`). Cascade layers make a consumer's UNLAYERED `theme.css` override win
  regardless of bundler import order — so brand `:root { --accent-* }` needs no `:root:root`
  specificity trick and no guaranteed load order. Storybook/explorer use source SCSS, so
  they're unaffected. (Decided 2026-06-22, replacing the `:root:root` plaster.)

### New from the beats-dj-studio test build (2026-06-22)
The product surfaced library gaps; these were fixed IN the library, not plastered:
- **`FeaturesTabbed`** section — vertical tab rail + steady-height detail panel
  (lead/rates → description → ticked features → CTA). For a few rich, comparable
  offerings where cards bury the detail; switching tabs never reflows the page.
- **`ImageFocus`** section — one full-bleed image block for both a media **hero** (nav
  bleeds over it) and an inline band; `size`/`align`/`place`/`titleSize` configure the text.
- **`CheckList`** (typography) — the ticked "what's included" list (1–2 col), so products
  stop hand-rolling `ul + icon + grid`.
- **`Form` gained `select` + `when`** — `type:'select'` (with `options`) and a `when(values)`
  predicate render+validate a field conditionally (e.g. "Other → please specify"). `Select`
  now forwards its ref so the Form reads its validity.
- **`MotionCard` icons rest static, animate on hover** (not a continuous loop) — looping
  icons are noise in a grid of info cards.
- **Nav** is the floating glass pill with a SELECTED-route sliding pill + a separate hover
  state; collapses to a burger via a viewport media query (the fixed bar confounds the
  container query). The next template ships a `ScrollToTop` (top-on-route-change).
- **Consumer primitives** — `useInView`, `useReducedMotion`, `useControllableState`,
  `cx`, `splitText` re-export from `'raditz'` (via `lib/hooks`) so a product builds its
  own animated / controllable / class-composed components on the same primitives the
  library uses, instead of reimplementing them.

## Flagged ambiguities

- "anchor" vs "trigger" — resolved: the **Trigger** is what the user interacts with to
  open; the *anchor* is the ref the **Overlay** positions against. Often the same node,
  distinct roles.
- "modal" was used for both a topology and the Dialog component — resolved: modal is a
  **Topology** class (`centered`/`side`); Dialog is an **Adapter face**.
- "semantic surface" vs "neutral surface" — resolved: `--<concept>-surface` is a semantic
  tint; `--surface*` are neutral fills. Different roles, kept in separate namespaces.
