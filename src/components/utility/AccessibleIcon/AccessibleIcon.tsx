import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface AccessibleIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text announced to screen readers. */
  label: string;
  /** The icon (hidden from assistive tech). */
  children?: ReactNode;
}

/**
 * AccessibleIcon — wraps a decorative icon with a screen-reader label (Radix
 * AccessibleIcon). The icon is hidden from assistive tech; `label` is announced.
 */
export function AccessibleIcon({ label, className, children, ...rest }: AccessibleIconProps): ReactElement {
  return (
    <span className={cx('srx-accessible-icon', className)} {...rest}>
      <span aria-hidden="true" className="srx-accessible-icon__glyph">
        {children}
      </span>
      <span className="srx-visually-hidden">{label}</span>
    </span>
  );
}
