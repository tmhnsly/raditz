'use client';
import { useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';
import { KEYS } from './keyboard';

// The DOM-focus rover behind the pickers' "freeze boundary": on open it focuses
// a real option/day, and arrow keys then move focus AND preventDefault, so they
// move the selection instead of scrolling the page. It roves *DOM focus* (not a
// state index) on purpose — useRoving's single active index can't model these
// 2-D layouts (see CONTEXT.md). Two strategies cover both picker shapes:
//
// - `grid`: one flat CSS grid; Up/Down jump a whole row by reading the real
//   column count off `grid-template-columns` (DatePicker's day/month/year grids).
// - `columns`: explicit column elements; Up/Down rove within a column and
//   Left/Right hop to the sibling column's first item (TimePicker's h/m/AM-PM).

export type GridFocusStrategy =
  | { kind: 'grid'; itemSelector: string }
  | { kind: 'columns'; columnSelector: string; itemSelector: string };

export interface UseGridFocusOptions {
  /** While true, the on-open effect focuses the first `initialFocus` match under `ref`. */
  open: boolean;
  /** Selectors tried in order to pick the element focused on open (e.g. selected → today → first enabled). */
  initialFocus: string[];
  strategy: GridFocusStrategy;
}

export interface GridFocus<C extends HTMLElement> {
  /** Attach to the container the on-open focus searches under. */
  ref: RefObject<C>;
  /** Attach to each roving container — it operates on `e.currentTarget`, so one handler can serve several grids. */
  onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
}

export function useGridFocus<C extends HTMLElement>({ open, initialFocus, strategy }: UseGridFocusOptions): GridFocus<C> {
  const ref = useRef<C>(null);

  // Selectors are static per call site; keep them in a ref so the focus effect
  // keys off `open` alone (a fresh array each render must not re-trigger it).
  const initialFocusRef = useRef(initialFocus);
  initialFocusRef.current = initialFocus;

  useEffect(() => {
    if (!open) return;
    const root = ref.current;
    if (!root) return;
    for (const sel of initialFocusRef.current) {
      const el = root.querySelector<HTMLElement>(sel);
      if (el) { el.focus(); return; }
    }
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>): void => {
    const container = e.currentTarget;
    const item = (e.target as HTMLElement).closest<HTMLElement>(strategy.itemSelector);
    if (!item) return;
    let next: HTMLElement | null | undefined;

    if (strategy.kind === 'grid') {
      const items = Array.from(container.querySelectorAll<HTMLElement>(strategy.itemSelector));
      const i = items.indexOf(item);
      if (i === -1) return;
      // Read the real column count off the grid so Up/Down jump a whole row.
      const tracks = getComputedStyle(container).gridTemplateColumns;
      const cols = Math.max(1, tracks ? tracks.split(' ').filter(Boolean).length : 1);
      if (e.key === KEYS.ArrowRight) next = items[Math.min(i + 1, items.length - 1)];
      else if (e.key === KEYS.ArrowLeft) next = items[Math.max(i - 1, 0)];
      else if (e.key === KEYS.ArrowDown) next = items[Math.min(i + cols, items.length - 1)];
      else if (e.key === KEYS.ArrowUp) next = items[Math.max(i - cols, 0)];
      else if (e.key === KEYS.Home) next = items[0];
      else if (e.key === KEYS.End) next = items[items.length - 1];
      else return;
    } else {
      const col = item.closest<HTMLElement>(strategy.columnSelector);
      if (!col) return;
      const items = Array.from(col.querySelectorAll<HTMLElement>(strategy.itemSelector));
      const i = items.indexOf(item);
      if (e.key === KEYS.ArrowDown) next = items[Math.min(i + 1, items.length - 1)];
      else if (e.key === KEYS.ArrowUp) next = items[Math.max(i - 1, 0)];
      else if (e.key === KEYS.Home) next = items[0];
      else if (e.key === KEYS.End) next = items[items.length - 1];
      else if (e.key === KEYS.ArrowRight || e.key === KEYS.ArrowLeft) {
        const cols = Array.from(container.querySelectorAll<HTMLElement>(strategy.columnSelector));
        const ci = cols.indexOf(col);
        const nc = cols[e.key === KEYS.ArrowRight ? Math.min(ci + 1, cols.length - 1) : Math.max(ci - 1, 0)];
        next = nc?.querySelector<HTMLElement>(strategy.itemSelector);
      } else return;
    }

    e.preventDefault();
    next?.focus();
  };

  return { ref, onKeyDown };
}
