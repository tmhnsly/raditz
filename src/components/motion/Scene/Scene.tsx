'use client';
import * as React from 'react';
import { cx } from '../../internal';

/** The generic animated illustrations. Each fills the canvas and loops a small
 *  scene that reads as a concept — drop one into a card's thumbnail area. */
export type ScenePreset =
  | 'pulse'
  | 'orbit'
  | 'bars'
  | 'grid'
  | 'constellation'
  | 'route'
  | 'burst'
  | 'stack'
  | 'waves'
  | 'rings';

/** Background wash behind the scene (token-driven, re-themes with the accent). */
export type SceneBg = 'none' | 'soft' | 'gradient' | 'accent' | 'secondary';

export interface SceneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Which scene to play. */
  preset: ScenePreset;
  /** Backdrop treatment. @default 'gradient' */
  bg?: SceneBg;
  /** Ink tint for the scene marks — any CSS colour / `var(--…)`. Defaults to the
   *  ink paired with `bg`. */
  tone?: string;
  /** Aspect ratio of the self-sizing canvas (ignored when `fill`). @default '16 / 9' */
  ratio?: string;
  /** Fill a positioned parent (`inset: 0`) instead of self-sizing — e.g. inside a
   *  custom thumbnail box or a `Vignette`. @default false */
  fill?: boolean;
  /** Freeze the animation. @default false */
  paused?: boolean;
}

/** Repeat a decorative element `n` times with an index-keyed class suffix. */
const repeat = (n: number, cls: string) =>
  Array.from({ length: n }, (_, i) => <span key={i} className={cls} />);

function layers(preset: ScenePreset): React.ReactNode {
  switch (preset) {
    case 'pulse':
      return (<>{repeat(3, 'rdz-scene__ring')}{repeat(5, 'rdz-scene__spark')}<span className="rdz-scene__core" /></>);
    case 'rings':
      return repeat(4, 'rdz-scene__halo');
    case 'orbit':
      return (<><span className="rdz-scene__core" />{Array.from({ length: 3 }, (_, i) => (
        <span key={i} className="rdz-scene__orbit"><span className="rdz-scene__orbit-dot" /></span>
      ))}</>);
    case 'bars':
      return <span className="rdz-scene__bars">{repeat(7, 'rdz-scene__bar')}</span>;
    case 'waves':
      return (
        <svg className="rdz-scene__wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path className="rdz-scene__wave-a" d="M0 20 Q 12.5 4 25 20 T 50 20 T 75 20 T 100 20" fill="none" />
          <path className="rdz-scene__wave-b" d="M0 20 Q 12.5 36 25 20 T 50 20 T 75 20 T 100 20" fill="none" />
        </svg>
      );
    case 'grid':
      return <span className="rdz-scene__grid">{repeat(16, 'rdz-scene__cell')}</span>;
    case 'constellation':
      return (
        <svg className="rdz-scene__net" viewBox="0 0 100 60" aria-hidden="true">
          <g className="rdz-scene__net-lines" fill="none">
            <path d="M18 42 L38 20 L60 40 L82 16" /><path d="M38 20 L54 12 L82 16" /><path d="M18 42 L54 12" />
          </g>
          {[[18, 42], [38, 20], [54, 12], [60, 40], [82, 16]].map(([x, y], i) => (
            <circle key={i} className="rdz-scene__node" cx={x} cy={y} r="3.4" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </svg>
      );
    case 'route':
      return (
        <svg className="rdz-scene__route" viewBox="0 0 100 60" aria-hidden="true">
          <path className="rdz-scene__path" d="M12 46 C 30 46 30 16 50 16 S 70 46 88 34" fill="none" />
          <circle className="rdz-scene__waypoint" cx="12" cy="46" r="3.2" />
          <circle className="rdz-scene__waypoint" cx="88" cy="34" r="3.2" />
          <circle className="rdz-scene__mover" r="3.6" />
        </svg>
      );
    case 'burst':
      return (<><span className="rdz-scene__core" />{repeat(9, 'rdz-scene__particle')}</>);
    case 'stack':
      return repeat(3, 'rdz-scene__sheet');
  }
}

/**
 * Scene — a modular, animated illustration that fills a card's thumbnail area, so
 * you can make a card read at a glance without authoring bespoke SVG. Pick a
 * `preset` (`pulse`, `orbit`, `bars`, `grid`, `constellation`, `route`, `burst`,
 * `stack`, …); it composes a small looping scene from layered marks, scaled to
 * the canvas (container units), tinted by `bg` / `tone`, and paused under
 * `prefers-reduced-motion`. Self-sizing (`ratio`) by default, or `fill` a
 * positioned parent — including a {@link Vignette} for scroll/hover replay. The
 * scene is decorative (`aria-hidden`); give the card a real text label.
 */
export function Scene({
  preset,
  bg = 'gradient',
  tone,
  ratio = '16 / 9',
  fill = false,
  paused = false,
  className,
  style,
  ...rest
}: SceneProps): React.ReactElement {
  return (
    <div
      className={cx('rdz-scene', fill && 'rdz-scene--fill', paused && 'is-paused', className)}
      data-preset={preset}
      data-bg={bg}
      aria-hidden="true"
      style={{ '--rdz-scene-ratio': ratio, ...(tone ? { '--rdz-scene-color': tone } : null), ...style } as React.CSSProperties}
      {...rest}
    >
      <span className="rdz-scene__stage">{layers(preset)}</span>
    </div>
  );
}
