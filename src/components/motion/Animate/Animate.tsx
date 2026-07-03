'use client';
import * as React from 'react';
import { cx, useReducedMotion, useInView } from '../../internal';

/** Every animation preset. Loop presets idle forever; one-shots play per trigger. */
export type AnimatePreset =
  // ── loops (idle motion) ──
  | 'float'
  | 'float-x'
  | 'pulse'
  | 'breathe'
  | 'spin'
  | 'orbit'
  | 'wiggle'
  | 'sway'
  | 'bob'
  | 'heartbeat'
  | 'glow'
  | 'shimmer'
  | 'blink'
  // ── one-shots (attention) ──
  | 'pop'
  | 'tada'
  | 'jelly'
  | 'shake'
  | 'bounce'
  | 'rubber';

/** When the animation runs. */
export type AnimateTrigger = 'loop' | 'hover' | 'inview' | 'mount';

export interface AnimateProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default 'span' */
  as?: React.ElementType;
  /** Which animation to play. */
  preset: AnimatePreset;
  /** What starts it: run forever (`loop`), on hover, once when scrolled into
   *  view, or once on mount. @default 'loop' */
  trigger?: AnimateTrigger;
  /** Duration bucket — multiplies the preset's base duration. @default 'base' */
  speed?: 'slow' | 'base' | 'fast';
  /** Start delay (ms). @default 0 */
  delay?: number;
  /** Iteration count override (loops default to infinite; one-shots to 1). */
  repeat?: number | 'infinite';
  /** Freeze the animation in place. @default false */
  paused?: boolean;
  children: React.ReactNode;
}

/**
 * Animate — a modular animation wrapper: drop it around any element (an icon, a
 * card, a badge, a heading) and pick a `preset` to add motion without writing
 * keyframes. Loop presets (`float`, `pulse`, `spin`, `wiggle`, `glow`,
 * `shimmer`, …) idle forever; one-shots (`pop`, `tada`, `shake`, `bounce`, …)
 * fire on the `trigger` (`hover` / `inview` / `mount`). Timing rides the shared
 * motion tokens (re-tunes with `data-motion`), `speed`/`delay`/`repeat` fine-tune
 * per instance, and it renders static under `prefers-reduced-motion`. Pairs with
 * `react-icons` (icon-agnostic) but works on anything.
 */
export function Animate({
  as: Tag = 'span',
  preset,
  trigger = 'loop',
  speed = 'base',
  delay = 0,
  repeat,
  paused = false,
  className,
  style,
  children,
  ...rest
}: AnimateProps): React.ReactElement {
  const reduced = useReducedMotion();
  // Only the `inview` trigger needs JS; the rest are pure CSS (:hover / applied
  // on mount). `once` so a one-shot doesn't replay on every scroll-by.
  const { ref, inView } = useInView<HTMLElement>({ once: true });
  const usesObserver = trigger === 'inview' && !reduced;

  const vars: Record<string, string> = {};
  if (delay) vars['--rdz-animate-delay'] = `${delay}ms`;
  if (repeat != null) vars['--rdz-animate-count'] = String(repeat);

  return (
    <Tag
      ref={usesObserver ? ref : undefined}
      className={cx('rdz-animate', paused && 'is-paused', trigger === 'inview' && inView && 'is-in', className)}
      data-preset={preset}
      data-trigger={trigger}
      data-speed={speed}
      style={{ ...vars, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
