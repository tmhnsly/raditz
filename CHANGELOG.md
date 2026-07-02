# Changelog

All notable changes to Raditz are recorded here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); versions are git tags `vX.Y.Z`.

## [Unreleased]

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
