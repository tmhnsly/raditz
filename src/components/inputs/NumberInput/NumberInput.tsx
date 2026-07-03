'use client';
import { forwardRef, useState } from 'react';
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { cx, useControllableState, clamp, onKeys, KEYS } from '../../internal';

export interface NumberInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. */
  value?: number;
  /** Initial value (uncontrolled), clamped into [min, max]. @default 0 */
  defaultValue?: number;
  /** Fires when the committed value changes. */
  onValueChange?: (value: number) => void;
  /** Lower bound (unbounded when omitted). */
  min?: number;
  /** Upper bound (unbounded when omitted). */
  max?: number;
  /** Amount the buttons and arrow keys move by. @default 1 */
  step?: number;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Disable interaction — dimmed and non-interactive. @default false */
  disabled?: boolean;
}

const MINUS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const PLUS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <line x1="12" y1="5" x2="12" y2="19" />
  </svg>
);

/** Trim float dust from repeated fractional steps (0.1 + 0.2 → 0.3). */
const snap = (n: number): number => Number(n.toPrecision(12));

/**
 * NumberInput — a stepped numeric field: a − button, a free-typing input and a
 * + button in one frame. Controlled with `value` / `onValueChange`, or
 * uncontrolled with `defaultValue`. The buttons and ArrowUp/ArrowDown move by
 * `step` (Home/End jump to `min`/`max` when bounded); every committed value is
 * clamped into [min, max] and the buttons disable at the bounds. Typing is free
 * text — it commits (parse + clamp) on blur or Enter, and non-numeric text
 * reverts to the last committed value. Forwards its ref to the native <input>;
 * `aria-label`/`aria-labelledby` and Field's injected `id`/`aria-describedby`
 * route to the input, everything else spreads onto the root.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue = 0,
    onValueChange,
    min,
    max,
    step = 1,
    size = 'md',
    disabled = false,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const lo = min ?? -Infinity;
  const hi = max ?? Infinity;
  const [val, setVal] = useControllableState<number>({
    value,
    defaultValue: clamp(defaultValue, lo, hi),
    onChange: onValueChange,
  });
  // In-progress typing. Non-null only while editing; the display falls back to
  // the committed value once it's cleared (which is also how "revert" works).
  const [draft, setDraft] = useState<string | null>(null);

  const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s));
  /** Clear the draft and commit `n` (already clamped) if it actually changed. */
  const jump = (n: number): void => {
    setDraft(null);
    if (n !== val) setVal(n);
  };
  const commit = (): void => {
    if (draft === null) return;
    const n = parse(draft);
    // Invalid text just clears the draft — the display reverts to `val`.
    if (Number.isFinite(n)) jump(clamp(n, lo, hi));
    else setDraft(null);
  };
  const stepBy = (delta: number): void => {
    // A valid in-progress draft steps from what was typed, not the stale value.
    const typed = draft === null ? NaN : parse(draft);
    const base = Number.isFinite(typed) ? clamp(typed, lo, hi) : val;
    jump(clamp(snap(base + delta), lo, hi));
  };

  type KeyMap = Partial<Record<string, (e: KeyboardEvent<HTMLInputElement>) => void>>;
  const keyMap: KeyMap = {
    [KEYS.ArrowUp]: () => stepBy(step),
    [KEYS.ArrowDown]: () => stepBy(-step),
    [KEYS.Enter]: () => commit(),
  };
  // Home/End jump to the bounds — but only when bounded, so an unbounded field
  // keeps the native caret-to-start/end behaviour.
  if (Number.isFinite(lo)) keyMap[KEYS.Home] = () => jump(lo);
  if (Number.isFinite(hi)) keyMap[KEYS.End] = () => jump(hi);
  const handleKeys = onKeys<KeyboardEvent<HTMLInputElement>>(keyMap);

  // Spinbutton-style steppers are pointer affordances: they stay out of the tab
  // order (keyboard users step with the arrows on the input itself).
  const stepButton = (label: string, delta: number, atBound: boolean, icon: ReactElement): ReactElement => (
    <button
      type="button"
      className="rdz-numberinput__step"
      aria-label={label}
      tabIndex={-1}
      disabled={disabled || atBound}
      onClick={() => stepBy(delta)}
    >
      {icon}
    </button>
  );

  return (
    <div className={cx('rdz-numberinput', disabled && 'is-disabled', className)} data-size={size} {...rest}>
      {stepButton('Decrease', -step, val <= lo, MINUS)}
      <input
        ref={ref}
        id={id}
        className="rdz-numberinput__input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        value={draft ?? String(val)}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
        onKeyDown={disabled ? undefined : handleKeys}
        onBlur={commit}
      />
      {stepButton('Increase', step, val >= hi, PLUS)}
    </div>
  );
});
