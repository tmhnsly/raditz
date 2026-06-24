import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height ratio (e.g. 16/9, 1, 4/3). @default 16/9 */
  ratio?: number;
  children?: ReactNode;
}

/**
 * AspectRatio — constrains content to a width/height ratio (Radix AspectRatio).
 * Children fill the box; images cover it.
 */
export function AspectRatio({ ratio = 16 / 9, className, style, children, ...rest }: AspectRatioProps): ReactElement {
  return (
    <div className={cx('rdz-aspect', className)} style={{ '--rdz-aspect': String(ratio), ...style } as CSSProperties} {...rest}>
      {children}
    </div>
  );
}
