'use client';
import { useEffect, useRef, useState } from 'react';
import { cx, useRevealState } from '../../internal';

export interface CountUpProps {
  /** Target value — a number, or a string the number is pulled from with its
   *  surrounding text preserved (e.g. "$2.5M", "10k+", "99.9%"). A non-numeric string
   *  renders verbatim. */
  value: number | string;
  /** Roll duration (ms). @default 1400 */
  duration?: number;
  className?: string;
}

/** Split "abc12,345.6xyz" → { pre:'abc', num:12345.6, post:'xyz', decimals:1 }. */
export function parseCountUp(value: number | string): { pre: string; num: number | null; post: string; decimals: number } {
  if (typeof value === 'number') return { pre: '', num: value, post: '', decimals: 0 };
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if (!m) return { pre: value, num: null, post: '', decimals: 0 };
  const raw = m[2].replace(/,/g, '');
  return { pre: m[1], num: parseFloat(raw), post: m[3], decimals: raw.includes('.') ? raw.split('.')[1].length : 0 };
}

const fmt = (n: number, decimals: number): string =>
  n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * CountUp — rolls a number from 0 to its target the first time it scrolls into view.
 * Accessible & SSR-safe: the FINAL value is what renders on the server, on no-JS, and
 * under `prefers-reduced-motion` (the tween only changes the on-screen display, never the
 * announced value). Any surrounding text is preserved (prefix/suffix); a non-numeric value
 * renders verbatim. Pairs with the Stats section.
 */
export function CountUp({ value, duration = 1400, className }: CountUpProps) {
  const { pre, num, post, decimals } = parseCountUp(value);
  // Shared scroll-reveal gate (in-view + reduced-motion folded into one) — the same
  // primitive Reveal/TextReveal use, so "when does an on-view animation run?" lives in
  // one place. `revealed` is `reduced || inView`; under reduced motion we skip the tween.
  const { ref, revealed, reduced } = useRevealState<HTMLSpanElement>();
  // Start at the final value so SSR/no-JS/hydration all show it; animate from 0 on view.
  const [display, setDisplay] = useState<number | null>(num);
  const started = useRef(false);

  useEffect(() => {
    if (num === null || reduced || !revealed || started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number): void => {
      const p = Math.min(1, (now - t0) / duration);
      setDisplay(num * (1 - Math.pow(1 - p, 3))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(num);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [num, reduced, revealed, duration]);

  if (num === null) return <span className={className}>{value}</span>;
  return (
    <span ref={reduced ? undefined : ref} className={cx('rdz-countup', className)}>
      {pre}{fmt(display ?? num, decimals)}{post}
    </span>
  );
}
