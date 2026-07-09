# Changelog

All notable changes to Raditz are recorded here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); versions are git tags `vX.Y.Z`.

## [Unreleased]
- **Fixed: Lightbox controls lost their frosted-glass visibility.** The panel
  restyle (`0ad4816`) turned the shared overlay discs (`rdz-oclose`/`rdz-ovbtn`)
  into outline-only buttons — right for Dialog/Drawer, but over a busy photo the
  outline vanishes. The frosted treatment (white-alpha fill + `--glass-blur` +
  `--on-media` icon colour) is restored scoped to `.rdz-on-dark`, so Lightbox
  chrome and hero-scrim discs read again while panels keep the plain outline.
- **Fixed: Carousel dot indicator glitched during paging.** Clicking a dot (or
  autoplay/arrows) set the active dot immediately, but the scroll-spy kept
  re-deriving the nearest slide from every frame of the 460ms smooth scroll —
  yanking the pill back to the origin and walking it through each intermediate
  dot, restarting its width transition every step. The spy now stands down while
  a programmatic scroll owns the track (`animating` ref) and still tracks
  user-initiated swipes/trackpad scrolls.
- **Fixed: production app build silently dropped all component/section CSS.**
  package.json `sideEffects: ["**/*.css"]` declared every non-CSS source file
  pure — including the side-effect-only style barrels (`src/styles/components.ts`,
  `sections.ts`) — so Rollup tree-shook them out of `pnpm build` and the deployed
  showroom lost every `rdz-*` style (dev was unaffected; Vite doesn't tree-shake
  there, which is why it looked fine locally). Root fix: `src/styles/**` added to
  `sideEffects` (those barrels *are* side-effect modules). Guard: `pnpm build` now
  runs `scripts/check-app-css.mjs`, which asserts a class from every source
  stylesheet is present in the built CSS — the app-build twin of
  `check-consumer.mjs`'s package-CSS checks. (`vite.css.ts` already carried a
  `treeshake:false` workaround for this exact mechanism; the package artifact was
  never affected.)
- **Scene: six new product scenes** — `feed` (activity rows with beating dots +
  a highlight wash), `calendar` (mini month, the selection mark hops cell to
  cell), `search` (result rows under a gliding magnifier), `toggles` (switch
  rows flipping in a staggered round), `upload` (arrow rises from the tray while
  the progress bar fills), `launch` (rocket + streaming exhaust). All follow the
  loop discipline (persistent base; transients invisible at their seam or
  palindromic) and rest as complete panels under reduced motion. Also fixed the
  wave scene for real: the global media reset (`svg{max-width:100%}`) was capping
  its two-period tile, making it slide open a gap and snap back.
- **Element composition (`render` prop)** — the Base UI composition model, a
  cleaner successor to `asChild`. `Button` / `IconButton` take a `render` prop (a
  React element or `(props, state) => element`) to render *as* another element —
  a router `<Link>`, a `<label>`, etc. — with the styling, data-attributes,
  handlers and children merged onto it. Backed by internal `useRender` +
  `mergeProps` / `composeRefs`, all re-exported from `raditz` so products can
  build their own polymorphic components. Existing `href`/`<button>` behaviour is
  unchanged (both now resolve through the one render path).
- **Overlay exit animations** (idea borrowed from Base UI/Radix): a new internal
  `usePresence` keeps every overlay mounted through its close animation instead of
  snapping out. Overlay now drives a `data-state` (`open`/`closed`) on the panel +
  container, each surface has a matching `*Out` keyframe keyed on the closing
  state (Dialog/AlertDialog/CommandPalette pop-out, Drawer/BottomSheet slide-out,
  anchored menus/popovers/tooltips fade-scale, scrim fade), and the node unmounts
  once its animations finish — instant under reduced motion / SSR. Behaviour
  (scroll-lock, focus, dismissal) still releases the moment a close is requested.
- **New components**: **`Meter`** (data) — a scalar measurement gauge with
  `role="meter"`, `min`/`max`, threshold-coloured `segments`, distinct from
  Progress's task completion; **`Fieldset`** (inputs) — a native `<legend>` group
  whose `disabled` uses the browser fieldset cascade. Surface 104 → 106.
