import type { HTMLAttributes, ReactElement } from 'react';
import { cx } from '../../internal';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A hairline rule. Horizontal by default; `orientation="vertical"` for inline
 * dividers between row items.
 */
export function Separator({ orientation = 'horizontal', className, ...rest }: SeparatorProps): ReactElement {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx('rdz-separator', className)}
      data-orientation={orientation}
      {...rest}
    />
  );
}
