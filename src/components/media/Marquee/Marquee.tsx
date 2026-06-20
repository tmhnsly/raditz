import * as React from 'react';
import { cx } from '../../internal';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Seconds for one full loop. @default 26 */
  duration?: number;
  /** Scroll direction. @default "left" */
  direction?: 'left' | 'right';
  /** Pause the scroll on hover. @default true */
  pauseOnHover?: boolean;
  /** Gap between items (CSS length). @default "var(--space-7)" */
  gap?: string;
  /** Fade the edges with a mask. @default true */
  fade?: boolean;
}

/**
 * Marquee — a seamless, infinitely-scrolling row of its children (logos, tags,
 * quotes…). The content is duplicated so the loop has no seam. Pauses on hover
 * and respects `prefers-reduced-motion` (animation stops, duplicate hidden, so it
 * degrades to a static, readable row). All token-driven, so it re-themes.
 */
export function Marquee({
  children,
  duration = 26,
  direction = 'left',
  pauseOnHover = true,
  gap = 'var(--space-7)',
  fade = true,
  className,
  ...rest
}: MarqueeProps): React.ReactElement {
  const items = React.Children.toArray(children);
  return (
    <div
      className={cx('rdz-marquee', pauseOnHover && 'rdz-marquee--pause', fade && 'rdz-marquee--fade', className)}
      style={{
        '--rdz-marquee-duration': `${duration}s`,
        '--rdz-marquee-gap': gap,
        '--rdz-marquee-dir': direction === 'right' ? 'reverse' : 'normal',
      } as React.CSSProperties}
      {...rest}
    >
      <div className="rdz-marquee__track">
        <div className="rdz-marquee__group">{items}</div>
        <div className="rdz-marquee__group" aria-hidden="true">{items}</div>
      </div>
    </div>
  );
}
