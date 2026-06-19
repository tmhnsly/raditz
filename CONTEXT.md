# SuperRadix

The domain language of the SuperRadix component library. These terms name the
seams and modules the library is built from, so architecture reviews and refactors
speak the same way. Architecture vocabulary (module, interface, seam, adapter,
leverage, locality, depth) is defined separately in the
`improve-codebase-architecture` skill's LANGUAGE.md; this file names the *things*.

## Language

### Overlay layer

**Overlay**:
The internal module that renders any "thing in a fixed layer that opens, dismisses,
and disappears" — owning visibility-gating, dismissal, scroll-lock, focus, scrim,
and positioning behind one interface. Lives in `src/components/internal/`.
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

## Flagged ambiguities

- "anchor" vs "trigger" — resolved: the **Trigger** is what the user interacts with to
  open; the *anchor* is the ref the **Overlay** positions against. Often the same node,
  distinct roles.
- "modal" was used for both a topology and the Dialog component — resolved: modal is a
  **Topology** class (`centered`/`side`); Dialog is an **Adapter face**.
- "semantic surface" vs "neutral surface" — resolved: `--<concept>-surface` is a semantic
  tint; `--surface*` are neutral fills. Different roles, kept in separate namespaces.
