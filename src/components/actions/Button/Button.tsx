import type { ButtonHTMLAttributes, ReactNode, ReactElement } from 'react';
import { Icon } from '../../display/Icon/Icon';
import type { IconName } from '../../display/Icon/Icon';
import { cx, useRender } from '../../internal';
import type { RenderProp } from '../../internal';

/** State handed to a function `render`. */
export interface ButtonState {
  variant: NonNullable<ButtonProps['variant']>;
  size: NonNullable<ButtonProps['size']>;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. @default "primary" */
  variant?: 'primary' | 'secondary' | 'soft' | 'outline' | 'ghost' | 'glass';
  /** Size. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Render an anchor instead of a button. */
  href?: string;
  /** Render *as* another element — e.g. a router `<Link>` — keeping the button's
   *  styling, data-attributes and handlers (Base UI-style composition). Takes
   *  precedence over `href`. */
  render?: RenderProp<ButtonState>;
  /** Leading icon — a registry name or a node. */
  icon?: IconName | ReactNode;
  /** Trailing icon — a registry name or a node. */
  iconTrailing?: IconName | ReactNode;
  children?: ReactNode;
}

/**
 * The primary action component. `variant` sets the visual weight, `size` the
 * scale. Renders a `<button>` by default, an `<a>` when `href` is set, or any
 * element you pass via `render` (e.g. a framework `<Link>`) — the styling,
 * data-attributes and handlers merge onto it. Pass `icon` / `iconTrailing`
 * (a registry name or node) for auto-sized icons.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  render,
  type = 'button',
  icon,
  iconTrailing,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const lead = typeof icon === 'string' ? <Icon name={icon as IconName} size="1.15em" /> : icon;
  const trail = typeof iconTrailing === 'string' ? <Icon name={iconTrailing as IconName} size="1.15em" /> : iconTrailing;
  const ownProps = {
    className: cx('rdz-btn', className),
    'data-variant': variant,
    'data-size': size,
    children: (<>{lead}{children}{trail}</>),
    ...rest,
  };
  // One resolution path: explicit `render` → default `<a>` (href) → `<button>`.
  const target = render ?? (href ? <a href={href} /> : <button type={type} />);
  return useRender({ render: target, props: ownProps, state: { variant, size } });
}
