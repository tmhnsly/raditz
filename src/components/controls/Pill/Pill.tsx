import * as React from 'react';
import { cx } from '../../internal';

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state (accent fill). @default false */
  active?: boolean;
  children?: React.ReactNode;
}

/**
 * A rounded, toggleable chip — filter rows, tag selectors. `active` flips it to
 * the accent fill. Renders a <button> so it's keyboard-operable.
 */
export function Pill({ active = false, className, children, ...rest }: PillProps): React.ReactElement {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx('rdz-pill', active && 'rdz-pill--active', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
