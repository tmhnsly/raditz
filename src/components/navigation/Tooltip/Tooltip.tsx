import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Bubble text. */
  label: ReactNode;
  /** Horizontal alignment of the bubble vs. the trigger. Use `start`/`end` near a
   *  viewport edge so the bubble opens inward instead of overflowing. @default "center" */
  align?: 'center' | 'start' | 'end';
  children?: ReactNode;
}

/**
 * A hover/focus tooltip. Wraps a trigger element; `label` is the bubble text.
 * The trigger must be focusable for keyboard users (a button or link).
 */
export function Tooltip({ label, align = 'center', className, children, ...rest }: TooltipProps): ReactElement {
  return (
    <span className={cx('srx-tooltip', align !== 'center' && `srx-tooltip--${align}`, className)} {...rest}>
      {children}
      <span className="srx-tooltip__bubble" role="tooltip">{label}</span>
    </span>
  );
}
