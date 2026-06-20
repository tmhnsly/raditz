import { useState } from 'react';
import type { HTMLAttributes, ReactElement, CSSProperties } from 'react';
import { cx, useControllableState, clamp } from '../../internal';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. */
  value?: number;
  /** Initial value (uncontrolled). @default 0 */
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Number of stars. @default 5 */
  count?: number;
  /** Display only (renders any fractional value, e.g. 3.2). @default false */
  readOnly?: boolean;
  /** Disable interaction — dimmed and non-interactive. @default false */
  disabled?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Input granularity: whole or half stars. (Read-only display is always exact.) @default "full" */
  precision?: 'full' | 'half';
}

// Rounded-point star (lucide geometry) — softer than a sharp 5-point star.
const STAR = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

/**
 * Rating — a star rating input (or read-only display). Controlled with `value`
 * / `onChange`, or uncontrolled with `defaultValue`. `count` sets the number of
 * stars. Read-only mode renders any fractional value with an accurate CSS
 * percentage fill (e.g. 3.2 → the 4th star is 20% filled). For input, `precision`
 * selects whole (`full`) or `half` stars.
 */
export function Rating({
  value,
  defaultValue = 0,
  onChange,
  count = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  precision = 'full',
  className,
  ...rest
}: RatingProps): ReactElement {
  const [val, setVal] = useControllableState<number>({ value, defaultValue, onChange });
  const [hover, setHover] = useState(0);
  const shown = hover || val;
  const cls = cx('rdz-rating', `rdz-rating--${size}`, readOnly && 'is-readonly', disabled && 'is-disabled');
  const pick = (v: number): void => setVal(val === v ? 0 : v);
  const label = (v: number): string => `${v} star${v === 1 ? '' : 's'}`;

  return (
    <div
      className={cx(cls, className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${val} of ${count}`}
      aria-disabled={disabled || undefined}
      onMouseLeave={() => setHover(0)}
      {...rest}
    >
      {Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        const fill = clamp(shown - i, 0, 1); // 0..1 fraction of this star
        return (
          <span className="rdz-rating__star" key={n}>
            <span className="rdz-rating__bg">{STAR}</span>
            <span className="rdz-rating__fg" style={{ '--rdz-rating-fill': `${fill * 100}%` } as CSSProperties}>{STAR}</span>
            {readOnly ? null : precision === 'half' ? (
              <>
                <button type="button" disabled={disabled} className="rdz-rating__hit rdz-rating__hit--l" role="radio" aria-checked={val === n - 0.5} aria-label={label(n - 0.5)} onMouseEnter={() => setHover(n - 0.5)} onClick={() => pick(n - 0.5)} />
                <button type="button" disabled={disabled} className="rdz-rating__hit rdz-rating__hit--r" role="radio" aria-checked={val === n} aria-label={label(n)} onMouseEnter={() => setHover(n)} onClick={() => pick(n)} />
              </>
            ) : (
              <button type="button" disabled={disabled} className="rdz-rating__hit" role="radio" aria-checked={val === n} aria-label={label(n)} onMouseEnter={() => setHover(n)} onClick={() => pick(n)} />
            )}
          </span>
        );
      })}
    </div>
  );
}
