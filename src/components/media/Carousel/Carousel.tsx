import * as React from 'react';
import { cx } from '../../internal';

const { useRef, useState, useEffect, useCallback } = React;

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Each child is a slide. */
  children?: React.ReactNode;
  /** Slides visible at once (fractional peeks the next). Omit for a responsive
   *  default: ~1.15 on small screens scaling up to ~2.5 on wide ones, so there's
   *  always more than one slide hinting at further content. */
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
  /** Let the track bleed past the section's horizontal padding so peeking slides
   * reach the edges instead of being clipped by the gutter. @default false */
  bleed?: boolean;
}

// One chevron geometry, rotated for "next" — so both carets are optically centered.
const CHEV = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Carousel — a horizontal scroll-snap slider. Each child is a slide. `perView`
 * sets how many slides show at once (fractional peeks the next); omit it for a
 * responsive default. Arrows + dots are built in; `autoplay` advances every
 * `interval` ms and `loop` wraps. Touch/trackpad swipe works via native
 * scroll-snap; programmatic paging is a token-timed smooth scroll (it honours the
 * project motion scale and `prefers-reduced-motion`).
 */
export function Carousel({
  children,
  perView,
  gap = 'var(--space-4)',
  autoplay = false,
  interval = 4500,
  loop = true,
  arrows = true,
  dots = true,
  bleed = false,
  className,
  ...rest
}: CarouselProps): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = React.Children.toArray(children);
  const n = items.length;
  const raf = useRef(0);
  // Original scroll-snap value, captured once while an animation owns it — so
  // overlapping paging (rapid clicks) can't leave snapping permanently disabled.
  const snapSaved = useRef<string | null>(null);

  // Token-timed smooth scroll. Native `scroll-behavior:smooth` ignores the motion
  // tokens AND fights `scroll-snap-type:mandatory` (the browser yanks to a snap
  // point mid-animation — the "glitch"). So we animate scrollLeft ourselves over a
  // motion-scale-derived duration with snapping briefly disabled.
  const smoothScroll = useCallback((left: number) => {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(raf.current);
    const start = track.scrollLeft;
    const dist = left - start;
    if (Math.abs(dist) < 1) return;
    const scale = parseFloat(getComputedStyle(track).getPropertyValue('--motion-scale')) || 1;
    const dur = 460 * scale;
    if (dur < 30) { track.scrollLeft = left; return; } // "none" preset / reduced motion
    if (snapSaved.current === null) snapSaved.current = track.style.scrollSnapType;
    track.style.scrollSnapType = 'none';
    const t0 = performance.now();
    const step = (now: number): void => {
      const t = Math.min(1, (now - t0) / dur);
      track.scrollLeft = start + dist * easeOut(t);
      if (t < 1) raf.current = requestAnimationFrame(step);
      else { track.style.scrollSnapType = snapSaved.current ?? ''; snapSaved.current = null; }
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (!child) return;
    // Centre the slide in the viewport (matches scroll-snap-align: center).
    const target = child.offsetLeft - track.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
    const max = track.scrollWidth - track.clientWidth;
    smoothScroll(Math.max(0, Math.min(max, target)));
  }, [smoothScroll]);

  const go = useCallback(
    (i: number) => {
      const t = loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
      setActive(t);
      scrollToIndex(t);
    },
    [n, loop, scrollToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let r = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(r);
      r = requestAnimationFrame(() => {
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
      cancelAnimationFrame(r);
      cancelAnimationFrame(raf.current);
      // Restore snapping if we unmount mid-animation.
      if (snapSaved.current !== null) { track.style.scrollSnapType = snapSaved.current; snapSaved.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!autoplay || n < 2) return undefined;
    const id = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % n;
        scrollToIndex(next);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, n, scrollToIndex]);

  const viewportStyle = {
    '--srx-carousel-gap': gap,
    ...(perView != null ? { '--srx-per-view': perView } : {}),
  } as React.CSSProperties;

  return (
    <div className={cx('srx-carousel', perView == null && 'srx-carousel--auto', bleed && 'srx-carousel--bleed', className)} {...rest}>
      <div className="srx-carousel__viewport" ref={trackRef} style={viewportStyle}>
        {items.map((c, i) => (
          <div className="srx-carousel__slide" key={i}>
            {c}
          </div>
        ))}
      </div>
      {n > 1 ? (
        <div className="srx-carousel__bar">
          {dots ? (
            <div className="srx-carousel__indicator" role="tablist" aria-label="Slides">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={cx('srx-carousel__seg', i === active && 'is-active')}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-selected={i === active}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          ) : <span />}
          {arrows ? (
            <div className="srx-carousel__nav">
              <button type="button" className="srx-ovbtn" aria-label="Previous" disabled={!loop && active === 0} onClick={() => go(active - 1)}>
                {CHEV}
              </button>
              <span className="srx-carousel__count" aria-hidden="true"><b>{active + 1}</b> / {n}</span>
              <button type="button" className="srx-ovbtn srx-carousel__next" aria-label="Next" disabled={!loop && active === n - 1} onClick={() => go(active + 1)}>
                {CHEV}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
