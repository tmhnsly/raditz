# ADR 0002: The reveal/entrance contract stays distributed per layer

## Status
Accepted (2026-06-25)

## Context
The "reveal contract" — hide a thing, then animate it in: a `@media (scripting: enabled)`
SSR gate, a `@media (prefers-reduced-motion)` kill switch, a hidden state expressed via a
custom property, and a trigger — recurs ~8 times: `Reveal.scss`, `TextReveal.scss`,
`sections.css` (`.s-choreo` scroll / `.s-load` mount / `.sx-media-reveal`),
`SectionBackground.scss` (media settle), `Pricing.css` (card pop), and `_shared.scss`
(title-anim). A deepening review proposed collapsing it into one shared SCSS `@mixin`.

## Decision
Keep it distributed. Do the **local** dedups that survive the deletion test — share
`--s-tf` / `--s-stagger` / `--s-delay` within `sections.css`, keep the JS in-view +
reduced-motion gate in one `useRevealState`, keep timing in the motion tokens and the
entrance vocabulary on the `data-reveal` axis — but do NOT introduce a cross-file
reveal-contract mixin.

## Consequences
- The deletion test fails for a unified mixin: the details genuinely differ per layer —
  SSR-gated or not (Reveal's element is in the SSR HTML and must gate; TextReveal's split
  units are JS-created and need no gate), transition vs `@keyframes`, per-element vs
  container-`nth-child` vs mount trigger, distinct easing curves, plus `clip-path` for
  text. A mixin covering all would need so many parameters its interface ≈ its
  implementation — shallow by definition.
- **Format barrier:** 4 of the 8 sites are plain CSS (`sections.css`, `Pricing.css`) and
  cannot consume an SCSS mixin without converting those files (changing how they're
  globbed/imported) for a marginal gain.
- The genuinely deep pieces are already shared: `useRevealState` (the in-view +
  reduced-motion gate, in JS), the motion tokens (timing, retunes with `data-motion`),
  and the `data-reveal` axis (the entrance-style vocabulary). Revisit only if two of the
  CSS implementations converge to byte-identical details.
