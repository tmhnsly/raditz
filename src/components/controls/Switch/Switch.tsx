import * as React from 'react';
import { cx } from '../../internal';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * An on/off toggle. Controlled via `checked` + `onChange`, or uncontrolled with
 * `defaultChecked`. Wrap with a <label> (or pass `aria-label`) for a hit target.
 */
export function Switch({ className, style, ...rest }: SwitchProps): React.ReactElement {
  return (
    <span className={cx('rdz-switch', className)} style={style}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="rdz-switch__track" aria-hidden="true">
        <span className="rdz-switch__thumb" />
      </span>
    </span>
  );
}
