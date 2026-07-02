import * as React from 'react';
import { cx } from '../../internal';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state (uncontrolled). */
  defaultChecked?: boolean;
  /** Native change handler — fires with the checkbox change event. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * An on/off toggle. Controlled via `checked` + `onChange`, or uncontrolled with
 * `defaultChecked`. Wrap with a <label> (or pass `aria-label`) for a hit target.
 * Forwards its ref to the native checkbox input (role="switch").
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, style, ...rest },
  ref,
) {
  return (
    <span className={cx('rdz-switch', className)} style={style}>
      <input ref={ref} type="checkbox" role="switch" {...rest} />
      <span className="rdz-switch__track" aria-hidden="true">
        <span className="rdz-switch__thumb" />
      </span>
    </span>
  );
});
