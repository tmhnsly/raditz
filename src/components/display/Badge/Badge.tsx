import * as React from 'react';
import { cx } from '../../internal';
import type { StatusTone } from '../../internal';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Fill style. @default "soft" */
  variant?: 'solid' | 'soft' | 'outline';
  /** Semantic tone. @default "accent" */
  color?: StatusTone;
  /** Leading status dot. @default false */
  dot?: boolean;
  children?: React.ReactNode;
}

/**
 * A small status / category label. `variant` is the fill style, `color` the
 * semantic tone. Pass `dot` for a leading status dot.
 */
export function Badge({ variant = 'soft', color = 'accent', dot = false, className, children, ...rest }: BadgeProps): React.ReactElement {
  return (
    <span className={cx('rdz-badge', className)} data-variant={variant} data-color={color} {...rest}>
      {dot && <span className="rdz-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
