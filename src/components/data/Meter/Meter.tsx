import * as React from 'react';
import { cx, toPercent } from '../../internal';
import type { StatusTone } from '../../internal';

/** A colour threshold: values up to `to` paint with `tone`. */
export interface MeterSegment {
  to: number;
  tone: StatusTone;
}

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The measured value. */
  value: number;
  /** Range floor. @default 0 */
  min?: number;
  /** Range ceiling. @default 100 */
  max?: number;
  /** Caption above the track. */
  label?: React.ReactNode;
  /** Show the value on the right of the label. `true` prints `value/max`; pass a
   *  formatter for anything else (e.g. `(v) => `${v}%``). @default false */
  showValue?: boolean | ((value: number, max: number) => React.ReactNode);
  /** Track thickness. @default "md" */
  size?: 'sm' | 'md';
  /** Fill tone (when no `segments` match). @default "accent" */
  tone?: StatusTone;
  /** Colour thresholds — the fill takes the tone of the first segment whose `to`
   *  the value hasn't exceeded (e.g. disk usage green → amber → red). */
  segments?: MeterSegment[];
}

/**
 * Meter — a scalar measurement within a known range (disk usage, score, load),
 * as distinct from {@link Progress} which tracks task completion. Renders a
 * `role="meter"` with `aria-valuenow/min/max` and a formatted `aria-valuetext`;
 * `segments` shift the fill colour across thresholds. Value-driven, not animated.
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  tone = 'accent',
  segments,
  className,
  style,
  ...rest
}: MeterProps): React.ReactElement {
  const clamped = Math.min(max, Math.max(min, value));
  const pct = toPercent(clamped - min, max - min);
  const fillTone = segments?.find((s) => clamped <= s.to)?.tone ?? tone;
  const valueText = typeof showValue === 'function' ? showValue(clamped, max) : `${clamped} / ${max}`;

  return (
    <div
      className={cx('rdz-meter', className)}
      data-size={size}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={typeof valueText === 'string' ? valueText : undefined}
      aria-label={typeof label === 'string' ? label : undefined}
      style={style}
      {...rest}
    >
      {(label || showValue) && (
        <div className="rdz-meter__head">
          {label ? <span className="rdz-meter__label">{label}</span> : <span />}
          {showValue ? <span className="rdz-meter__value">{valueText}</span> : null}
        </div>
      )}
      <div className="rdz-meter__track">
        <div
          className="rdz-meter__fill"
          data-color={fillTone}
          style={{ '--rdz-meter-pct': `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
