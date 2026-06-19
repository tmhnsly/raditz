import * as React from 'react';
import { cx } from '../../internal';

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
  const pct = isInd ? null : Math.max(0, Math.min(100, (value / max) * 100));
  const cls = cx(
    'srx-progress',
    size !== 'md' && `srx-progress--${size}`,
    isInd && 'srx-progress--indeterminate',
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
      <div className="srx-progress__indicator" style={isInd ? undefined : ({ '--srx-progress-pct': `${pct}%` } as React.CSSProperties)} />
    </div>
  );
}
