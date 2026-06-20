import * as React from 'react';
import { cx } from '../../internal';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Optional inline label rendered beside the box; clicking it toggles too. */
  label?: React.ReactNode;
}

/**
 * A checkbox with the accent fill + animated check. Controlled or uncontrolled
 * like a native input. Renders as a `<label>` so clicking the box — or the
 * optional `label` text — reliably toggles it. Pass `aria-label` when you omit
 * `label` so the control still has an accessible name.
 */
export function Checkbox({ className, style, label, ...rest }: CheckboxProps): React.ReactElement {
  return (
    <label className={cx('rdz-check', className)} style={style}>
      <input type="checkbox" {...rest} />
      <span className="rdz-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label != null && <span className="rdz-check__label">{label}</span>}
    </label>
  );
}
