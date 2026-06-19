import { useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRoving, KEYS } from './keyboard';

// Overlay concern: roving keyboard nav for a vertical menu list. Layered *inside*
// an Overlay by Menu-surface (not by Overlay itself). Re-exported by overlayHooks.ts.

export interface RovingMenu {
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  onKeyDown: (e: ReactKeyboardEvent) => void;
}

/** Roving keyboard nav for a vertical menu list (over the shared {@link useRoving}),
 * plus Escape-to-close and reset on close. Active starts at -1 (container focused). */
export function useRovingMenu(count: number, open: boolean, onClose?: () => void): RovingMenu {
  const { active, setActive, onKeyDown: rove } = useRoving({ count, orientation: 'vertical', loop: true, initial: -1 });
  useEffect(() => { if (!open) setActive(-1); }, [open, setActive]);
  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === KEYS.Escape) { e.preventDefault(); if (onClose) onClose(); return; }
      rove(e);
    },
    [rove, onClose],
  );
  return { active, setActive, onKeyDown };
}
