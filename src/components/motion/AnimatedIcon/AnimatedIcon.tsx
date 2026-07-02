'use client';
import * as React from 'react';
import { cx, useReducedMotion } from '../../internal';

export type IconAnim = 'float' | 'orbit' | 'pulse' | 'spin' | 'wiggle' | 'draw';

export interface AnimatedIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which looping (or one-shot, for `draw`) animation to play. */
  anim: IconAnim;
  /** Speed bucket — multiplies the base duration. @default 'base' */
  speed?: 'slow' | 'base' | 'fast';
  /** Freeze the animation (e.g. resume on hover via your own class). @default false */
  paused?: boolean;
  /** The icon: a react-icons glyph (`<GiMoonOrbit/>`), a Raditz `<Icon/>`, or raw SVG. */
  children: React.ReactNode;
}

/**
 * AnimatedIcon — wraps any icon in a tasteful idle animation: `float`, `orbit`,
 * `pulse`, `spin`, `wiggle`, or a one-shot `draw` (stroked icons only, e.g. the
 * Raditz `<Icon/>`). Built to pair with `react-icons` — it's icon-agnostic, only
 * styling its child, so it ships dependency-free and tree-shakeable. Timing rides
 * the shared motion tokens (re-tunes with `data-motion`) and it honours
 * `prefers-reduced-motion` by rendering the icon static.
 */
export function AnimatedIcon({
  anim,
  speed = 'base',
  paused = false,
  className,
  style,
  children,
  ...rest
}: AnimatedIconProps): React.ReactElement {
  const reduced = useReducedMotion();
  const off = reduced || paused;
  return (
    <span
      className={cx('rdz-anim', off && 'is-paused', className)}
      data-anim={anim}
      data-speed={speed}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
}
