import * as React from 'react';
import { cx, toPercent } from '../../internal';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0–max). Omit / null for indeterminate. */
  value?: number | null;
  /** Maximum value. @default 100 */
  max?: number;
  /** Bar thickness. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Force the looping indeterminate state. @default false */
  indeterminate?: boolean;
}

/**
 * Progress — a determinate or indeterminate progress bar (Radix Progress).
 * Pass `value` (0–`max`) for determinate; omit it or set `indeterminate` for a
 * looping indeterminate bar.
 */
export function Progress({ value = null, max = 100, size = 'md', indeterminate = false, className, ...rest }: ProgressProps): React.ReactElement {
  const isInd = indeterminate || value == null;
  const pct = isInd ? null : toPercent(value as number, max);
  const cls = cx(
    'rdz-progress',
    size !== 'md' && `rdz-progress--${size}`,
    isInd && 'rdz-progress--indeterminate',
    className,
  );
  return (
    <div
      className={cls}
      role="progressbar"
      aria-label="Progress"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isInd ? undefined : value ?? undefined}
      {...rest}
    >
      <div className="rdz-progress__indicator" style={isInd ? undefined : ({ '--rdz-progress-pct': `${pct}%` } as React.CSSProperties)} />
    </div>
  );
}
