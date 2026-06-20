import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Inner stack gap (spacing step 1–12). @default 5 */
  gap?: number;
  /** Block padding (spacing step 1–12). @default 11 */
  pad?: number;
  as?: ElementType;
  children?: ReactNode;
}

/**
 * A vertical page section with consistent block rhythm. Use between major page
 * regions; `gap` is the inner stack gap, the block padding is the section rhythm.
 */
export function Section({
  gap = 5,
  pad = 11,
  as = 'section',
  className,
  children,
  ...rest
}: SectionProps): ReactElement {
  const Tag = as;
  return (
    <Tag
      className={cx('rdz-section', className)}
      style={
        {
          '--rdz-section-gap': `var(--space-${gap})`,
          '--rdz-section-pad': `var(--space-${pad})`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
