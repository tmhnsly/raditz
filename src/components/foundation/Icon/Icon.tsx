import { createElement } from 'react';
import type { ReactElement, SVGProps } from 'react';
import { ICONS } from './icons';
import type { IconName } from './icons';
import { cx } from '../../internal';

export type { IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Registry icon name (see icons.ts). */
  name: IconName;
  /** Width/height — defaults to `1em` so it scales with surrounding text. */
  size?: string | number;
  strokeWidth?: number;
  /** When set, the icon is a labelled image for screen readers; otherwise aria-hidden. */
  title?: string;
}

/**
 * Icon — renders a named icon from the SuperRadix registry. Inherits color via
 * `currentColor` and sizes to `1em` by default, so it scales with surrounding
 * text and tints with the parent's color.
 *
 *   <Icon name="search" />
 *   <Icon name="bell" size="1.25rem" />
 */
export function Icon({ name, size = '1em', strokeWidth = 2, title, className, ...rest }: IconProps): ReactElement | null {
  const parts = ICONS[name];
  if (!parts) return null;
  return createElement(
    'svg',
    {
      className: cx('srx-icon', className),
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      role: title ? 'img' : undefined,
      'aria-hidden': title ? undefined : true,
      ...rest,
    } as SVGProps<SVGSVGElement>,
    title ? createElement('title', null, title) : null,
    parts.map((p, i) => createElement(p[0], { key: i, ...p[1] })),
  );
}
