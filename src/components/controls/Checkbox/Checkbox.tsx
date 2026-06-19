import * as React from 'react';
import { cx } from '../../internal';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * A checkbox with the accent fill + animated check. Controlled or uncontrolled
 * like a native input.
 */
export function Checkbox({ className, style, ...rest }: CheckboxProps): React.ReactElement {
  return (
    <span className={cx('srx-check', className)} style={style}>
      <input type="checkbox" {...rest} />
      <span className="srx-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </span>
  );
}