- **Motion library** (replaces `AnimatedIcon`): **`Scene`** — animated
  card-thumbnail illustrations. Most presets frame a hero `icon` (any react-icons
  glyph) with tasteful animated furniture — a `flash`/`rings` glow + expanding
  rings, popping `spark`s/`stars`, a `halo`, an `orbit`, plus an optional popping
  `badge` chip (`"+1 PT"`) — so any icon becomes a chork-style tile with no
  bespoke SVG; the rest (`bars`, `waves`, `grid`, `constellation`, `route`,
  `stack`) are self-contained. Marks scale in container units, tint via
  `bg`/`tone`, self-size (`ratio`) or `fill` a positioned parent / `Vignette`.
  Plus **`Animate`** — an element-level wrapper with ~18 presets (float/pulse/spin/
  wiggle/glow/shimmer + one-shots pop/tada/shake/bounce…), `trigger`
  loop/hover/inview/mount, speed/delay/repeat. Both ride the motion tokens and go
  static under reduced-motion. `AnimatedIcon` removed. Surface 103 → 104.
- **LineChart multi-series** — pass `series: { name?, data, color? }[]` for
  comparison lines sharing one y-scale + crosshair, with a tooltip that lists
  every series' value at the hovered index (pair with a `Legend`; colours cycle
  a default palette). Single-series `data` is unchanged and keeps gradient /
  markers / references / `renderTooltip`; the two modes are separate branches.
- **Prose** (typography) — a long-form scope so rendered Markdown/CMS HTML
  inherits token-driven rhythm (headings, lists, links, quotes, code, tables,
  rules) with no per-element classes. Surface 102 → 103.
- **Example pages** (5): `Dashboard` (AppShell + KPI cards + LineChart/Donut/
  BarChart + Legend + DataTable — the data components shown in a real
  composition), `Article` and `Docs` (Prose-driven, Docs with a sticky TOC),
  `Auth` (sign-in/up card from the form primitives), and `Contact` (the Contact
  section framed by nav + footer). A `pages.smoke.test.tsx` renders every page so
  a broken composition fails CI, not just the explorer.
- **Calendar / DateRangePicker** (2 more components): the `.rdz-calendar` month
  surface is extracted as a public `Calendar` (single or range mode, ISO dates);
  DatePicker now composes it (DOM/API unchanged — its suite passes unmodified),
  and `DateRangePicker` is a new trigger for `{ from, to }` spans (pick start →
  end, hover-preview, swap-if-earlier, closes when the span completes). Surface
  100 → 102.
- **New components** (10): `NumberInput` (stepped numeric field), `Chip`
  (dismissible tag), `CopyButton`, `Timeline`, `Legend` (chart series key), and
  `BottomSheet` (mobile drag-to-close sheet over the Overlay face); **new
  sections** `Contact`, `HowItWorks` (A row / B vertical), `StorySplit`
  (alternating editorial rows), and a `Gallery` section (grid `GalleryA` +
  masonry `GalleryB`). Component surface: 94 → 100; sections: 22 → 26.
- Charts render a shared empty state (`.rdz-chart__empty`, `emptyMessage` prop on
  LineChart/BarChart/ScatterChart/Donut) instead of a blank/broken frame when
  handed zero data; the frame holds its height so layout doesn't collapse.
- Pill/glass navbars: the end-cluster controls (CTA, scheme toggle, burger) are
  concentric with the bar (`radius-panel − padding`) so a high-`--radius-factor`
  theme curves them with the frame instead of mixing capsules and rounded squares.
- Chart tooltips hug the chart's left/right edge (`data-align` from anchor x vs
  chart width) instead of hanging half-clipped outside a card's radius clip.
- Overlay panels adopt the title-bar anatomy: Dialog is now title-bar / scrolling
  body / footer (close disc lives in the bar; title-less dialogs float it), the
  shared close/nav disc is an outlined circle (no backdrop blur, 2.5rem, 2.75rem
  on touch), and Drawer's header matches the same rhythm.
- Menubar's open panel is no longer clipped by the bar's own scroll container
  (`overflow` yields while a menu is open); its CSS anchor gap now matches the
  JS-positioned menus (8px).
- Spacing scale gained `--space-1-5` (6px) and `--space-2-5` (10px); the stray
  raw-rem paddings/gaps across menus, tables, tooltips, navs and sections now sit
  on tokens.
- NavigationMenu panel items follow radius Rule 1 (`overlay − pad`); the navbar
  control cluster (scheme toggle, burger, sm CTAs) shares one height and radius.
- FeaturesTabbed: header defaults to `align="start"`, balanced active-tab bar,
  panel steady-height cut to 16rem (no more dead space); PricingB tiers render on
  an explicit capped grid (2–3 columns on desktop instead of stacked cards).
