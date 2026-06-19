import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

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

/** Activate on Enter or Space — gives button semantics to non-button elements. */
export function onActivate<E extends AnyKeyEvent = ReactKeyboardEvent>(handler: KeyHandler<E>): KeyHandler<E> {
  return onKeys<E>({ [KEYS.Enter]: handler, [KEYS.Space]: handler });
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
