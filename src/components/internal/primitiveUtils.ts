import { useState, useCallback, useRef, useId } from 'react';

// Shared internals for Raditz primitives. Kept dependency-free (React only)
// so the whole library still ships as a single CDN-friendly bundle.

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

type SetState<T> = (next: T | ((prev: T) => T)) => void;

/**
 * Controlled/uncontrolled state, Radix-style. Pass `value` to control it, or
 * `defaultValue` to let the component own it; `onChange` fires either way.
 */
export function useControllableState<T>({ value, defaultValue, onChange }: ControllableStateOptions<T>): [T, SetState<T>] {
  const [uncontrolled, setUncontrolled] = useState<T | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = (isControlled ? value : uncontrolled) as T;
  const set = useCallback<SetState<T>>(
    (next) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
      if (!isControlled) setUncontrolled(resolved);
      if (onChange) onChange(resolved);
    },
    [isControlled, onChange, current],
  );
  return [current, set];
}

/** Stable unique id (SSR-safe via React.useId when present). */
export function useStableId(prefix = 'rdz'): string {
  const reactId = typeof useId === 'function' ? useId() : null;
  const fallback = useRef(`${prefix}-${Math.random().toString(36).slice(2, 9)}`);
  return reactId ? `${prefix}-${reactId.replace(/:/g, '')}` : fallback.current;
}

/** Clamp n into [min, max]. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Round a value to the nearest step starting from min. */
export function roundToStep(value: number, step: number, min: number): number {
  if (!step) return value;
  return min + Math.round((value - min) / step) * step;
}
