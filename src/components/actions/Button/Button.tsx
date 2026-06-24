import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode, ReactElement } from 'react';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';
import { cx } from '../../internal';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. @default "primary" */
  variant?: 'primary' | 'secondary' | 'soft' | 'outline' | 'ghost' | 'glass';
  /** Size. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Render an anchor instead of a button. */
  href?: string;
  /** Leading icon — a registry name or a node. */
  icon?: IconName | ReactNode;
  /** Trailing icon — a registry name or a node. */
  iconTrailing?: IconName | ReactNode;
  children?: ReactNode;
}

/**
 * The primary action component. `variant` sets the visual weight, `size` the
 * scale. Renders an `<a>` when `href` is set, otherwise a `<button>`. Pass
 * `icon` / `iconTrailing` (a registry name or node) for auto-sized icons.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  icon,
  iconTrailing,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const cls = cx('rdz-btn', `rdz-btn--${variant}`, size !== 'md' && `rdz-btn--${size}`, className);
  const lead = typeof icon === 'string' ? <Icon name={icon as IconName} size="1.15em" /> : icon;
  const trail = typeof iconTrailing === 'string' ? <Icon name={iconTrailing as IconName} size="1.15em" /> : iconTrailing;
  const inner = (
    <>
      {lead}
      {children}
      {trail}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  );
}
