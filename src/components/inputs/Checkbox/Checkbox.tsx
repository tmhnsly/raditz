import * as React from 'react';
import { cx } from '../../internal';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Optional inline label rendered beside the box; clicking it toggles too. */
  label?: React.ReactNode;
  /** Tri-state "some selected" look — sets the DOM `indeterminate` property
   *  (there is no HTML attribute for it). Announced as "mixed" by screen readers. */
  indeterminate?: boolean;
}

/**
 * A checkbox with the accent fill + animated check. Controlled or uncontrolled
 * like a native input. Renders as a `<label>` so clicking the box — or the
 * optional `label` text — reliably toggles it. Pass `aria-label` when you omit
 * `label` so the control still has an accessible name. `indeterminate` gives
 * the tri-state "some selected" look (e.g. a table's select-all header).
 */
export function Checkbox({ className, style, label, indeterminate, ...rest }: CheckboxProps): React.ReactElement {
  return (
    <label className={cx('rdz-check', className)} style={style}>
      <input
        type="checkbox"
        // `indeterminate` only exists as a DOM property; the inline callback ref
        // re-runs every render, so it tracks the prop without needing an effect.
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate;
        }}
        {...rest}
      />
      <span className="rdz-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label != null && <span className="rdz-check__label">{label}</span>}
    </label>
  );
}
