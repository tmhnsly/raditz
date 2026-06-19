import * as React from 'react';
import { cx } from '../../internal';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Any CSS length; defaults to 1.25em so it scales with text. */
  size?: number | string;
  /** Ring stroke weight. @default 2.5 */
  strokeWidth?: number;
  /** Screen-reader label. @default "Loading" */
  label?: string;
}

/**
 * Spinner — an indeterminate loading indicator. Sizes to `1.25em` by default
 * (or pass `size`), inherits `currentColor`, so it sits inline in buttons,
 * inputs and surfaces. `label` is announced to screen readers.
 */
export function Spinner({
  size,
  strokeWidth = 2.5,
  label = 'Loading',
  className,
  style,
  ...rest
}: SpinnerProps): React.ReactElement {
  return (
    <span
      className={cx('srx-spinner', className)}
      role="status"
      aria-live="polite"
      style={size != null ? ({ '--srx-spinner-size': typeof size === 'number' ? `${size}px` : size, ...style } as React.CSSProperties) : style}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.2" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
      <span className="srx-visually-hidden">{label}</span>
    </span>
  );
}
