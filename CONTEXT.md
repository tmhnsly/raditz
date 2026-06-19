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
and positioning behind one interface. Lives in `src/components/internal/`. It
portals to `<body>` so `position: fixed` stays viewport-relative even when an
ancestor (transform/filter/backdrop-filter) would otherwise become its containing
block; positions are passed to CSS as custom properties, not presentational styles.
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

### Shared internals (deepened 2026-06-19)

**Roving**:
The one stateful arrow-key navigation module — `useRoving` over the pure
`rovingIndex` (loop/orientation/Home/End). Menu-surface, Combobox, CommandPalette
and ToggleGroup adapt it; NavBar uses `rovingIndex` directly. Tree keeps its own
2D expand/collapse nav; RadioGroup roves natively.
_Avoid_: per-component arrow handlers.

**Scale**:
Pure chart geometry (`minMax`, `normalize`, `toPercent`, `sparklinePath`,
`donutDashes`) in `internal/scale.ts`. BarChart, Donut, Sparkline and Progress
call it instead of inlining math in JSX — so the math is unit-tested.
_Avoid_: in-closure scaling math.

**Page-model**:
Pure paging math (`pageCount`, `buildPages`) in `internal/pageModel.ts`, shared
by Pagination and DataTable.

**SectionShell** _(showcase infra, `src/lib`)_:
The home for the section layout boilerplate — Frame + `.s-pad` + `.s-wrap` (where
the responsive container-query lives) + optional **SectionBackground**. Sections
are content + a shell choice. Navbar (ref/data on the wrap) stays bespoke.

**Search**:
The shared search input (`forms/Search`) + the `fuzzyFilter` matcher, used by
Combobox, CommandPalette and the explorer so every search looks/behaves alike.

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
Light vs dark resolution — the `useColorScheme` hook (`src/lib`, framework primitive
for any project). Starts from the OS (`prefers-color-scheme`) and **live-follows**
it; a toggle sets an explicit override that wins over the OS; toggling back to the
OS's current value clears the override (so we follow the system again). Only an
explicit override is persisted (`srx-color-scheme`), so a fresh project honours the
OS until the user opts in. Drives `class="dark"` on the root.
_Avoid_: `useDarkMode` (removed — a boolean can't express "follow system").

**Surface context**:
How a region declares its colour context. Two named contexts:
- **`.dark`** — flips the whole app (Radix scales self-scope to `.dark`, and the
  semantic aliases resolve against the root scales). It is **root-only**: a `.dark`
  on a *subtree* flips raw scales but NOT the resolved semantic tokens
  (`--text → --neutral-12 → --slate-12` is substituted at `:root`), so text doesn't
  change. (This trap caused a real bug; do not claim `.dark` works on a subtree.)
- **`.srx-on-dark`** — the subtree-safe context for content over dark media/scrim:
  re-points the *semantic* tokens (`--text`, rules, `--accent-surface`, …) to the
  `--on-media` (white-alpha) family in **one level**, so it works anywhere.
_Avoid_: applying `.dark` to a region (use `.srx-on-dark`); hardcoding white text.

## Flagged ambiguities

- "anchor" vs "trigger" — resolved: the **Trigger** is what the user interacts with to
  open; the *anchor* is the ref the **Overlay** positions against. Often the same node,
  distinct roles.
- "modal" was used for both a topology and the Dialog component — resolved: modal is a
  **Topology** class (`centered`/`side`); Dialog is an **Adapter face**.
- "semantic surface" vs "neutral surface" — resolved: `--<concept>-surface` is a semantic
  tint; `--surface*` are neutral fills. Different roles, kept in separate namespaces.
