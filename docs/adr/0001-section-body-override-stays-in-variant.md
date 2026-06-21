# ADR 0001: The section body-override stays an in-variant idiom

## Status
Accepted (2026-06-21)

## Context
Every section variant renders its content as `{children ?? (<>…default body…</>)}` —
the `children` escape hatch overrides the auto-rendered body inside the themed
`SectionShell`. This idiom appears ~33 times. A deepening review proposed moving the
guard into `SectionShell` (e.g. a `body` prop, with the shell choosing `children ?? body`).

## Decision
Leave the `children ?? body` guard in each variant. Do NOT move it into `SectionShell`.

## Consequences
- The deletion test fails for this move: the guard is a one-token idiom, not complexity
  that concentrates. Relocating it would change `SectionShell`'s children contract for
  ~20 callers (every section + HeroBleed + the Showcase page) to net out a trivial gain,
  and would shift — not remove — the "forget it" failure mode (a section that forgets to
  pass `body` renders nothing just as one that forgets the guard does).
- `SectionShell` stays deep on **layout** and now **header** (`SectionHeader`); content
  framing stays the variant's job. Revisit only if section bodies start sharing structure
  (then a real shared body module, not a guard relocation, would be the move).
