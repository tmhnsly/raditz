# Section animation choreography — design

**Date:** 2026-06-24
**Status:** approved (design), pending implementation plan

## Problem

Today only section *headings* animate app-wide (`data-title-anim` on `.h-section`/`.h-display`, tied to the `reveal` theme axis). Section *content* — eyebrow, subtitle, CTAs, media, cards — only animates where a section explicitly wraps it in `<Reveal>`, which is just **Features**, **Spotlight**, and the **Animations** demo. So Hero, CTA, Stats, Team, Testimonials, Pricing, FAQ, etc. reveal only their title. The result feels half-animated, and the existing reveals were perceived as "staggered / not smooth" (root causes below).

## Goals

- Every section choreographs a coordinated **content entrance** on scroll-in, not just its title.
- A **cinematic** layer of media-aware motion (image scale-settle, stat count-up, pricing pop, card media scale-in).
- **On by default**, **SSR-pure**, **fully accessible**, and **smooth** (fix the current jank).

## Non-goals

- No CSS scroll-driven (`animation-timeline: view()`) yet — browser support still patchy; stay JS-observer-driven.
- No `blur`/`flip`/`rotate`/`zoom` at *section* scale (jank / too much) — those remain available for small elements (cards) only.
- Card media scale-in ships but is the lowest-priority polish (can be a later increment if needed).

## The model — two layers

### Layer 1 · Content choreography (every section, via `SectionShell`)
When a section enters view, its content reveals as one coordinated cascade in document order — eyebrow → heading → subtitle → CTAs → media/cards — each child offset by a short stagger (~70ms, scaled by `data-motion`). Implemented once in `SectionShell` so all sections inherit it; reuses the reveal engine (one `IntersectionObserver` via `useInView`, fires once).

- The heading's existing `data-title-anim` is **subsumed** by the choreography for animated sections (the heading is just one step in the cascade) — no more separate/competing title animation.
- **Entrance style options** (curated, smooth at section scale): `fade`, `fade-rise` (default), `rise`, `scale`.
- Governed by the existing **"Animation" theme axis** as the app-wide default, with a per-section `animate` override (`animate={false}` opts a section out; `animate="rise"` overrides its style).

### Layer 2 · Media-aware motion (cinematic flair), per section type
1. **Hero / ImageFocus** (image/video backdrop): **scale-settle** 1.06 → 1 over ~1.2s on reveal (Ken-Burns-lite); copy choreographs over it. Existing `parallax` prop kept, made reduced-motion-safe.
2. **Stats**: numbers **count up** 0 → value on reveal (new small count-up util).
3. **Pricing**: featured tier gets a subtle **scale-pop** emphasis on reveal.
4. **Card grids** (Spotlight/Blog/Team/Gallery): media **scale-in** inside the card (lowest priority).

## The three guarantees

### Accessible
`prefers-reduced-motion: reduce` turns **everything** off: content renders final, no stagger, counters show the final number immediately, no scale-settle/parallax. This is the existing reveal contract, extended to counters and media motions. Motion is purely decorative; content is always present and readable.

### SSR-pure (no content hidden without JS) — zero consumer integration
On-by-default must not hide content for no-JS/crawlers, and it must not require every consumer to wire up a script. The reveal **hidden state is gated by the CSS `@media (scripting: enabled)` query** — purely in Raditz's stylesheet, nothing for consumers to add:

```scss
@media (scripting: enabled) {        /* JS is running */
  .rdz-reveal { opacity: 0; transform: …; }
  .rdz-reveal.rdz-reveal { transition: …; transition-delay: …; }
}
/* `.is-in`, the variant custom-props, and the reduced-motion override stay outside the query */
```

- **JS on** → `scripting: enabled` → hidden then animates (the SSR HTML carries no `is-in`, so it starts hidden and the client reveals it — no FOUC).
- **No JS / crawler** → `scripting: none` → the hidden block never applies → content renders in its final visible state. SSR-pure.
- **Browser without the `scripting` media feature** (older) → the block is ignored → content visible, no animation. Graceful degradation.

This removes the previously-considered `html.js` inline-script gate entirely — no consumer-side integration, no FOUC, fully reusable.

### Smooth (fixes the reported jank)
- GPU compositor only: `transform` + `opacity` (+ `clip-path` where used). No `filter`/`blur` at section scale; no layout-affecting properties.
- **Fix the `will-change` leak**: today `.rdz-reveal` sets `will-change: opacity, transform` permanently on every reveal → standing compositor layers. Scope it to the animating window only (set while pending/animating, drop after the transition) so idle reveals hold no layer.
- Once-only via the shared observer; no scroll handlers.
- One short coordinated stagger per section — not a 12-item cascade.

## Architecture

- **`SectionShell`** gains the choreography: it wraps its content children in a coordinated reveal group (auto-assigning stagger order) gated by `animate` (default from theme). Sections keep authoring plain content; the shell adds the entrance. The `SectionHeader` heading stops carrying a separate title-anim when choreography is active.
- A small **reveal primitive** (extend `useRevealState`/`Reveal` and `RevealGroup`) provides the staggered, once-only, reduced-motion-safe, will-change-managed entrance. The doubled-specificity transition fix (so a co-class like `.rdz-card` can't strip it) already landed and is relied on here.
- **Media motions** are section-local: a `MediaReveal`/`scale-settle` class for `SectionBackground` images, a `useCountUp` hook for `Stats`, a reveal-emphasis class for the `Pricing` featured tier, a media scale-in for card grids.
- **Theme wiring**: the `reveal` axis (already the "Animation" control) becomes the app-wide section-entrance default; `data-reveal` continues to drive `<Reveal>` defaults. Curated section styles validated against the allowed set.

## Accessibility detail

- All motion behind `@media (prefers-reduced-motion: reduce)` final-state overrides (reveals, scale-settle, parallax, card media) and the JS short-circuit in the reveal hook (no observer, render final).
- Count-up: the final value is always in the DOM (the animation only interpolates a display layer); under reduced motion it renders the final number with no tween.

## Testing

- Unit: `useCountUp` (start/step/final, reduced-motion → final immediately); choreography stagger-order assignment; `animate={false}` opts out; SSR-gate class logic.
- Story/a11y: every section's story renders and passes the axe gate with choreography on (content present, not opacity-trapped in jsdom — IO-absent path renders final).
- Visual (manual + Playwright): measure a section's content opacity/transform ramps over time on reveal/replay (as done while debugging the reveal clobber) to confirm smooth, coordinated, GPU-driven motion and the will-change scoping.

## Resolved decisions

- Default: **on by default**, SSR-safe via the `html.js` gate.
- Media motions in this pass: **all four** (Hero/Image scale-settle, Stats count-up, Pricing pop, Card media scale-in).
- Section entrance styles: `fade` / `fade-rise` (default) / `rise` / `scale` only.
