'use client';
import * as React from 'react';
import { cx, useInView, useReducedMotion } from '../../internal';

export type RevealAnim =
  | 'fade'
  | 'rise'
  | 'scale'
  | 'fade-rise'
  | 'zoom'
  | 'blur'
  | 'slide-left'
  | 'slide-right'
  | 'flip'
  | 'flip-y'
  | 'rotate'
  | 'skew';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Element/tag to render. @default 'div' */
  as?: React.ElementType;
  /** Entrance style. Omit to inherit the app-wide reveal "vibe" (`data-reveal` on
   *  `<html>`, set by the theme config); falls back to `fade-rise` when none is set. */
  anim?: RevealAnim;
  /** Extra delay (ms) on top of any group stagger. @default 0 */
  delay?: number;
  /** Stagger position — set automatically by {@link RevealGroup}. @default 0 */
  index?: number;
  /** Replay every time it re-enters view (default plays once). @default false */
  repeat?: boolean;
  children?: React.ReactNode;
}

/**
 * Reveal — a tasteful, opt-in scroll entrance. Wraps any content; when it scrolls
 * into view it transitions from a hidden state (fade / rise / scale / zoom / blur /
 * slide / flip / rotate / skew) to its resting state, using the shared motion
 * tokens for timing. Transform/opacity/filter only (no layout thrash); driven by
 * one IntersectionObserver via {@link useInView}. With no `anim`, it inherits the
 * app-wide reveal vibe (`data-reveal`). Honours `prefers-reduced-motion` — it then
 * renders the final state immediately, never the hidden one.
 */
export function Reveal({
  as,
  anim,
  delay = 0,
  index = 0,
  repeat = false,
  className,
  style,
  children,
  ...rest
}: RevealProps): React.ReactElement {
  const Tag = (as ?? 'div') as React.ElementType;
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ once: !repeat });

  if (reduced) {
    return React.createElement(Tag, { className: cx('rdz-reveal', 'is-in', className), style, ...rest }, children);
  }

  return React.createElement(
    Tag,
    {
      ref,
      // `data-anim` is present only for an explicit anim — the app-wide
      // `[data-reveal] .rdz-reveal:not([data-anim])` default skips those.
      'data-anim': anim,
      className: cx('rdz-reveal', anim && `rdz-reveal--${anim}`, inView && 'is-in', className),
      style: { '--rdz-reveal-i': index, '--rdz-reveal-delay': `${delay}ms`, ...style } as React.CSSProperties,
      ...rest,
    },
    children,
  );
}

export interface RevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Per-item stagger between children (ms). @default 60 */
  stagger?: number;
  /** Default anim for child {@link Reveal}s that don't set their own. */
  anim?: RevealAnim;
  children?: React.ReactNode;
}

/**
 * RevealGroup — staggers a set of {@link Reveal} children by auto-assigning each
 * an `index`, so a grid/list cascades in. The stagger is pure CSS (a per-item
 * `transition-delay`), so there are no JS timers.
 */
export function RevealGroup({
  as,
  stagger = 60,
  anim,
  className,
  style,
  children,
  ...rest
}: RevealGroupProps): React.ReactElement {
  const Tag = (as ?? 'div') as React.ElementType;
  let i = 0;
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || child.type !== Reveal) return child;
    const childProps = child.props as RevealProps;
    return React.cloneElement(child as React.ReactElement<RevealProps>, {
      index: childProps.index ?? i++,
      anim: childProps.anim ?? anim,
    });
  });
  return React.createElement(
    Tag,
    {
      className: cx('rdz-reveal-group', className),
      style: { '--rdz-reveal-stagger': `${stagger}ms`, ...style } as React.CSSProperties,
      ...rest,
    },
    items,
  );
}
