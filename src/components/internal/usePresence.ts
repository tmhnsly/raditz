'use client';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export type PresenceStatus = 'open' | 'closing';

/**
 * Keeps an element mounted through its exit animation (the idea Base UI/Radix use
 * for overlays). Returns `mounted` — render while true — and `status`
 * ('open' | 'closing') to drive a `data-state` the stylesheet keys an exit off.
 * When `open` flips false we hold the node, mark it `closing`, and unmount only
 * once its running animations finish; if there are none (or `getAnimations` is
 * unavailable, e.g. jsdom / SSR) it unmounts immediately, and reduced-motion —
 * which collapses the durations to ~0 — makes that effectively instant too.
 * Re-opening mid-close cancels the pending unmount cleanly.
 */
export function usePresence(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
): { mounted: boolean; status: PresenceStatus } {
  const [mounted, setMounted] = useState(open);
  const [status, setStatus] = useState<PresenceStatus>(open ? 'open' : 'closing');

  // Mount SYNCHRONOUSLY the moment we open (a render-phase update, the sanctioned
  // "derive state from props" pattern) so consumers' on-open effects — focus, the
  // grid rover, positioning — see the panel in the DOM this commit. The mount must
  // never lag; only the close is deferred (below).
  if (open && !mounted) setMounted(true);
  if (open && status !== 'open') setStatus('open');

  // Begin the exit when closing; the node stays mounted until its animation ends.
  useEffect(() => {
    if (!open && mounted) setStatus('closing');
  }, [open, mounted]);

  useEffect(() => {
    if (status !== 'closing') return undefined;
    const el = ref.current;
    if (!el || typeof el.getAnimations !== 'function') {
      setMounted(false);
      return undefined;
    }
    let cancelled = false;
    // Wait a frame so the closing styles have applied and their animations exist.
    const raf = requestAnimationFrame(() => {
      const anims = el.getAnimations();
      if (anims.length === 0) {
        if (!cancelled) setMounted(false);
        return;
      }
      Promise.allSettled(anims.map((a) => a.finished)).then(() => {
        if (!cancelled) setMounted(false);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [status, ref]);

  return { mounted, status };
}