- Scrimmed *gradient* backdrops use an accent-tinted veil (flat black over the
  light scheme's pastel gradients read as grey mud; photos keep the neutral scrim).
- Showroom: Replay renders only for stories that opt in via `parameters.replay`
  (motion components, animated sections); demo imagery is centralised in
  `src/demos/images.ts` (a deleted Unsplash photo was 404-ing ImageFocus/Cta);
  the mobile nav drawer no longer leaks its shadow down the closed left edge.
- Sections accept `className`/`id`/`data-*` (forwarded to the section's root):
  anchor links and test ids no longer need the `children` override. SectionShell's
  bespoke `frameData` prop is gone (subsumed by the passthrough); NavbarA/B/C now
  honour the passthrough they declared.
- Preset values moved out of JS constant maps into component stylesheets
  (Avatar/AvatarGroup sizes, AnimatedIcon speeds, Marquee direction).
- One internal `useOpenState` owner for the modal faces' open-state convention;
  `useTrigger` composes it.
- Gates deepened: the `'use client'` codemod + dist verifier share one
  `shippedSourceFiles()` surface (the hand-list blind spot over lib is closed, and
  a missing source directive now fails the suite); `api-contract` rides composed
  stories (hand-maintained props/skip tables gone, coverage widened to every
  args-accepting story); `pnpm release:gate` is the one-command release spine so
  the dist RSC check can't be skipped; fake-timer shim smoke test; catalog header
  classes gated. New wiring tests for the explorer Sidebar's search mode-switch
  and Form's live-validation state machine.

## [0.2.0] - 2026-07-02
- **Section heading markup changed (consumer-visible):** every section heading now
  renders through `SectionHeader` — an `h2.h-section` inside a `div.col.sx-sec__head`
  wrapper — so pages get one coherent heading outline (previously sections mixed
  bare `h2`/`h3`). Product CSS that targeted section-internal structure (e.g.
  `.sx-faq__wrap > .h-section`) no longer matches; use the new `align` prop instead.
- Every headed section now takes `align?: 'start' | 'center'` (Faq, Testimonials,
  TestimonialCarousel, Blog, Comparison and Team join Features/Stats/Cta/Pricing) —
  the sanctioned knob for heading alignment. The catalog now documents the styling
  contract: customise via props/tokens/`children`, never via selectors on internal DOM.
- Checkbox gained `indeterminate`; DataTable's header tri-state uses it (and its
  checkboxes gained accessible names). AlertDialog/Form/DataTable buttons render
  through `Button`.
- CommandPalette adopted full listbox semantics (`role="combobox"` input,
  `aria-activedescendant`, `role="option"` items), matching Combobox.
- One semantic-status vocabulary behind Banner/Badge/Callout/Toast/AlertDialog/
  EmptyState (public prop names and values unchanged).
- New `initColorScheme(defaultScheme)` — the pre-render colour-scheme face for apps
  with no server-rendered head (Vite SPAs); the Vite template wires it, fixing a
  light→dark first-paint flash in Vite-scaffolded products.
- Comparison table a11y: the corner and CTA-row cells are no longer empty `<th>`s.
- AnnouncementA: a handler-only action now renders a real `<button>` (same
  text-link look) instead of an `<a>` without `href`.
- Internal deepening: shared chart tooltip/axis modules, one picker grid-focus
  rover, a searchable-listbox core, explorer active-slug state machine (fixes a
  breadcrumb race), and extracted pure cores with tests throughout.
- Gates: the axe a11y gate now covers sections and every story variant (197
  stories); release preflight blocks unmarked `'use client'` sources; the consumer
  check verifies every client module's directive in dist; template-parity and
  catalog-utilities tests catch template/catalog drift.
- Templates: the product `prebuild` hook is now link-aware (`rdz-prebuild.mjs`) —
  it rebuilds the sibling raditz checkout ONLY while the rdz-link override is
  active; tag-pinned builds use the packaged dist and never depend on (or silently
  absorb) a local checkout. The Next template widens `turbopack.root` when a
  sibling checkout exists (Turbopack can't resolve a package symlinked outside its
  inferred root).
- **Consistency pass (library-wide audit + fixes):**
  - Keyboard a11y: Tabs, Rating and Toolbar implemented their ARIA-role keyboard
    contracts (arrow roving, Home/End) — previously the roles shipped with no
    keyboard support at all. DropdownMenu/Menubar now return focus to the trigger
    on close; Menubar gained ArrowLeft/Right between menus.
  - API conventions unified: the value callback is `onValueChange(value)`
    everywhere (**breaking**: Rating, Combobox, DatePicker, TimePicker,
    DateTimePicker, OneTimePasswordField, PasswordToggleField, TagInput,
    FileDropzone renamed from value-first `onChange`); charts' bespoke `ariaLabel`
    prop removed in favour of native `aria-label`; every component accepts
    `className` + rest props (BarChart was dropping it; LineChart/ScatterChart/
    Tabs/CheckList/CountUp/Icon/Vignette accepted none); input primitives
    (Input, Textarea, Checkbox, Radio, Switch, Slider) forward refs to their
    native control; IconButton and Search gained `size="lg"`.
  - Overlay faces: Dialog, Drawer, AlertDialog and CommandPalette gained
    uncontrolled `defaultOpen`; ContextMenu and Menubar gained controlled
    `open`/`onOpenChange`.
  - Sections: PricingB honours `align`; FeaturesTabbed and Spotlight's `children`
    override slot actually works; AnnouncementA supports the full background/scrim
    surface; PricingTier's popular badge is content-driven (`badge?: ReactNode` —
    **breaking**: `popular: true` no longer auto-renders "Popular" text); sections
    render real Badge/Input components instead of hand-written class strings;
    NavbarC `footnote` and NavbarD `preview` replace baked-in filler copy.
  - Styling: NavBar's indicator rides custom properties (fixing the underline
    variant's anchoring); the nav pill's timing uses motion tokens (reduced-motion
    now free); Gallery breakpoints are container queries; chart tooltip and
    Lightbox z-indexes moved onto the `--z-*` ladder; `font-weight: 700` literals
    tokenised.
  - ~300 new behaviour tests (keyboard, timers via the repo's first fake-timer
    infra, overlay wiring, carousel/pagination/accordion/toggle-group contracts)
    plus three new machine gates: `api-contract` (className-on-root),
    `ref-contract` (refs reach controls), `style-contract` (inline styles,
    z-index ladder, README counts). README rewritten to match reality.
