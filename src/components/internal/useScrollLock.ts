import { useEffect } from 'react';

// Overlay concern: lock body scroll (modal topologies). Re-exported by overlayHooks.ts.

/** Lock body scroll while enabled, without shifting (or reflowing) the page. */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const body = document.body;
    const root = document.documentElement;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    // Measure the width the locked scrollbar actually frees up — AFTER hiding
    // overflow — and compensate only that. With `scrollbar-gutter: stable` (the
    // Raditz root default) the gutter stays reserved, so the delta is 0 and we add
    // NO padding: no horizontal shift and no width-change reflow (which read as the
    // page jumping up/down on open/close). Where the scrollbar genuinely vanishes
    // (older engines without gutter support) we compensate exactly its width.
    const before = root.clientWidth;
    body.style.overflow = 'hidden';
    const delta = root.clientWidth - before;
    if (delta > 0) {
      const base = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${base + delta}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [enabled]);
}
