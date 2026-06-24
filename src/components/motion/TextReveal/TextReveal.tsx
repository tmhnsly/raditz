'use client';
import * as React from 'react';
import { cx, useRevealState } from '../../internal';
import { splitText, type SplitBy } from '../../internal/splitText';

export type TextRevealAnim = 'flip' | 'rise' | 'fade' | 'blur' | 'mask';

export interface TextRevealProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Element/tag to render. @default 'span' */
  as?: React.ElementType;
  /** The text to animate — a plain string so it can split safely. */
  text: string;
  /** Split granularity. @default 'word' */
  by?: SplitBy;
  /** Per-unit entrance. @default 'flip' */
  anim?: TextRevealAnim;
  /** Per-unit stagger (ms). @default 40 */
  stagger?: number;
  /** Replay every time it re-enters view. @default false */
  repeat?: boolean;
}

/**
 * TextReveal — a kinetic headline: splits `text` into words (or chars) that
 * cascade in on scroll with a per-unit `flip` / `rise` / `fade` / `blur` / `mask`
 * entrance. A11y-safe (full text read once, fragments hidden — see {@link splitText}),
 * transform/opacity/clip only, and honours `prefers-reduced-motion` (renders the
 * plain string). Pair with a heading class (`h-display`/`h-section`) for a hero.
 */
export function TextReveal({
  as,
  text,
  by = 'word',
  anim = 'flip',
  stagger = 40,
  repeat = false,
  className,
  style,
  ...rest
}: TextRevealProps): React.ReactElement {
  const Tag = (as ?? 'span') as React.ElementType;
  const { ref, revealed, reduced } = useRevealState({ repeat });

  if (reduced) {
    return React.createElement(Tag, { className: cx('rdz-textreveal', className), style, ...rest }, text);
  }

  return React.createElement(
    Tag,
    {
      ref,
      className: cx('rdz-textreveal', `rdz-textreveal--${anim}`, by === 'char' && 'is-char', revealed && 'is-in', className),
      style: { '--rdz-split-stagger': `${stagger}ms`, ...style } as React.CSSProperties,
      ...rest,
    },
    splitText(text, by),
  );
}
