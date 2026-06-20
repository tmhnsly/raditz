'use client';
import * as React from 'react';
import { useRef, useCallback } from 'react';
import { useControllableState, clamp, roundToStep, onKeys, KEYS, cx } from '../../internal';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. */
  value?: number;
  /** Initial value (uncontrolled). @default 0 */
  defaultValue?: number;
  /** Fires with the new value on drag/keyboard. */
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** Snap increment. @default 1 */
  step?: number;
  /** Show notches at each interior step (not at the 0%/100% ends). @default false */
  ticks?: boolean;
  disabled?: boolean;
}

/**
 * Slider — a single-thumb range input (Radix Slider). Drag the track/thumb or
 * use arrow / Home / End keys. Controlled with `value`, uncontrolled with
 * `defaultValue`. Emits numbers in `[min, max]` snapped to `step`.
 */
export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ticks = false,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Value',
  'aria-labelledby': ariaLabelledby,
  ...rest
}: SliderProps): React.ReactElement {
  const [val, setVal] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const trackRef = useRef<HTMLSpanElement>(null);
  const current = clamp(val, min, max);
  const pct = ((current - min) / (max - min)) * 100;

  // Interior step notches (exclude the 0% and 100% ends).
  const tickPts: number[] = [];
  if (ticks && step > 0) {
    const n = Math.round((max - min) / step);
    for (let i = 1; i < n; i += 1) tickPts.push((i / n) * 100);
  }

  const setFromClientX = useCallback((clientX: number): void => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = clamp((clientX - r.left) / r.width, 0, 1);
    const next = clamp(roundToStep(min + ratio * (max - min), step, min), min, max);
    setVal(next);
  }, [min, max, step, setVal]);

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>): void => {
    if (disabled) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>): void => {
    if (!disabled && e.buttons === 1) setFromClientX(e.clientX);
  };
  const commit = (next: number): void => {
    if (disabled) return;
    setVal(clamp(roundToStep(next, step, min), min, max));
  };
  const onKeyDown = onKeys<React.KeyboardEvent<HTMLSpanElement>>({
    [KEYS.ArrowRight]: () => commit(current + step),
    [KEYS.ArrowUp]: () => commit(current + step),
    [KEYS.ArrowLeft]: () => commit(current - step),
    [KEYS.ArrowDown]: () => commit(current - step),
    [KEYS.Home]: () => commit(min),
    [KEYS.End]: () => commit(max),
  });

  return (
    <span
      ref={trackRef}
      className={cx('rdz-slider', disabled && 'rdz-slider--disabled', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      {...rest}
    >
      <span className="rdz-slider__track">
        <span className="rdz-slider__range" style={{ '--rdz-slider-pct': `${pct}%` } as React.CSSProperties} />
        {tickPts.map((t, i) => (
          <span key={i} className="rdz-slider__tick" style={{ '--rdz-slider-tick': `${t}%` } as React.CSSProperties} />
        ))}
      </span>
      <span
        className="rdz-slider__thumb"
        style={{ '--rdz-slider-pct': `${pct}%` } as React.CSSProperties}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
      />
    </span>
  );
}
