'use client';
import { useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx, useInView } from '../../internal';

export type VignetteBg = 'plain' | 'gradient' | 'accent' | 'secondary' | 'mono' | 'aurora';

export interface VignetteProps extends HTMLAttributes<HTMLSpanElement> {
  /** The animated scene — a BESPOKE SVG / illustration authored for THIS card's
   *  subject (don't reuse one scene across cards). Its CSS animations should be
   *  ONE-SHOT (`animation-iteration-count: 1`) and timed with the motion tokens
   *  (`var(--duration-*)`, `var(--ease-*)`) so they ride `data-motion` and match the
   *  system's feel. They restart whenever the scene is (re)mounted — how reveal/hover
   *  replay works. Reduced motion is handled by the Vignette; the scene needs no
   *  off-switch. */
  scene: ReactNode;
  /** Background treatment, from the system palette. @default 'gradient' */
  bg?: VignetteBg;
  /** Bump this number to replay the scene (the host card raises it on hover). */
  replay?: number;
}

/**
 * Vignette — a styled visual area that plays its `scene` ONCE when it scrolls
 * into view, and again whenever `replay` changes (a host card bumps it on hover).
 * It never loops: the scene is remounted via a `key` so its one-shot CSS
 * animation restarts. The Vignette owns the `prefers-reduced-motion` off-switch for
 * its scene, and scenes time their CSS with the motion tokens — so the animation
 * stays tied to the global system while the scene CONTENT is bespoke to each card.
 * The `bg` is a preset, token-driven background treatment.
 */
export function Vignette({ scene, bg = 'gradient', replay = 0, className, ...rest }: VignetteProps) {
  const [key, setKey] = useState(0);
  const { ref, inView } = useInView<HTMLSpanElement>({ once: true });
  // Replay the one-shot scene when it (re)enters view or the host bumps `replay` — but
  // only while in view, so an off-screen replay doesn't burn a remount before it's seen.
  useEffect(() => {
    if (!inView) return;
    setKey((k) => k + 1);
  }, [inView, replay]);
  return (
    <span ref={ref} className={cx('rdz-vignette', `rdz-vignette--${bg}`, className)} aria-hidden="true" {...rest}>
      <span className="rdz-vignette__scene" key={key}>
        {scene}
      </span>
    </span>
  );
}
