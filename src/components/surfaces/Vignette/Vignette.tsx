'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { cx, useInView } from '../../internal';

export type VignetteBg = 'plain' | 'gradient' | 'accent' | 'secondary' | 'mono' | 'aurora';

export interface VignetteProps {
  /** The animated scene — an SVG / illustration. Its CSS animations should be
   *  ONE-SHOT (`animation-iteration-count: 1`); they restart whenever the scene
   *  is (re)mounted, which is how reveal/hover replay works. */
  scene: ReactNode;
  /** Background treatment, from the system palette. @default 'gradient' */
  bg?: VignetteBg;
  /** Bump this number to replay the scene (the host card raises it on hover). */
  replay?: number;
  className?: string;
}

/**
 * Vignette — a styled visual area that plays its `scene` ONCE when it scrolls
 * into view, and again whenever `replay` changes (a host card bumps it on hover).
 * It never loops: the scene is remounted via a `key` so its one-shot CSS
 * animation restarts. Scenes ship their own `prefers-reduced-motion` off-switch.
 * The `bg` is a preset, token-driven background treatment.
 */
export function Vignette({ scene, bg = 'gradient', replay = 0, className }: VignetteProps) {
  const [key, setKey] = useState(0);
  const { ref, inView } = useInView<HTMLSpanElement>({ once: true });
  useEffect(() => {
    if (inView) setKey((k) => k + 1);
  }, [inView]);
  useEffect(() => {
    if (replay) setKey((k) => k + 1);
  }, [replay]);
  return (
    <span ref={ref} className={cx('rdz-vignette', `rdz-vignette--${bg}`, className)} aria-hidden="true">
      <span className="rdz-vignette__scene" key={key}>
        {scene}
      </span>
    </span>
  );
}
