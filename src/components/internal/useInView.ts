'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefCallback } from 'react';

export interface InViewOptions {
  /** IntersectionObserver rootMargin. @default '0px 0px -10% 0px' (fire just
   *  before the element is fully in view). */
  rootMargin?: string;
  /** Visibility ratio that triggers. @default 0 */
  threshold?: number;
  /** Latch `true` on first entry and stop observing. @default true */
  once?: boolean;
}

/**
 * Reports whether the observed element is in the viewport via a single
 * IntersectionObserver (no scroll-event spam — cheap and smooth). Returns a ref
 * callback to attach plus the current `inView` flag. `once` (default) latches
 * true on first entry, so entrance animations don't replay on every scroll-by.
 *
 * SSR / no-IntersectionObserver safe: it reports `inView: true` immediately when
 * the API is unavailable, so content is shown (just unanimated) — never hidden.
 */
export function useInView<T extends Element = HTMLElement>(
  options: InViewOptions = {},
): { ref: RefCallback<T>; inView: boolean } {
  const { rootMargin = '0px 0px -10% 0px', threshold = 0, once = true } = options;
  const [inView, setInView] = useState(false);
  const cleanup = useRef<(() => void) | null>(null);

  const ref = useCallback<RefCallback<T>>(
    (node) => {
      cleanup.current?.();
      cleanup.current = null;
      if (!node) return;
      if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            setInView(true);
            if (once) { io.disconnect(); cleanup.current = null; }
          } else if (!once) {
            setInView(false);
          }
        },
        { rootMargin, threshold },
      );
      io.observe(node);
      cleanup.current = () => io.disconnect();
    },
    [rootMargin, threshold, once],
  );

  useEffect(() => () => cleanup.current?.(), []);

  return { ref, inView };
}
