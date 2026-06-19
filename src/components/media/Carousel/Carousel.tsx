import * as React from 'react';
import { cx } from '../../internal';

const { useRef, useState, useEffect, useCallback } = React;

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Each child is a slide. */
  children?: React.ReactNode;
  /** Slides visible at once (fractional peeks the next). @default 1 */
  perView?: number;
  /** Gap between slides (CSS length). @default "var(--space-4)" */
  gap?: string;
  /** Auto-advance. @default false */
  autoplay?: boolean;
  /** Auto-advance interval in ms. @default 4500 */
  interval?: number;
  /** Wrap past the ends. @default true */
  loop?: boolean;
  /** Show prev/next arrows. @default true */
  arrows?: boolean;
  /** Show dot indicators. @default true */
  dots?: boolean;
}

const CHEV = (dir: 'prev' | 'next'): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
  </svg>
);

/**
 * Carousel — a horizontal scroll-snap slider. Each child is a slide. `perView`
 * sets how many slides show at once (fractional is fine, e.g. 1.2 to peek the
 * next). Arrows + dots are built in; `autoplay` advances every `interval` ms and
 * `loop` wraps. Native scroll-snap means touch/trackpad swipe works for free.
 */
export function Carousel({
  children,
  perView = 1,
  gap = 'var(--space-4)',
  autoplay = false,
  interval = 4500,
  loop = true,
  arrows = true,
  dots = true,
  className,
  ...rest
}: CarouselProps): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = React.Children.toArray(children);
  const n = items.length;

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  const go = useCallback(
    (i: number) => {
      const t = loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
      setActive(t);
      scrollTo(t);
    },
    [n, loop, scrollTo],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bd = Infinity;
        [...track.children].forEach((c, i) => {
          const el = c as HTMLElement;
          const cc = el.offsetLeft - track.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(cc - center);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!autoplay || n < 2) return undefined;
    const id = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % n;
        scrollTo(next);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, n, scrollTo]);

  return (
    <div className={cx('srx-carousel', className)} {...rest}>
      <div
        className="srx-carousel__viewport"
        ref={trackRef}
        style={{ '--srx-carousel-gap': gap, '--srx-per-view': perView } as React.CSSProperties}
      >
        {items.map((c, i) => (
          <div className="srx-carousel__slide" key={i}>
            {c}
          </div>
        ))}
      </div>
      {arrows && n > 1 ? (
        <>
          <button type="button" className="srx-carousel__arrow srx-carousel__arrow--prev" aria-label="Previous" onClick={() => go(active - 1)}>
            {CHEV('prev')}
          </button>
          <button type="button" className="srx-carousel__arrow srx-carousel__arrow--next" aria-label="Next" onClick={() => go(active + 1)}>
            {CHEV('next')}
          </button>
        </>
      ) : null}
      {dots && n > 1 ? (
        <div className="srx-carousel__dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cx('srx-carousel__dot', i === active && 'is-active')}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
