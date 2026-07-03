import * as React from 'react';
import { cx } from '../../internal';

export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default "div" */
  as?: React.ElementType;
  /** Clamp to a readable line length. @default true */
  measure?: boolean;
  /** Body type scale. @default "base" */
  size?: 'base' | 'lg';
  children?: React.ReactNode;
}

/**
 * Prose — a long-form typography scope for rendered rich text (Markdown/MDX/CMS
 * HTML) that you don't control element-by-element. Wrap the content and its
 * descendant headings, paragraphs, lists, links, quotes, code, tables, images
 * and rules pick up token-driven rhythm and spacing — no per-element classes.
 * `measure` clamps the column to a readable length; `size` bumps the body scale.
 */
export function Prose({ as: Tag = 'div', measure = true, size = 'base', className, children, ...rest }: ProseProps) {
  return (
    <Tag className={cx('rdz-prose', measure && 'is-measured', className)} data-size={size} {...rest}>
      {children}
    </Tag>
  );
}
