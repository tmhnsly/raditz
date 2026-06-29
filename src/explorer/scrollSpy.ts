// Scroll-spy core — which section is the reader "on", from live geometry. The old
// scroll-spy leaned on an IntersectionObserver's changed-entries batch + the first
// still-intersecting target, a stateless pattern that holds a stale value whenever
// the relevant section's intersection didn't change in a given callback (fast
// continuous scroll, reflow after lazy content mounts) — i.e. it could get stuck.
// This recomputes from scratch each scroll frame instead, so it never sticks.

export interface SectionTop {
  id: string;
  /** The section's viewport-relative top (getBoundingClientRect().top). */
  top: number;
}

/**
 * The active section id for a set of sections (in vertical/document order) and an
 * activation line (a y-offset down the viewport). It's the DEEPEST section whose
 * top has crossed the line; `''` (Overview) when even the first section is still
 * below it — i.e. the page is scrolled above every section.
 */
export function activeSection(sections: SectionTop[], line: number): string {
  let active = '';
  for (const s of sections) {
    if (s.top <= line) active = s.id;
    else break;
  }
  return active;
}
