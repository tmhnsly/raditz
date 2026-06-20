import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface FullBleedProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Breaks an element out of its container to span the full viewport width, while
 * keeping it in normal document flow. Use for full-bleed media bands and color
 * sections inside a constrained Container.
 */
export function FullBleed({ as = 'div', className, children, ...rest }: FullBleedProps): ReactElement {
  const Tag = as;
  return (
    <Tag className={cx('rdz-full-bleed', className)} {...rest}>
      {children}
    </Tag>
  );
}
