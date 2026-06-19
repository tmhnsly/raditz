import { useEffect } from 'react';

// Overlay concern: lock body scroll (modal topologies). Re-exported by overlayHooks.ts.

/** Lock body scroll while enabled. */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    // Compensate for the vanishing scrollbar so the page doesn't shift.
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) {
      const base = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${base + sbw}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [enabled]);
}
