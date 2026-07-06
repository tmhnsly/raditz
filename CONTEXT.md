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

**Presence** (exit animations, adopted from Base UI/Radix, 2026-07-05):
`internal/usePresence(open, ref)` keeps an overlay mounted through its close
animation. Overlay renders while `mounted` (not `open`) and sets `data-state`
`open`/`closed` on the panel + container; each surface's stylesheet keys an exit
animation off `[data-state="closed"]` (the `rdz*Out` keyframes in `_shared.scss`),
and the hook unmounts once the panel's animations finish — or immediately if there
are none (jsdom/SSR) or reduced-motion collapses them. Intent-driven behaviour
(scroll-lock, focus, dismissal) still keys off `open` and releases the instant a
close is requested; only the visual lingers. Menu focus-return guards therefore
also reclaim focus when it's still inside the *closing* menu, not only when
stranded on `<body>`.

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
copy-pasting it. Its open-state core is **`useOpenState`** (`internal/`, extracted
2026-07-02) — the one place the DS naming convention (`open`/`defaultOpen`/`onOpenChange`
→ `useControllableState`) is pinned; the anchorless modal faces (Dialog, Drawer,
AlertDialog, CommandPalette, Lightbox, ContextMenu) consume it directly since
`useTrigger`'s anchor/toggle baggage doesn't fit them. (Menubar stays hand-wired:
its open state is the open menu's INDEX, not a boolean — a generic shim would
re-create what the shim exists to hide.) Faces drive it their own way — Popover/DropdownMenu/DatePicker
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
DatePicker (calendar grid) trap arrows via **`useGridFocus`** (`internal/`,
deepened 2026-07-02) — the one DOM-focus 2D rover behind the **freeze boundary**
that stops arrows scrolling the page while a picker is open (a 2D column/grid
that `useRoving`'s single index can't model; both pickers used to hand-roll it).
Its `strategy` is `{ kind: 'grid' }` (live `grid-template-columns` row jumps —
DatePicker) or `{ kind: 'columns' }` (sibling-column hops — TimePicker).

