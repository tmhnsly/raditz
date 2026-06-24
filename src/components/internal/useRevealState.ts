'use client';
import type { RefCallback } from 'react';
import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

export interface RevealStateOptions {
  /** Replay every time it re-enters view (default plays once). @default false */
  repeat?: boolean;
}

export interface RevealState<T extends Element = HTMLElement> {
  /** Attach to the element that reveals (skip it when `reduced`). */
  ref: RefCallback<T>;
  /** Whether the element should be in its final (revealed) state — true once it has
   *  scrolled into view, or immediately when the user prefers reduced motion. */
  revealed: boolean;
  /** The user prefers reduced motion → render the final state and don't observe. */
  reduced: boolean;
}

/**
 * The shared gate behind every scroll-reveal: folds reduced-motion + in-view into a
 * single `revealed` flag. {@link import('../motion/Reveal/Reveal').Reveal} and
 * `TextReveal` both build on this, so the reveal contract — and any bug in it, like
 * the StrictMode IntersectionObserver issue — lives in ONE place. Callers: when
 * `reduced`, render the final state WITHOUT the `ref`; otherwise attach `ref` and
 * gate the `.is-in` class on `revealed`.
 */
export function useRevealState<T extends Element = HTMLElement>({ repeat = false }: RevealStateOptions = {}): RevealState<T> {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<T>({ once: !repeat });
  return { ref, revealed: reduced || inView, reduced };
}
