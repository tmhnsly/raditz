'use client';
import { useEffect } from 'react';
import type { RefObject } from 'react';

// Overlay concern: Escape + outside-pointer dismissal. Re-exported by overlayHooks.ts.

export interface DismissOptions {
  ignoreRef?: RefObject<HTMLElement | null>;
  /** React to the Escape key. @default true */
  escape?: boolean;
  /** React to an outside pointerdown. @default true */
  outside?: boolean;
}

/**
 * Escape key + outside-pointer dismissal. `ignoreRef` (e.g. the trigger) is
 * excluded from outside detection. `escape` and `outside` toggle each channel
 * independently, so a caller can keep a scrim but disable outside-dismiss
 * (AlertDialog) or disable both and drive close itself (HoverCard).
 *
 * The outside-pointer listener attaches on a deferred tick (`setTimeout(…, 0)`),
 * so the very click that opened the overlay does not immediately dismiss it.
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onDismiss: () => void,
  options: DismissOptions = {},
): void {
  const { ignoreRef, escape = true, outside = true } = options;
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onDismiss(); }
    };
    const onPointer = (e: PointerEvent) => {
      const c = ref.current;
      const ig = ignoreRef && ignoreRef.current;
      const target = e.target as Node;
      if (c && !c.contains(target) && !(ig && ig.contains(target))) onDismiss();
    };
    if (escape) document.addEventListener('keydown', onKey, true);
    const id = outside
      ? window.setTimeout(() => document.addEventListener('pointerdown', onPointer, true), 0)
      : undefined;
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (id !== undefined) clearTimeout(id);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, [enabled, onDismiss, ref, ignoreRef, escape, outside]);
}
