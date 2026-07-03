'use client';
import * as React from 'react';
import { cx } from '../../internal';

/** Scene presets. "Icon companions" frame a hero `icon` with decorations; the
 *  rest are self-contained illustrations (no icon needed). */
export type ScenePreset =
  // icon companions — pass an `icon`, get a framed animated tile
  | 'flash'
  | 'rings'
  | 'halo'
  | 'spark'
  | 'stars'
  | 'orbit'
  | 'pop'
  // standalone illustrations — bespoke, icon optional/ignored
  | 'bars'
  | 'waves'
  | 'grid'
  | 'constellation'
  | 'route'
  | 'stack';

/** Background wash behind the scene (token-driven, re-themes with the accent). */
export type SceneBg = 'none' | 'soft' | 'gradient' | 'accent' | 'secondary';

const ICON_PRESETS = new Set<ScenePreset>(['flash', 'rings', 'halo', 'spark', 'stars', 'orbit', 'pop']);

export interface SceneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Which scene to play. */
  preset: ScenePreset;
  /** Hero glyph for the icon-companion presets (a react-icons glyph, a Raditz
   *  `<Icon/>`, or raw SVG). Ignored by the standalone illustration presets. */
  icon?: React.ReactNode;
  /** Optional chip that pops near the icon (e.g. `"+1 PT"`, `"NEW"`). */
  badge?: React.ReactNode;
  /** Backdrop treatment. @default 'gradient' */
  bg?: SceneBg;
  /** Ink tint for the scene marks — any CSS colour / `var(--…)`. Defaults to the
   *  ink paired with `bg`. */
  tone?: string;
  /** Aspect ratio of the self-sizing canvas (ignored when `fill`). @default '16 / 9' */
  ratio?: string;
  /** Fill a positioned parent (`inset: 0`) instead of self-sizing. @default false */
  fill?: boolean;
  /** Freeze the animation. @default false */
  paused?: boolean;
}

const repeat = (n: number, cls: string) =>
  Array.from({ length: n }, (_, i) => <span key={i} className={cls} />);

/** A 4-point spark glyph. */
const Spark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.7 6 5.3 10.6 12 12-6.7 1.4-11.3 6-12 12-.7-6-5.3-10.6-12-12C6.7 10.6 11.3 6 12 0Z" /></svg>
);
/** A 5-point star glyph. */
const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5l3 6.4 7 .9-5.2 4.8 1.4 6.9L12 17.9 5.8 20.5l1.4-6.9L2 8.8l7-.9z" /></svg>
);
const sparks = (n: number, cls: string, Glyph: React.FC) =>
  Array.from({ length: n }, (_, i) => <span key={i} className={cls}><Glyph /></span>);

function content(preset: ScenePreset, icon: React.ReactNode, badge: React.ReactNode): React.ReactNode {
  const chip = badge != null ? <span className="rdz-scene__badge">{badge}</span> : null;
  // Icon presets render the hero glyph (or a plain core disc as a graceful
  // fallback when no icon is passed).
  const hero = ICON_PRESETS.has(preset)
    ? (icon != null ? <span className="rdz-scene__icon">{icon}</span> : <span className="rdz-scene__core" />)
    : null;

  switch (preset) {
    case 'flash':
      return (<><span className="rdz-scene__glow" />{repeat(2, 'rdz-scene__ring')}{hero}{chip}</>);
    case 'rings':
      return (<><span className="rdz-scene__glow rdz-scene__glow--faint" />{repeat(4, 'rdz-scene__ring')}{hero}{chip}</>);
    case 'halo':
      return (<><span className="rdz-scene__halo" />{hero}{chip}</>);
    case 'spark':
      return (<>{hero}{sparks(4, 'rdz-scene__spark', Spark)}{chip}</>);
    case 'stars':
      return (<>{hero}{sparks(4, 'rdz-scene__star', Star)}{chip}</>);
    case 'orbit':
      return (<>{Array.from({ length: 3 }, (_, i) => <span key={i} className="rdz-scene__orbit"><span className="rdz-scene__orbit-dot" /></span>)}{hero}{chip}</>);
    case 'pop':
      return (<>{hero}{chip}</>);
    case 'bars':
      return <span className="rdz-scene__bars">{repeat(7, 'rdz-scene__bar')}</span>;
    case 'waves':
      return (
        <svg className="rdz-scene__wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path className="rdz-scene__wave-a" d="M-25 20 Q -12.5 4 0 20 T 25 20 T 50 20 T 75 20 T 100 20 T 125 20" fill="none" />
          <path className="rdz-scene__wave-b" d="M-25 20 Q -12.5 36 0 20 T 25 20 T 50 20 T 75 20 T 100 20 T 125 20" fill="none" />
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
    case 'stack':
      return repeat(3, 'rdz-scene__sheet');
  }
}

/**
 * Scene — an animated illustration that fills a card's thumbnail area. Most
 * presets frame a hero `icon` (any react-icons glyph) with tasteful animated
 * furniture — an expanding `rings` / `flash` glow, popping `spark`s / `stars`, a
 * `halo`, an `orbit`, plus an optional popping `badge` chip (`"+1 PT"`) — so you
 * get a chork-style tile from any icon, no bespoke SVG. The rest (`bars`,
 * `waves`, `grid`, `constellation`, `route`, `stack`) are self-contained
 * illustrations. Marks scale to the canvas (container units), tint via
 * `bg`/`tone`, and hold a static frame under `prefers-reduced-motion`.
 * Self-sizing (`ratio`) or `fill` a positioned parent (incl. a {@link Vignette}).
 * Decorative (`aria-hidden`) — give the card a real text label.
 */
export function Scene({
  preset,
  icon,
  badge,
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
      <span className="rdz-scene__stage">{content(preset, icon, badge)}</span>
    </div>
  );
}