- **Variant wiring: enumerated axes now ride data attributes** (`data-variant`/
  `data-size`/`data-color`/`data-side`/`data-orientation`/`data-tone`/`data-anim`/
  `data-bg`/…) styled as `.rdz-x[data-variant='primary']` — same specificity, one
  value per axis by construction, semantic in devtools, and a stable consumer
  styling hook. Boolean modifiers (`is-*`, `rdz-card--col`) and block/element
  names stay classes; `cx` merges only those. **Breaking for CSS that targeted
  the old enum modifier classes** (`.rdz-btn--primary` → `.rdz-btn[data-variant='primary']`,
  ~25 components). Component APIs unchanged. Gated: shipped tsx may not build
  `` `x--${…}` `` class strings (style-contract).

## [0.1.0] - 2026-06-29
- Packageization foundation: consumable package (src barrel, two-build pipeline,
  vendored Radix colours + self-hosted fonts), generated `catalog/llms.txt`,
  and the gated `release` skill.
- Component library: 94 components across 13 categories (actions, inputs, display,
  feedback, typography, layout, surfaces, overlay, navigation, disclosure, data,
  media, motion), each folder-owned with co-located styles, stories and tests.
- Content-driven page sections: heroes, navbar, pricing, social-proof, footer, and
  image / tabbed / checklist / marquee sections driven entirely by content props.
- Theming: runtime theme variables, swappable colour vibes, and dark-by-default opt-in.
- Motion system: Reveal, TextReveal, AnimatedIcon and MotionCard primitives, a
  load-time hero entrance, scroll choreography, and full reduced-motion support.
- AppShell: a configurable shell with a swappable sidebar / topbar layout.
- Showroom explorer: a public showcase auto-built from the stories, with tree
  navigation, breadcrumbs and scroll-spy.
- Data viz: LineChart, ScatterChart, Donut and DataTable over a shared scale module.
- Accessibility: an axe gate over every story, configurable heading levels, and
  centralised dialog naming.
- Architecture: high-leverage logic extracted into pure, unit-tested cores
  (taxonomy grammar, Lightbox gestures, Form model, sidebar expansion, scroll-spy,
  themeVars, chart scales, slider geometry), with the decisions recorded as ADRs.
