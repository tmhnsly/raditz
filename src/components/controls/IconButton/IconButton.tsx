import * as React from 'react';
import { Icon } from '../../foundation/Icon/Icon';
import type { IconName } from '../../foundation/Icon/Icon';
import { cx } from '../../internal';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "ghost" */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'glass';
  /** @default "md" */
  size?: 'sm' | 'md';
  href?: string;
  /** Icon registry name or node. */
  icon?: IconName | React.ReactNode;
  /** Required for accessibility. */
  'aria-label': string;
  children?: React.ReactNode;
}

/**
 * Square, icon-only button. Always pass an `aria-label`. Provide the glyph via
 * the `icon` prop (a registry name) or as a child. `variant` matches Button's
 * weights (solid / soft / outline / ghost).
 */
export function IconButton({ variant = 'ghost', size = 'md', href, type = 'button', icon, className, children, ...rest }: IconButtonProps): React.ReactElement {
  const cls = cx('srx-icon-btn', `srx-icon-btn--${variant}`, size === 'sm' && 'srx-icon-btn--sm', className);
  const inner = typeof icon === 'string' ? <Icon name={icon as IconName} size="1.25em" /> : (icon || children);
  if (href) {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a href={href} className={cls} {...anchorRest}>{inner}</a>;
  }
  return <button type={type} className={cls} {...rest}>{inner}</button>;
}
