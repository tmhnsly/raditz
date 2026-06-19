import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Fixed column count. Omit to use a responsive auto-fill grid. */
  columns?: number;
  /** Min item width for the auto-fill grid. @default "240px" */
  minItem?: string;
  /** Gap as a spacing step (1–12). @default 5 */
  gap?: number;
  as?: ElementType;
  children?: ReactNode;
}

/**
 * CSS grid. Either pass a fixed `columns` count, or `minItem` to get a
 * responsive auto-fill grid that wraps when items get narrower than that width.
 */
export function Grid({
  columns,
  minItem = '240px',
  gap = 5,
  as = 'div',
  className,
  children,
  ...rest
}: GridProps): ReactElement {
  const Tag = as;
  return (
    <Tag
      className={cx('srx-grid', className)}
      data-fill={columns ? undefined : ''}
      style={
        {
          '--srx-grid-gap': `var(--space-${gap})`,
          '--srx-grid-cols': columns,
          '--srx-grid-min': minItem,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
