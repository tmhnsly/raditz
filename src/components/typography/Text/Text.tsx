import * as React from 'react';
import { cx } from '../../internal';

type TextSize = 'l' | 'base' | 's' | 'caption';
type TextTone = 'default' | 'soft' | 'muted' | 'faint' | 'accent';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | React.ElementType;
  /** Type size. @default "base" */
  size?: TextSize;
  /** Ink level. @default "soft" */
  tone?: TextTone;
  /** Font weight token (regular|medium|semibold|bold). */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** Clamp to a readable measure for long-form prose. @default false */
  measure?: boolean;
  children?: React.ReactNode;
}

/**
 * Body copy. `as="p"` for paragraphs (default), `as="span"` for inline. `size`
 * and `tone` map to the type + ink scales; `measure` clamps line length for
 * long-form prose. Size/tone/weight are data-attributes styled in Text.scss.
 */
export function Text({ as = 'p', size = 'base', tone = 'soft', weight, measure = false, className, children, ...rest }: TextProps): React.ReactElement {
  const Tag: React.ElementType = as;
  return (
    <Tag
      className={cx('rdz-text', className)}
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-measure={measure || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
