import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Bubble text. */
  label: ReactNode;
  children?: ReactNode;
}

/**
 * A hover/focus tooltip. Wraps a trigger element; `label` is the bubble text.
 * The trigger must be focusable for keyboard users (a button or link).
 */
export function Tooltip({ label, className, children, ...rest }: TooltipProps): ReactElement {
  return (
    <span className={cx('srx-tooltip', className)} {...rest}>
      {children}
      <span className="srx-tooltip__bubble" role="tooltip">{label}</span>
    </span>
  );
}
