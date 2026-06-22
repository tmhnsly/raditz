'use client';
import { useEffect } from 'react';
import type { RefObject } from 'react';

// Overlay concern: trap Tab focus inside the panel. Re-exported by overlayHooks.ts.

/** Trap Tab focus inside `ref` while enabled, restoring focus on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !ref.current) return undefined;
    const node = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const sel = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const items = () => {
      const all = [...node.querySelectorAll<HTMLElement>(sel)];
      const visible = all.filter((x) => x.offsetParent !== null);
      // Fall back to all focusables when none report as visible (e.g. layout-less
      // environments) rather than trapping among nothing.
      return visible.length ? visible : all;
    };
    const first = items()[0];
    (first || node).focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const a = list[0];
      const b = list[list.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
      else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
  }, [enabled, ref]);
}
