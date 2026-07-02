import type { ReactElement, SVGAttributes } from 'react';
import { ICONS } from './icons';
import type { IconName } from './icons';
import { cx } from '../../internal';

export type { IconName };

export interface IconProps extends SVGAttributes<SVGElement> {
  /** Registry icon name (see icons.ts). */
  name: IconName;
  /** Width/height — a single size variable for consistency. Defaults to `1em`
   *  so it scales with surrounding text. */
  size?: string | number;
  /** Stroke weight of the (Lucide) glyph. */
  strokeWidth?: number;
  /** Icon color (defaults to `currentColor`, so it tints with the parent). */
  color?: string;
  /** When set, the icon is a labelled image for screen readers; otherwise aria-hidden. */
  title?: string;
}

/**
 * Icon — renders a named icon from the Raditz set, backed by react-icons
 * (Lucide), so every icon shares one consistent look and is sized by the single
 * `size` prop. Inherits color via `currentColor` and sizes to `1em` by default.
 *
 *   <Icon name="search" />
 *   <Icon name="instagram" size="1.25rem" />
 */
export function Icon({ name, size = '1em', strokeWidth = 2, color, title, className, ...rest }: IconProps): ReactElement | null {
  const Glyph = ICONS[name];
  if (!Glyph) return null;
  // No event handlers / hooks here on purpose — Icon stays a pure, server-
  // renderable glyph (spreading CONSUMER props through is fine; Icon itself
  // adds none). A *clickable* icon belongs in an interactive control
  // (IconButton / Button), so the react-icons graph never forces a client
  // boundary onto otherwise-static consumers.
  return (
    <Glyph
      className={cx('rdz-icon', className)}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      title={title}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    />
  );
}
