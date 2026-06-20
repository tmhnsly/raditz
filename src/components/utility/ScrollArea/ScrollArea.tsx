import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. @default "vertical" */
  axis?: 'vertical' | 'horizontal' | 'both';
  /** Max height before vertical scrolling kicks in. */
  maxHeight?: number | string;
  children?: ReactNode;
}

/**
 * ScrollArea — a scroll container with a slim, themed scrollbar (Radix
 * ScrollArea). Set `maxHeight` (vertical) or a fixed width (horizontal).
 */
export function ScrollArea({ axis = 'vertical', maxHeight, className, style, children, ...rest }: ScrollAreaProps): ReactElement {
  const cls = cx('rdz-scroll', `rdz-scroll--${axis}`, className);
  const maxh = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  return (
    <div className={cls} style={{ '--rdz-scroll-maxh': maxh, ...style } as CSSProperties} {...rest}>
      {children}
    </div>
  );
}
