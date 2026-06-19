import * as React from 'react';
import { cx } from '../../internal';

type HeadingSizeKey = 1 | 2 | 3 | 4 | 'display' | 'display-2xl';

/**
 * @startingPoint section="Typography" subtitle="Display + heading scale" viewport="700x340"
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Tag + size: 1–4, or a display size. @default 2 */
  level?: 1 | 2 | 3 | 4;
  /** Override the visual size independent of the tag. */
  size?: 1 | 2 | 3 | 4 | 'display' | 'display-2xl';
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * Section / page heading in the display typeface. `level` picks both the tag
 * (h1–h4) and the size; override the visual size with `size` (e.g. an h2 that
 * looks like display). `accent` colors a trailing period — the house flourish.
 */
export function Heading({ level = 2, size, as, className, style, children, ...rest }: HeadingProps): React.ReactElement {
  const Tag: React.ElementType = as || (typeof level === 'number' ? `h${level}` : 'h2');
  const key: HeadingSizeKey = size || level;
  return (
    <Tag className={cx('srx-heading', className)} data-size={key} style={style} {...rest}>
      {children}
    </Tag>
  );
}
