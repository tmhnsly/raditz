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
  absorb) a local checkout.

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
