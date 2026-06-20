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
 */
export function Radio({ className, style, ...rest }: RadioProps): React.ReactElement {
  return (
    <span className={cx('rdz-radio-ctl', className)} style={style}>
      <input type="radio" {...rest} />
      <span className="rdz-radio-ctl__box" aria-hidden="true" />
    </span>
  );
}