**Calendar** (`inputs/Calendar`, extracted 2026-07-03) is the ONE month surface —
the `.rdz-calendar` panel (drill-up day→month→year, arrow paging, grid roving).
DatePicker and DateRangePicker are thin triggers that render it inside an
{@link Overlay} (the panel is positioning-only `.rdz-overlay__panel`; Calendar
carries the visual chrome, so the extraction is DOM/byte-compatible — the
DatePicker suite passes unmodified). One `Calendar` handles both modes: single
(`value`/`onValueChange`, ISO) or range (any `range` prop switches it —
`onRangeChange` fires `from` then `to`, swapping if the second pick precedes the
first, previewing the span on hover). Dates are ISO `YYYY-MM-DD` strings
throughout the family (`DateRange = { from?, to? }`); the range band bridges the
2px grid gap with box-shadows (endpoints are `is-selected` discs, mid days
`is-in-range`). `autoFocus` (the pickers pass it) grabs grid focus on open;
standalone Calendars don't steal focus.
An ARIA role that implies keyboard is a CONTRACT: the 2026-07-02 consistency pass
found Tabs (`tablist`), Rating (`radiogroup`) and Toolbar (`toolbar`) shipping the
role with no arrows at all (axe can't see this) — all three now implement the
pattern (Tabs/Rating via `rovingIndex`/`onKeys`; Toolbar as a thin live-queried
DOM-focus rover because its children are arbitrary) with behaviour tests.
_Avoid_: per-component arrow handlers; a second DOM-focus rover; a roving-pattern
role without its keyboard.

**Searchable-list** (deepened 2026-07-02):
`useSearchableList` (`internal/`) — the one owner of the filter-and-rove listbox
glue: query state + `fuzzyFilter` + the `useRoving` highlight (reset on typing/
pick) + the full `combobox`/`aria-activedescendant` → `listbox` → `option` aria
contract, exposed as spreadable prop bags. Combobox and CommandPalette are thin
faces over it (extracting it gave CommandPalette the listbox semantics it had
drifted away from). The input-shaped popover *trigger* deliberately stays
per-component — see [ADR-0005](docs/adr/0005-popover-input-triggers-stay-per-component.md).
_Avoid_: hand-wiring query/active/aria around `fuzzyFilter` + `useRoving`.

**Status-tone** (deepened 2026-07-02):
`internal/statusTone.ts` — the ONE semantic-status vocabulary (`StatusTone`:
accent/neutral/info/success/warning/danger, `FeedbackTone` for the icon-bearing
four), the tone→icon map (`STATUS_TONE_ICON`, moved out of Banner) and
`statusToneRole()` (danger → `alert`, rest → `status`). Banner, Badge, Callout,
Toast, AlertDialog and EmptyState keep their existing public prop NAMES
(`tone`/`color`/`variant` — unchanged APIs) but all type them against this union
(or an `Extract<>` subset), so the vocabulary can't fragment again. Toast keeps
its hardcoded `role="status"` (switching danger toasts to `alert` would change
DOM output).
_Avoid_: a per-component tone/color/variant union; a second tone→icon map.

**Chart-tip** (in *Scale*'s family, deepened 2026-07-02):
`internal/ChartTip.tsx` + `internal/ChartAxis.tsx` — the tooltip overlay
(`div.rdz-chart__tip`, `data-side` from the pure `chartTipSide()` flip at
`TOOLTIP_FLIP_PCT`, positioned via `--rdz-tip-x/y` custom properties) and the
axis tick labels, shared by LineChart and ScatterChart. The pure geometry lived
in `internal/scale.ts` but the bug-prone *callers* (flip + pixel positioning)
were copy-pasted per chart; now the charts are thin adapters.
_Avoid_: per-chart tooltip/axis JSX.

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

**Control ownership** (deepened 2026-07-02):
A control's markup/class contract belongs to the control — in-library consumers
import it, never re-express it. `Checkbox` gained `indeterminate` so DataTable's
header tri-state uses the real component instead of an inlined copy of its markup;
the `rdz-btn rdz-btn--*` literals in AlertDialog/Form/DataTable's pager were
replaced with `<Button>` (which owns that class scheme and carries no `'use client'`).
Sections obey the same rule: Hero/Pricing badges are real `<Badge>`s and the
Cta/Newsletter email captures are real `<Input>`s (were hand-written `rdz-badge`/
`rdz-input` class strings).

**API conventions** (pinned 2026-07-02, machine-gated):
- The value callback is **`onValueChange(value)`** everywhere (Slider, RadioGroup,
  Tabs, ToggleGroup, Accordion, Rating, Combobox, the pickers, TagInput,
  FileDropzone, OTP/PasswordToggle…). Never re-declare native `onChange` with a
  non-event signature — wrapper-rooted inputs `Omit` it; native-rooted inputs pass
  the real event `onChange` through.
- Every public component accepts `className` (merged onto the root) and spreads
  rest props; input primitives forward refs to their native control. SECTIONS TOO
  (2026-07-02): `SectionShell` forwards `className`/`id`/`data-*`/rest to its root
  Frame (this subsumed the short-lived `frameData` prop), and `SectionBaseProps`
  carries them explicitly (not full HTMLAttributes — its `title: string` would
  collide with sections' `title: ReactNode` content props), so every variant takes
  an anchor `id`/`data-testid`/one-off class. Gated by `src/api-contract.test.tsx`
  — two passes: composed STORIES with a sentinel-className override (args-blind
  `render: () =>` stories auto-skip by function arity, a mechanical fact) + a
  component FLOOR over every barrel export; all skips are named per-component
  facts with staleness guards, not surface bookkeeping — and `src/ref-contract.test.tsx`.
- The release spine is ONE command: `pnpm release:gate` = preflight (taxonomy,
  barrel/catalog drift, use-client no-op) → `build:pkg` → `check-consumer` (dist
  RSC/styles/tree-shaking) → full test suite. The `/release` skill calls it; only
  version/changelog/tag remain human steps.
- Accessible names ride native `aria-label` through the rest spread — never a
  bespoke `ariaLabel` prop (the charts' one was removed).
- `size` is `'sm' | 'md' | 'lg'`.
- **Element composition** (`render` prop, Base UI model, 2026-07-05): interactive
  controls take an optional `render` — a React element or `(props, state) =>
  element` — to swap the underlying element (a router `<Link>`, a `<label>`, …)
  while the design-system class, data-attributes, handlers and children merge onto
  it. Powered by internal `useRender` + `mergeProps`/`composeRefs` (className cx's,
  style merges, matching handlers chain, refs compose, base children win). Button
  and IconButton resolve their element through ONE path (`render` → `href` `<a>` →
  `<button>`). `useRender`/`mergeProps`/`composeRefs` are re-exported from
  `lib/hooks.ts` so products can build their own polymorphic components. Supersedes
  reaching for `asChild`.
- Overlay faces support BOTH modes: controlled `open`/`onOpenChange` and
  uncontrolled `defaultOpen` (Dialog/Drawer/AlertDialog/CommandPalette gained it;
  ContextMenu/Menubar gained the controlled side; Tooltip's hover state is
  deliberately internal). Closing must return focus to the trigger (DropdownMenu/
  Menubar were stranding it — fixed with tests).
- **Variant wiring** (decided 2026-07-02): an ENUMERATED one-of-N axis rides a
  data attribute (`data-variant`/`data-size`/`data-color` for the status-tone
  axis/`data-side`/`data-orientation`/`data-tone`/`data-anim`/`data-bg`/
  `data-axis`/`data-layout`/`data-density`/`data-place`/`data-position`), styled
  as `.rdz-x[data-variant='primary']` — same specificity as a class, but an
  attribute holds exactly ONE value (conflicting modifiers unrepresentable),
  reads as semantics in devtools, and doubles as a consumer styling hook.
  Always set the resolved value (defaults included); omit only a "none" sentinel
  (Toast's `default`). BOOLEAN modifiers stay classes (`is-in`, `is-collapsed`,
  `rdz-card--col`, `rdz-secbg--scrim`); block/element names stay classes (BEM);
  `cx` merges block + booleans + consumer className, nothing else.
- Style rules are gated by `scripts/style-contract.test.mjs`: no inline styles
  setting real properties (custom `--rdz-*` props only; allowlisted SVG paint-server
  refs), no z-index outside the ladder/0-2, README counts match `sourceSurface()`,
  and no `` `x--${…}` `` template class modifiers in shipped tsx (an enum template
  = the data-attribute rule regressed).
_Avoid_: hand-written `rdz-btn`/`rdz-check`/`rdz-badge`/`rdz-input` class strings;
copying a sibling component's markup because its interface is one prop too narrow —
widen the interface.

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
reuses the `clamp` primitive. Extended 2026-06-25 to the two heaviest entangled cores:
`Lightbox/gestures.ts` (the pinch/pan/swipe/dismiss geometry + the swipe-vs-dismiss axis
rule, paging/close thresholds, scrim fade, pan-clamp math — was a 394-line gesture machine
reachable only by simulating multi-touch; Lightbox is now the thin adapter feeding
DOM-measured numbers in) and `Form/formModel.ts` (the conditional-field rules — `isVisible`,
the one-source `visibleFields`, and the "hiding a field clears its stale error" prune — were
inline across Form's change/submit/render closures). Co-located one-component cores, not
shared utils; deletion test passes (the logic reappears in the consumer if removed).

**Source-surface** (deepened 2026-06-21):
`scripts/public-surface.mjs` is the one module that answers "which dirs are public
(has-a-story rule) and where their component/story/test files live" — a single
`sourceSurface()` walk with fully-resolved paths. `gen-barrel`, `gen-catalog`, and
`gen-tests` are thin **adapters** over it. Killed 4 duplicated tree-walks and the
basename≠dirname fragility. The walk is unit-tested (sanity bounds, file-existence, and barrel-agreement); byte-identical generated output is gated by `release:preflight`.
**`shippedSourceFiles()`** (added 2026-07-02) is its flat-file face — the shipped
.ts/.tsx surface (components + sections + **lib**, minus stories/tests/d.ts). The
`add-use-client` codemod walks it (no more hand EXTRA list — the lib strays
ColorSchemeToggle/InView are covered by construction) and `check-consumer` verifies
directives in dist over the SAME list; `add-use-client.test.mjs` gates the
missing-directive class (every CLIENT_RE-matching shipped file carries the directive
or sits on the reasoned, staleness-guarded `SERVER_SAFE` allowlist — colorScheme.ts
and SectionShell.tsx, both server-safe by design).
The **a11y gate** (`src/a11y.test.tsx`) is the browser-side adapter of this surface
(deepened 2026-07-02): it globs components AND sections stories and axe-checks EVERY
composed story (197 at last count — it used to check only components' first stories,
so all 22 sections were invisible to it). It can't import the Node-only walk, so
`scripts/a11y-surface.test.mjs` asserts its glob patterns cover every story file
`sourceSurface()` reports — the mirror can't silently shrink. Skips are per-story,
per-rule, commented (`SKIPPED_RULES` — only SectionBackground's `<video>` autoplay
rule today, a jsdom limitation).
_Avoid_: per-script dir scans; an a11y glob that doesn't mirror the source surface;
globally disabled axe rules.
(The three remaining `readdirSync` walks — `public-surface`'s structured 2-level walk,
`add-use-client`'s all-files walk, `watch`'s per-dir watcher walk — are deliberately NOT
unified: they differ in return shape and one is a cold fallback, so a shared walker would
be a one-real-caller seam whose interface ≈ its implementation. See [ADR-0004](docs/adr/0004-script-tree-walks-stay-separate.md).)

**Taxonomy-grammar** (deepened 2026-06-25):
`scripts/taxonomy.mjs` is the ONE definition of how a component folder, its showroom
story title, and its slug relate: the `CATEGORIES` table (category → TitleCase segment),
`expectedTitle` (folder → title), `titleSegments`/`kebab`/`slugForTitle` (title → slug),
and `humanize`. Pure (no `fs`/Vite/DOM), so it crosses the Node↔browser format boundary —
`validate-taxonomy` and `public-surface` (Node release pipeline) AND `explorer/registry.ts`
(Vite, via `allowJs` + JSDoc types) consume the SAME grammar. Before, the validator owned
folder→title while the registry independently re-derived title→slug (`kebab`/`humanize`
inline) and blindly trusted `meta.title`; the showroom tree could drift from the rule the
release gate enforces. Now the tree is built from the grammar the gate checks. Unit-tested
in `scripts/taxonomy.test.mjs`.
_Avoid_: re-deriving the title/slug rule per consumer; an inline `kebab` in the registry.

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
exception is documented in its story. (Since 2026-07-02 a handler-only action
there renders a `<button>` with the same `sx-ann__link` styling — an `<a>`
without `href` isn't focusable; the look is unchanged.)
_Avoid_: per-section Button renders from a raw `SectionAction`.

**Section-header** (deepened 2026-06-21; adopted catalog-wide 2026-07-02):
`SectionHeader` (in `lib/SectionShell`) is the shared eyebrow+heading block —
`eyebrow2` label + `h-section` heading, with the wrapper class as a prop (and a
`headingClassName` passthrough for heading-level visual hooks like `sx-cta__title`).
Its default heading level is **h2** and every section heading routes through it
(Features, Stats, Team, Spotlight, FeaturesTabbed, Animations, Testimonials,
TestimonialCarousel, Faq, Blog, Comparison, Pricing, NotFound, Cta), so sibling
sections on one page share one coherent outline level — a heading-coherence test
in `SectionShell.test.tsx` renders the variants and asserts every `.h-section`
is an H2 (per-item `h3`s, e.g. FeaturesC cards, are correctly subordinate).
Genuinely bespoke headers may stay per-section (deletion test), but "bespoke"
now means structure, not a hand-typed `<h2/h3 className="h-section">`. `SectionShell`
is **deep** on three concerns: layout (Frame/`.s-pad`/`.s-wrap`), header
(`SectionHeader`), and section-action rendering (`SectionActionButton`). The
`children ?? body` override stays an in-variant idiom (see [ADR-0001](docs/adr/0001-section-body-override-stays-in-variant.md)).
`SectionHeader` also takes an optional `align` (`'start' | 'center'`) so a section can
offer a left or centred heading variant; CtaA/PricingA wire the same `align` into their
own wrap. Defaults preserve each section's current look, so a build can mix centred/left
sections for page rhythm.
_Avoid_: per-section eyebrow+heading duplication; a hand-rendered `h-section` heading;
mixed h2/h3 section headings on one page.

**Section variant cores** (internal seams, deepened 2026-06-21; NavCore re-unified 2026-06-22; +2 cores 2026-07-02):
`NavCore` (shared by NavbarA/B/C; NavbarD is its own thing), `TierCard`
(PricingA/B — reuses `SectionActionButton`), `LogoMark` (SocialProofA/B),
`TestimonialFigure` (in `lib/SectionShell` — the avatar+name/role attribution
row shared by TestimonialsA/B and TestimonialCarousel's figcaption; wrapper class
+ `as` element as props), and `FeatureCard` (in `Features.tsx` — the
icon+title+description card body behind FeaturesA and both bento shapes; its
`descSize` prop makes the compact bento cell's caption size an explicit choice,
ending the drifted per-copy type classes)
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

**Active-slug** (in `explorer/activeSlug`, deepened 2026-07-02):
The one owner of "which slug is active and why" in the showroom. It used to have
two racing writers (a route-sync effect vs the scroll-spy's per-frame callback —
a hash navigation could be overwritten by the jump's own scroll frame). Now a
pure, clock-free state machine: a route change is a **navigation intent** that
holds against scroll **observations** until an observation fulfils it (the target
— or, for a group target, any entry under it) or the settle window (`SETTLE_MS`)
passes (i.e. the user really scrolled away). `useActiveSlug` is the thin hook;
`pageRows.ts` (the page's pre-order flatten) and `anchors.ts` (the `.sec[id]`
/ `.page-group[id]` anchor-and-selector contract StoryView renders and the spy
queries) are its extracted, tested siblings.
_Avoid_: a second writer of the active slug; string-literal `.sec`/`page-group`
class/selectors outside `anchors.ts`.

**Sidebar-model** (in `explorer/registry`, deepened 2026-06-21; expansion split 2026-06-25):
`ancestorsOf` / `filterTree` / `allBranchIds` — the "what's visible/expanded for this
query/route" logic, beside the registry it operates on and covered by `registry.test.ts`.
The Sidebar's *expansion* set algebra now lives in `explorer/expansion.ts` (`initialExpanded`
compositions-open/components-collapsed/route-opened, `reconcileExpanded` scroll-spy
close-behind-you, `openBranch`) — pure (ancestor paths passed in, so no `registry` glob
dependency) and unit-tested in `expansion.test.ts`, instead of tangled across the Sidebar's
initializer + scroll-spy effect + onSelect closure.
_Avoid_: expanding/filtering logic spread across the Sidebar render tree.

**Scroll-spy** (in `explorer/scrollSpy`, deepened 2026-06-25):
`activeSection(sections, line)` — the pure pick of "which section the reader is on":
the deepest `.sec` whose top has crossed an activation line a quarter down the
viewport, or `''` (Overview) above them all. `StoryView`'s `useScrollSpy` now
recomputes it from live geometry every scroll frame (rAF-throttled `scroll`/`resize`),
replacing an IntersectionObserver that reported only its *changed-entries* batch's
first still-intersecting target — a stateless-but-stale pattern that could hold the
wrong breadcrumb under fast scroll or post-lazy-mount reflow ("gets stuck"). The
geometry recompute can't stick; the pick is unit-tested in `scrollSpy.test.ts`.
_Avoid_: a scroll-spy that only updates on IntersectionObserver state *changes*.

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
behind **three faces** that share the key/query/precedence in `lib/colorScheme.ts`:
- the **runtime** face `useColorScheme` (`src/lib`) — a shared singleton store
  (`useSyncExternalStore`, resets on zero subscribers) so a `ThemeRuntime` default-setter
  and any nav `ColorSchemeToggle` stay in sync instead of fighting `class="dark"`.
- the **pre-paint** face `colorSchemeScript(defaultScheme)` — the no-flash `<head>`
  string, so the SSR flash-guard can't drift from the runtime rule. Templates/products
  call it instead of hand-writing the IIFE.
- the **pre-render** face `initColorScheme(defaultScheme)` (added 2026-07-02) — the
  callable for apps with no server-rendered `<head>` (a Vite SPA renders nothing until
  React mounts): call it at the top of `main.tsx` before `render()`. The vite template
  does; `colorScheme.test.ts` runs the callable and the eval'd script string through the
  same precedence cases so the faces can't drift.
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
inherits the global `data-reveal` style (fallback `fade-rise`). Sections opt in via a
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

**Animation config — coordinated reveal + title** (`lib/theme`, reworked 2026-06-24):
App-wide `<html>` attributes set by `applyTheme` (parallel to `data-motion`):
`data-reveal` (`REVEALS` → the default for every `<Reveal>`) and `data-title-anim`
(`TITLE_ANIMS` → animates every `.h-display`/`.h-section`/`.rdz-heading` on mount).
The two are **tied**: `reveal` is the single control and the title entrance is
DERIVED from it via `REVEAL_TITLE` (e.g. `flip`→`scale`, `blur`→`blur-in`), so the
heading and scroll reveal always stay stylistically in step — they can't drift.
`useTheme` exposes `setReveal` (and a read-only derived `titleAnim`); ThemePicker has
one "Animation" control. (The old `vibe` preset layer + the independent `setTitleAnim`
were removed — coordination is now intrinsic, not a preset you can break.) All
default-safe (`fade-rise`→`fade-up`) and CSS-driven, zero per-instance wiring.
_Avoid_: per-section heading/reveal animation props; setting title + reveal apart; a second motion system.

**Section content choreography** (`lib/SectionShell` + `lib/InView`, added 2026-06-24; spec in `docs/superpowers/specs/2026-06-24-section-animation-choreography-design.md`):
Every section choreographs its WHOLE content, not just the heading. `SectionShell`'s `animate` picks the trigger: `'scroll'` (the default, also `true`) routes content through `InView` — a thin client wrapper that toggles `is-in` when the section enters view — and the staggered cascade is pure CSS (`.s-choreo`); `'load'` is a pure-CSS MOUNT keyframe (`.s-load` / `@keyframes rdz-section-in`) that plays at first paint with NO observer/hydration wait (so it can't blank above-the-fold content) and even runs without JS — **heroes (A/B/C) default to `'load'`** for exactly this reason; `false` is static. Both modes share `--s-tf` (the hidden transform from the app-wide `data-reveal` axis — curated to fade / fade-rise / rise / scale; others fall back to fade-rise; `none` off) and `--s-stagger` (rides `data-motion`). Scroll mode suppresses the heading's standalone `data-title-anim` (it's in the cascade); load mode keeps it (the heading wins by specificity). Sections that drive their own reveals (Features/Spotlight/Animations) or shouldn't choreograph (Marquee/Announcement) pass `animate={false}`.
- **SSR-pure with zero consumer wiring**: the reveal/choreo hidden state is gated by `@media (scripting: enabled)` (in `Reveal.scss` + `sections.css`). JS on → hide+animate; no-JS/crawler → `scripting: none` → content renders visible; old browsers without the feature → visible, un-animated. No `html.js` script, no FOUC.
- **Smooth**: GPU transform/opacity only; the permanent `will-change` on every reveal was REMOVED (it left a standing compositor layer per reveal); transitions auto-composite.
- **Cinematic media motions** (all reduced-motion-safe, scripting-gated): image/video backdrops **scale-settle** 1.06→1 (`SectionBackground.scss`); **`CountUp`** (`components/display/CountUp`) rolls stat numbers 0→value on view (final value is the SSR/reduced/a11y value, prefix/suffix preserved) — wired into `Stats`; the featured **Pricing** tier scale-pops; card media scales in via the `.sx-media-reveal` clip utility (on `Team` photos).
_Avoid_: hiding section content unconditionally (breaks SSR — always gate on `scripting`); a permanent `will-change`; per-element reveal wrappers when the section-level cascade suffices.

**TextReveal** (kinetic headlines):
`components/utility/TextReveal` + the `splitText` helper (`internal/`). Splits a string
into per-word/char spans that cascade in (flip / rise / fade / blur / mask). A11y-safe:
the full text renders once in a visually-hidden span and the fragments are `aria-hidden`,
so AT reads the heading normally. Opt-in for hero/feature headlines (not the global
title config).
_Avoid_: animating split text without the screen-reader copy.

**Card tones + Vignette + Spotlight** (preset cards; replaced MotionCard 2026-06-24):
- **`Card.tone`** — `MotionCard` is gone; its six treatments are now a `tone` prop on
  the base `Card` (`accent`/`secondary`/`aurora`/`dusk`/`glass`/`mono`). Each tone sets
  the `--card-ink` (eyebrow/icon) and `--card-arrow` (CardArrow pop) **pairing custom
  properties** so a card's accents complement its tone (a secondary card's arrow is
  primary; an accent card's ink is neutral). `.rdz-card__eyebrow/__icon/__title/__body/
  __arrow` consume them; `.rdz-card--col` is the content-column layout.
- **`Vignette`** (`components/surfaces/Vignette`, was `Thumbnail`) — a toned visual area
  holding a product-supplied animated `scene`. It plays the scene ONCE on scroll-reveal
  (`useInView`) and again whenever `replay` changes (a host card bumps it on hover): the
  scene is remounted via a `key` so its one-shot CSS animation restarts — **never loops**.
  `bg` is a preset background treatment (plain/gradient/accent/secondary/mono/aurora).
- **`Spotlight`** (`sections/Spotlight`) — the reusable animated-thumbnail-card section:
  a `RevealGroup` grid of cards, each = `Card` tone + `Vignette` + title/text + top-right
  `CardArrow`; the card owns the hover→replay token. Scenes are product-supplied (e.g.
  beats ships bespoke DJ-deck / two-figure-coaching / camera scenes).

**CardArrow** (clickable affordance):
`components/utility/CardArrow` — the consistent clickable-card arrow: a horizontal `→`
for in-site links, an up-right `↗` for external ones, with a subtle `--duration-fast`
nudge on host hover/focus (add `rdz-card-arrow-host` to the wrapper). Replaces the Blog
editorial row's ad-hoc arrow.

The `Sections/Animations` showcase composes it all (reveal-variant grid with a Replay
control, title + TextReveal gallery, AnimatedIcon cards, Card-tone presets) so it's
viewable/tunable in the explorer.

The explorer's per-variant **Replay** control is opt-in: a story sets
`parameters: { replay: true }` (read by `src/explorer/registry.ts`) and only then does
the preview render the remount button — motion components and animated sections carry
it; static previews stay clean. Demo imagery comes from `src/demos/images.ts` — one
curated, verified Unsplash set (+ a seeded `placeholderImage()` via Lorem Picsum);
stories never inline raw image URLs because individual Unsplash photos get deleted
upstream and 404 years later. The library itself never hard-codes imagery.

## Component taxonomy (single source of truth, reorganised 2026-06-24)

Every public component lives at `src/components/<category>/<Name>/`. The **folder is the
single source of truth**: the public API path (`gen:barrel` → `src/index.ts`), the catalog
grouping (`gen:catalog`), and the test scaffold all read it. A story's `meta.title` is
**derived** from the folder as `Components/<TitleCase(category)>/<Name>` and validated by
`scripts/validate-taxonomy.mjs`, so the explorer showroom tree (built from titles) can
never drift from the folders. The validator is wired into `release:preflight` (a drifted
title or an unknown category blocks a release) and the test suite
(`scripts/validate-taxonomy.test.mjs`); it prints the per-category counts (don't hand-count).

The **13 categories** (each crisp + non-overlapping; counts from the validator):
- **actions** (5) — controls that act on activation: Button, IconButton, CopyButton, Toggle, ToggleGroup.
- **inputs** (24) — value entry bound to form state: Input/Textarea/Select/Combobox, Checkbox, Radio(+Group), Slider, Switch, NumberInput, the pickers (Calendar, DatePicker, DateRangePicker, Time/DateTime), Rating, Search, TagInput, Field, Fieldset, Form…
- **display** (7) — small non-interactive inline visuals: Badge, Pill, Chip, Timeline, CountUp, Icon, AccessibleIcon.
- **feedback** (5) — status / progress / transient notices: Spinner, Skeleton, Progress, Toast, Banner.
- **typography** (9) — text + screen-reader primitives: Heading, Text, Prose, Code, Kbd, Eyebrow, CheckList, Label, VisuallyHidden.
- **layout** (11) — space-arranging primitives: Container, Grid, Stack, Section, SectionBackground, FullBleed, Popout, AspectRatio, ScrollArea, Separator, AppShell.
- **surfaces** (7) — content-bearing planes: Card, Callout, Vignette, Avatar, AvatarGroup, CardArrow, EmptyState.
- **overlay** (12) — floating/fixed layers (the Overlay adapter faces, incl. menus): Dialog, Drawer, BottomSheet, AlertDialog, Popover, HoverCard, CommandPalette, Tooltip, ContextMenu, DropdownMenu, Menubar, Lightbox.
- **navigation** (9) — wayfinding: NavBar, NavigationMenu, Breadcrumb, Pagination, Tabs, Stepper, Tree, Toolbar, PageHeader.
- **disclosure** (2) — show/hide in place: Accordion, Collapsible.
- **data** (8) — viz + tables: DataTable, BarChart, LineChart, ScatterChart, Donut, Sparkline, Legend (shared empty-state via ChartEmpty), Meter (scalar measurement gauge vs Progress's task completion; threshold `segments`).
- **media** (3) — image/gallery content: Carousel, Gallery, Marquee.
- **motion** (4) — entrance/animation primitives: Reveal, TextReveal, Animate (modular preset lib for any element), Scene (layered card-thumbnail primitives: ~23 presets — 9 icon companions incl. beam/drift + 14 illustrations incl. bespoke trend/chat/terminal/window/gauge/shield/pins/card — each a recipe over exported `Scene.X` layers, composable as children when no recipe fits; semantic `tone` (accent/secondary/success/warning/danger/info/neutral, raw-colour escape hatch) × `bg` treatment (none/soft/gradient/solid) over token triplets; `speed` scales `--motion-scale` locally; badge chips strictly opt-in; renders flush like an `<img>` — the card clips it). (AnimatedIcon removed — superseded by Animate/Scene; Scene is the generic counterpart to the bespoke-scene [[surfaces]] Vignette.)

A component may sit under a different SHOWROOM top bucket via `TITLE_EXCEPTIONS` in the
validator (only `layout/AppShell → Pages/App shell` today). The pre-reorg categories
`controls`, `forms`, `foundation`, `menu`, `patterns`, `utility` are **retired** — don't
re-create them; the shared, non-public `MenuSurface` now lives in `components/internal/`.
_Avoid_: a new top-level component folder outside the 13 (the validator rejects it); a
hand-written story title that doesn't match its folder; hand-counted member lists.

## Distribution system

The library ships as:
- **Built package** — `dist/` (ESM, tree-shaken) + `raditz/styles.css` (all tokens,
  section CSS). Import from `'raditz'`; import the stylesheet once at the app root.
- **Generated catalog** — `catalog/llms.txt` (human + LLM reference; regenerate with
  `pnpm gen:catalog`); `pnpm gen:barrel` keeps `src/index.ts` current.
- **Starter templates** — `templates/next/` and `templates/vite/`; scaffold a new
  product via `/raditz-new` (global skill).
- **Release tooling** — `pnpm release:preflight` gates drift (taxonomy, barrel, catalog,
  and — since 2026-07-02 — the **RSC boundary**: it runs `codemod:use-client` and blocks
  if any source was missing its directive, so a promoted component that gained hooks
  can't ship server-broken; the codemod's heuristic is pinned in
  `scripts/add-use-client.test.mjs`, incl. its known string-literal over-marking).
  `check-consumer` asserts EVERY `'use client'` source keeps its directive in `dist/`
  (was one hardcoded file). `/release` skill cuts a tagged version; `/raditz-promote`
  publishes to a consumer.
- **Template parity gate** — `scripts/templates-parity.test.mjs`: the templates' shared
  scripts stay byte-identical, both templates wire a colour-scheme pre-paint, and the
  raditz pin placeholder (`github:tmhnsly/raditz#REPLACE_WITH_TAG`, the ONE canonical
  string) matches across both templates and the literal `/raditz-new` find-and-replaces.
  The catalog's advertised utility classes are gated against the shipped CSS in
  `scripts/gen-catalog.test.mjs` (this caught `.eyebrow`/`.container` advertising
  classes that don't exist — it's `.eyebrow2`, and containers ship as `.rdz-container`).
- **Product customisation** — brand via `theme.css` (override `--accent-*` tokens) or
  `useTheme({ accent })`; set `DEFAULT_SCHEME` in `app/theme-runtime.tsx`; set an
  app-wide animation style via `data-reveal` on `<html>` (fixed; `data-title-anim`
  is derived from it) or by passing `useTheme({ reveal })` (live; title follows).
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
- **Card animations play once, on reveal + hover — never loop** (looping is noise in a
  card grid): `Vignette` remounts its scene to replay it; `Spotlight` drives the hover.
  (Superseded the interim `MotionCard` hover-unfreeze, now removed.)
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
