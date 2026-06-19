import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

/**
 * @startingPoint section="Surfaces" subtitle="Cards, callouts, separators & avatars" viewport="700x380"
 */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Surface style. @default "solid" */
  variant?: 'solid' | 'glass' | 'flat';
  /** Add a hover lift for clickable cards. @default false */
  interactive?: boolean;
  as?: ElementType;
  children?: ReactNode;
}

/**
 * The base surface. `variant` is "solid" (default), "glass" (frosted blur) or
 * "flat" (no shadow). `interactive` adds a hover lift for clickable cards.
 */
export function Card({
  variant = 'solid',
  interactive = false,
  as = 'div',
  className,
  children,
  ...rest
}: CardProps): ReactElement {
  const Tag = as;
  const cls = cx(
    'srx-card',
    variant === 'glass' && 'srx-card--glass',
    variant === 'flat' && 'srx-card--flat',
    interactive && 'srx-card--interactive',
    className,
  );
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
