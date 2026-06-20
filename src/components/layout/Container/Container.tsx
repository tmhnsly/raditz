import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

/**
 * @startingPoint section="Layout" subtitle="Centered, gutter-aware page width" viewport="700x430"
 */
export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Max-width cap. @default "default" */
  size?: 'default' | 'narrow' | 'wide' | 'prose';
  /** Remove side gutters. @default false */
  bleed?: boolean;
  /** Element to render. @default "div" */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Centers content and applies responsive gutters. The outermost layout primitive
 * on most pages. `size` caps the max-width; `bleed` removes the side padding.
 */
export function Container({
  size = 'default',
  bleed = false,
  as = 'div',
  className,
  children,
  ...rest
}: ContainerProps): ReactElement {
  const Tag = as;
  return (
    <Tag
      className={cx('rdz-container', className)}
      data-size={size}
      data-bleed={bleed ? '' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
