import * as React from 'react';
import { cx } from '../../internal';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Group name — shared across a radio set. */
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
}

/**
 * A single radio control. Give every radio in a group the same `name`.
 * Forwards its ref to the native <input type="radio">.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, style, ...rest },
  ref,
) {
  return (
    <span className={cx('rdz-radio-ctl', className)} style={style}>
      <input ref={ref} type="radio" {...rest} />
      <span className="rdz-radio-ctl__box" aria-hidden="true" />
    </span>
  );
});
