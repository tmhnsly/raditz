# ADR 0003: Overlay faces are not unified under a shared Panel

## Status
Accepted (2026-06-25)

## Context
The overlay module has 11 faces (Dialog, Drawer, AlertDialog, Popover, HoverCard,
CommandPalette, Tooltip, ContextMenu, DropdownMenu, Menubar, Lightbox). A deepening review
proposed a shared `Panel` (header / body / footer) for the titled ones, after noticing the
`<h2 title>` + `<p description>` header markup repeats across Dialog, Drawer, and AlertDialog.

## Decision
No `Panel`. The shared **engine** already exists — `Overlay` (the four positioning
topologies + dismissal + focus mode + scroll-lock behind one interface), `OverlayClose`,
and `MenuSurface` (the roving menu engine). Extract only the one thing that was duplicated
*and wrong*: the dialog a11y naming, as `useOverlayLabels` (`aria-labelledby` /
`aria-describedby` with SSR-safe ids), used by Dialog / Drawer / AlertDialog.

## Consequences
- The deletion test fails for a `Panel`: only 3 of 11 faces share the header, and they
  diverge — close button absolute (Dialog) vs inline-in-header (Drawer) vs none
  (AlertDialog); footer optional-user (Dialog/Drawer) vs forced cancel/confirm buttons
  (AlertDialog) vs none; AlertDialog has no body at all; and the CSS is genuinely
  different (centered modal vs edge-anchored sheet). A `Panel` covering all of that
  (`closeButton`, `actions`, `side`, `tone`, body-or-not…) would be over-parameterized —
  its props nearly as complex as the markup it replaces.
- The real depth (positioning, dismissal, focus trap, scroll-lock) is already concentrated
  in `Overlay`; the faces are thin honest adapters over it. That is the seam worth having.
- `useOverlayLabels` concentrates the a11y wiring (it now announces the description on
  open and names ReactNode titles — the old `aria-label={typeof title === 'string'}` did
  neither). Revisit a shared body/footer only if the titled faces converge structurally.
