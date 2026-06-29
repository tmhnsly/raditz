// Sidebar expansion model — the pure set algebra behind the three intents that
// drive the showcase tree's open/closed branches: the first-paint defaults, the
// scroll-spy "close behind you" reconciliation, and a user opening a branch.
// Lifted out of Sidebar so the precedence is tested instead of tangled across an
// initializer, an effect, and an onSelect closure. Ancestor paths are passed in
// (the caller computes them via registry.ancestorsOf) so this stays a pure,
// dependency-free unit.

/**
 * Branch ids open on first paint: every top-level group except `collapsed`,
 * merged with the current route's ancestor path (so a deep link opens expanded,
 * even into the otherwise-collapsed group).
 */
export function initialExpanded(topSlugs: string[], routeAncestors: string[], collapsed: string): string[] {
  const open = new Set(topSlugs.filter((s) => s !== collapsed));
  routeAncestors.forEach((s) => open.add(s));
  return [...open];
}

/**
 * Scroll-spy moved to a new active section. With auto-collapse on, keep ONLY the
 * active branch path open (close others behind you); with it off, merge the active
 * path into the existing set. An empty active path leaves the set untouched (same
 * reference) so the caller skips a needless render.
 */
export function reconcileExpanded(prev: string[], activeAncestors: string[], autoCollapse: boolean): string[] {
  if (!activeAncestors.length) return prev;
  return autoCollapse ? activeAncestors : [...new Set([...prev, ...activeAncestors])];
}

/** The user opened a branch — add it, without duplicating an already-open one. */
export function openBranch(prev: string[], id: string): string[] {
  return [...new Set([...prev, id])];
}
