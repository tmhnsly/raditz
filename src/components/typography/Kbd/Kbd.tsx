import * as React from 'react';
import { cx } from '../../internal';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * A keyboard key cap (⌘, Esc, ↵). Render one per key.
 */
export function Kbd({ className, children, ...rest }: KbdProps): React.ReactElement {
  return <kbd className={cx('rdz-kbd', className)} {...rest}>{children}</kbd>;
}
