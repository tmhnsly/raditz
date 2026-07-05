import * as React from 'react';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';
import { cx, useRender } from '../../internal';
import type { RenderProp } from '../../internal';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "ghost" */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'glass';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  /** Render *as* another element (e.g. a router `<Link>`), merging the styling +
   *  data-attributes. Takes precedence over `href`. */
  render?: RenderProp<{ variant: string; size: string }>;
  /** Icon registry name or node. */
  icon?: IconName | React.ReactNode;
  /** Required for accessibility. */
  'aria-label': string;
  children?: React.ReactNode;
}

/**
 * Square, icon-only button. Always pass an `aria-label`. Provide the glyph via
 * the `icon` prop (a registry name) or as a child. `variant` matches Button's
 * weights. Renders a `<button>`, an `<a>` (`href`), or your `render` element.
 */
export function IconButton({ variant = 'ghost', size = 'md', href, render, type = 'button', icon, className, children, ...rest }: IconButtonProps): React.ReactElement {
  const inner = typeof icon === 'string' ? <Icon name={icon as IconName} size="1.25em" /> : (icon || children);
  const ownProps = {
    className: cx('rdz-icon-btn', className),
    'data-variant': variant,
    'data-size': size,
    children: inner,
    ...rest,
  };
  const target = render ?? (href ? <a href={href} /> : <button type={type} />);
  return useRender({ render: target, props: ownProps, state: { variant, size } });
}
