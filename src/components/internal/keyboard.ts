'use client';
import { useCallback, useState } from 'react';
import type { Dispatch, KeyboardEvent as ReactKeyboardEvent, SetStateAction } from 'react';

/** Canonical KeyboardEvent.key values — use these instead of magic strings. */
export const KEYS = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Comma: ',',
} as const;

type AnyKeyEvent = { key: string; preventDefault(): void };
type KeyHandler<E> = (e: E) => void;

/**
 * Build an onKeyDown handler from a key → callback map. Handled keys call
 * preventDefault by default; pass { preventDefault: false } to opt out.
 *
 *   onKeyDown={onKeys({ [KEYS.Enter]: submit, [KEYS.Escape]: close })}
 */
export function onKeys<E extends AnyKeyEvent = ReactKeyboardEvent>(
  map: Partial<Record<string, KeyHandler<E>>>,
  options: { preventDefault?: boolean } = {},
): KeyHandler<E> {
  const { preventDefault = true } = options;
  return (e) => {
    const handler = map[e.key];
    if (handler) {
      if (preventDefault) e.preventDefault();
      handler(e);
    }
  };
}

export type Orientation = 'vertical' | 'horizontal' | 'both';

/**
 * Compute the next index for arrow-key roving navigation. Returns `null` when
 * the key isn't a navigation key, so callers can fall through to other handling.
 */
export function rovingIndex(
  key: string,
  current: number,
  count: number,
  options: { orientation?: Orientation; loop?: boolean } = {},
): number | null {
  const { orientation = 'vertical', loop = true } = options;
  const forward = orientation === 'horizontal' ? KEYS.ArrowRight : KEYS.ArrowDown;
  const backward = orientation === 'horizontal' ? KEYS.ArrowLeft : KEYS.ArrowUp;
  const forwardBoth = orientation === 'both' && (key === KEYS.ArrowRight || key === KEYS.ArrowDown);
  const backwardBoth = orientation === 'both' && (key === KEYS.ArrowLeft || key === KEYS.ArrowUp);

  if (key === forward || forwardBoth) return loop ? (current + 1) % count : Math.min(current + 1, count - 1);
  if (key === backward || backwardBoth) return loop ? (current - 1 + count) % count : Math.max(current - 1, 0);
  if (key === KEYS.Home) return 0;
  if (key === KEYS.End) return count - 1;
  return null;
}

export interface UseRovingOptions {
  /** Number of items to rove over. */
  count: number;
  /** @default 'vertical' */
  orientation?: Orientation;
  /** Wrap past the ends. @default true */
  loop?: boolean;
  /** Initial active index. @default 0 */
  initial?: number;
  /** Fired on Enter/Space with the active index. */
  onSelect?: (index: number) => void;
}

export interface Roving {
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  /** Spread onto the roving container (or focused element). */
  onKeyDown: (e: ReactKeyboardEvent) => void;
}

/**
 * The one stateful roving-navigation hook. Owns the active index and turns
 * arrow / Home / End into index moves via {@link rovingIndex} (loop + orientation
 * aware); Enter/Space fire `onSelect`. Callers map `active` to focus/selection.
 * Use this instead of re-implementing arrow handling per component.
 */
export function useRoving({ count, orientation = 'vertical', loop = true, initial = 0, onSelect }: UseRovingOptions): Roving {
  const [active, setActive] = useState(initial);
  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const next = rovingIndex(e.key, active, count, { orientation, loop });
      if (next !== null) { e.preventDefault(); setActive(next); return; }
      if ((e.key === KEYS.Enter || e.key === KEYS.Space) && onSelect) { e.preventDefault(); onSelect(active); }
    },
    [active, count, orientation, loop, onSelect],
  );
  return { active, setActive, onKeyDown };
}
