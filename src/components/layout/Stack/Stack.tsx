import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Flex direction. @default "column" */
  direction?: 'row' | 'column';
  /** Gap as a spacing step (1–12). @default 4 */
  gap?: number;
  /** align-items value. */
  align?: CSSProperties['alignItems'];
  /** justify-content value. */
  justify?: CSSProperties['justifyContent'];
  /** Allow wrapping. @default false */
  wrap?: boolean;
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Flexbox stack. Vertical by default; pass `direction="row"` for a horizontal
 * row. `gap` is a spacing-scale step (1–12). `align` / `justify` map to flexbox.
 */
export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  as = 'div',
  className,
  children,
  ...rest
}: StackProps): ReactElement {
  const Tag = as;
  return (
    <Tag
      className={cx('rdz-stack', className)}
      data-wrap={wrap ? '' : undefined}
      style={
        {
          '--rdz-stack-dir': direction,
          '--rdz-stack-gap': `var(--space-${gap})`,
          '--rdz-stack-align': align,
          '--rdz-stack-justify': justify,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
