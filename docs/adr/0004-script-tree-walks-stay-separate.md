# ADR 0004: The build scripts' directory walks stay separate

## Status
Accepted (2026-06-25)

## Context
Three Node build scripts recurse the source tree with `readdirSync`:
`public-surface.mjs` (a structured 2-level `category/name` walk that applies the
has-a-story public-surface filter and resolves component/story/test paths),
`add-use-client.mjs` (a recursive walk yielding every non-story/non-test `.tsx?`
*file*), and `watch.mjs` (a recursive walk that attaches an `fs.watch` *per directory*,
reached only on the cold older-Node-on-Linux fallback path). A deepening review noted
the duplicated recursion and proposed a shared tree-walk primitive — CONTEXT.md's
*Source-surface* note already records that an earlier pass "killed 4 duplicated
tree-walks", so these read like stragglers.

## Decision
Leave the three walks separate. Do NOT extract a shared walker.

## Consequences
- The deletion test is weak here: the three walks differ in **return shape**
  (structured entries vs file paths vs live watchers), so a shared primitive could
  only be the lowest-level "recurse a directory" — a language idiom, not a domain
  seam. `public-surface`'s structured public-surface walk genuinely can't serve
  `add-use-client` (which needs all files, including internals) or `watch` (which
  needs directories, to watch them).
- That leaves at most one real caller for any honest shared helper (`add-use-client`'s
  file walk), with `watch`'s walk a cold fallback. **One adapter = a hypothetical
  seam.** A walker parameterized enough to cover all three (filter predicate, yield
  files-or-dirs, structured-or-flat) would have an interface ≈ its implementation —
  shallow by definition, the opposite of the deepening this was meant to be.
- The duplicated part is ~6 lines of `readdirSync` recursion per script. Sharing it
  would trade trivial, local, obvious code for a parameterized indirection.
- Revisit only if a fourth consumer appears needing the *same* shape as an existing
  one (two real adapters = a real seam), or if the walks start encoding shared
  *domain* rules (not just filesystem recursion).
