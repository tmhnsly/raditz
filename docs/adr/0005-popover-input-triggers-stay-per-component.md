# ADR 0005: The input-shaped popover triggers stay per-component

## Status
Accepted (2026-07-02)

## Context
Combobox, DatePicker and TimePicker each render an input-shaped popover trigger:
a `button.rdz-input` with a leading icon, a placeholder-or-value label, and
`aria-haspopup`/`aria-expanded`. A deepening review (which extracted the shared
`useSearchableList` and `useGridFocus` modules from the same components) flagged
the three triggers as a possible fourth extraction.

## Decision
No shared trigger component. Each face keeps its own.

## Consequences
- The three copies share only the outer shape. They differ in icon source (an
  `<Icon>` vs bespoke inline SVGs), placeholder-class placement (inner span vs
  the button itself), per-component BEM classes, and `aria-haspopup` — and the
  haspopup "drift" is not drift: each value is *correct* for its surface
  (Combobox opens a `listbox`; both pickers open `role="dialog"` overlays).
- A shared component covering all of that would carry props for icon slot,
  label placement, class scheme, and haspopup value — an interface approximating
  the three implementations it replaces. Shallow by definition; the deletion
  test fails.
- Revisit if a fourth input-shaped trigger appears that matches an existing one
  closely enough that two faces want byte-identical trigger markup (two real
  adapters = a real seam).
