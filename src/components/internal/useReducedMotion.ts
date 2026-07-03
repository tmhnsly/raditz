'use client';
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the user prefers reduced motion (OS-level `prefers-reduced-motion:
 * reduce`). SSR-safe: returns `false` until mounted, then live-follows the query.
 *
 * Animated components use this to render their FINAL state immediately rather
 * than animating to it — it's for JS-gated entrances (e.g. {@link useInView} +
 * Reveal, Animate/IconFX loops) that must skip the hidden initial state, not just
 * shorten its duration. The CSS counterpart is the token-zeroing in `_shared.scss`
 * (which collapses every motion-token-driven duration); use both together.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const sync = (): void => setReduced(mq.matches);
    sync();
    // Support both the modern and the legacy (Safari < 14) MediaQueryList APIs,
    // and tolerate a minimal mock that has neither.
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', sync);
      else if (mq.removeListener) mq.removeListener(sync);
    };
  }, []);
  return reduced;
}
