# Changelog

All notable changes to Raditz are recorded here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); versions are git tags `vX.Y.Z`.

## [Unreleased]

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
