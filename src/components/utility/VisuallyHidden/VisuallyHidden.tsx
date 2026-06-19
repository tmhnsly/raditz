import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

/**
 * VisuallyHidden — hides content visually while keeping it for screen readers
 * (Radix VisuallyHidden).
 */
export function VisuallyHidden({ as = 'span', className, children, ...rest }: VisuallyHiddenProps): ReactElement {
  const Tag = as;
  return (
    <Tag className={cx('srx-visually-hidden', className)} {...rest}>
      {children}
    </Tag>
  );
}
