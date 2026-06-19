import * as React from 'react';
import { cx } from '../../internal';

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  /** Show a leading accent dot. @default false */
  withDot?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * The mono, upper-tracked label that sits above headings. Optional accent dot.
 */
export function Eyebrow({ withDot = false, as = 'span', className, children, ...rest }: EyebrowProps): React.ReactElement {
  const Tag = as;
  return (
    <Tag className={cx('srx-eyebrow', className)} {...rest}>
      {withDot && <span className="srx-eyebrow__dot" aria-hidden="true" />}
      <span>{children}</span>
    </Tag>
  );
}
