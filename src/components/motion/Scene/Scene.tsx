'use client';
import * as React from 'react';
import { cx } from '../../internal';
import {
  SceneIcon, SceneGlow, SceneRings, SceneHalo, SceneSparks, SceneOrbit, SceneBeam, SceneBadge,
} from './layers';
import {
  SceneBars, SceneWaves, SceneGrid, SceneConstellation, SceneRoute, SceneStack,
  SceneTrend, SceneChat, SceneTerminal, SceneWindow, SceneGauge, SceneShield, ScenePins, SceneCard,
} from './illustrations';

export type { SceneIconMotion } from './layers';

/** Scene presets — recipes over the exported layers. "Icon companions" frame a
 *  hero `icon` with decorations; the rest are self-contained illustrations. */
export type ScenePreset =
  // icon companions — pass an `icon`, get a framed animated tile
  | 'flash'
  | 'rings'
  | 'halo'
  | 'spark'
  | 'stars'
  | 'orbit'
  | 'pop'
  | 'beam'
  | 'drift'
  // standalone illustrations — bespoke, icon optional/ignored
  | 'bars'
  | 'waves'
  | 'grid'
  | 'constellation'
  | 'route'
  | 'stack'
  | 'trend'
  | 'chat'
  | 'terminal'
  | 'window'
  | 'gauge'
  | 'shield'
  | 'pins'
  | 'card';

/** Background treatment behind the scene (tone-driven, token-backed). */
export type SceneBg = 'none' | 'soft' | 'gradient' | 'solid';
/** Hue family — a semantic name resolves the full token triplet (ink / wash /
 *  solid / on-colour); any other CSS colour string tints the ink only. */
export type SceneTone = 'accent' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | (string & {});
/** Local tempo — scales `--motion-scale` for this scene only. */
export type SceneSpeed = 'slow' | 'normal' | 'fast';

const SEMANTIC_TONES = new Set(['accent', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral']);

interface SceneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Backdrop treatment. @default 'gradient' */
  bg?: SceneBg;
  /** Hue family (semantic, token-driven) or a raw CSS colour (ink only). @default 'accent' */
  tone?: SceneTone;
  /** Local tempo override. @default 'normal' */
  speed?: SceneSpeed;
  /** Aspect ratio of the self-sizing canvas (ignored when `fill`). @default '16 / 9' */
  ratio?: string;
  /** Fill a positioned parent (`inset: 0`) instead of self-sizing. @default false */
  fill?: boolean;
  /** Freeze the animation. @default false */
  paused?: boolean;
}
export interface ScenePresetProps extends SceneBaseProps {
  /** Which recipe to play. */
  preset: ScenePreset;
  /** Hero glyph for the icon-companion presets (a react-icons glyph, a Raditz
   *  `<Icon/>`, or raw SVG). Ignored by the standalone illustration presets. */
  icon?: React.ReactNode;
  /** Optional chip near the icon (e.g. `"NEW"`) — never rendered unless supplied. */
  badge?: React.ReactNode;
  children?: never;
}
export interface SceneComposedProps extends SceneBaseProps {
  preset?: never;
  icon?: never;
  badge?: never;
  /** Compose your own scene from `Scene.X` layers. */
  children: React.ReactNode;
}
export type SceneProps = ScenePresetProps | SceneComposedProps;

// Widened view of the union for internal destructuring (the public XOR types
// keep preset/children mutually exclusive at call sites).
type SceneAllProps = SceneBaseProps & {
  preset?: ScenePreset;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
};

/** Each preset is a recipe over the exported layers — one source of truth: the
 *  same components a consumer would compose by hand in children mode. */
function recipe(preset: ScenePreset, icon: React.ReactNode, badge: React.ReactNode): React.ReactNode {
  const chip = badge != null ? <SceneBadge>{badge}</SceneBadge> : null;
  switch (preset) {
    // icon companions
    case 'flash': return (<><SceneGlow /><SceneRings count={2} duration={2.2} /><SceneIcon motion="flash">{icon}</SceneIcon>{chip}</>);
    case 'rings': return (<><SceneGlow strength="soft" /><SceneRings count={4} /><SceneIcon>{icon}</SceneIcon>{chip}</>);
    case 'halo':  return (<><SceneHalo /><SceneIcon>{icon}</SceneIcon>{chip}</>);
    case 'spark': return (<><SceneIcon>{icon}</SceneIcon><SceneSparks />{chip}</>);
    case 'stars': return (<><SceneIcon>{icon}</SceneIcon><SceneSparks shape="star" />{chip}</>);
    case 'orbit': return (<><SceneOrbit /><SceneIcon>{icon}</SceneIcon>{chip}</>);
    case 'pop':   return (<><SceneIcon motion="bob">{icon}</SceneIcon>{chip}</>);
    case 'beam':  return (<><SceneBeam /><SceneIcon>{icon}</SceneIcon>{chip}</>);
    case 'drift': return (<><SceneHalo strength="soft" /><SceneIcon motion="float">{icon}</SceneIcon>{chip}</>);
    // illustrations
    case 'bars': return (<><SceneBars />{chip}</>);
    case 'waves': return (<><SceneWaves />{chip}</>);
    case 'grid': return (<><SceneGrid />{chip}</>);
    case 'constellation': return (<><SceneConstellation />{chip}</>);
    case 'route': return (<><SceneRoute />{chip}</>);
    case 'stack': return (<><SceneStack />{chip}</>);
    case 'trend': return (<><SceneTrend />{chip}</>);
    case 'chat': return (<><SceneChat />{chip}</>);
    case 'terminal': return (<><SceneTerminal />{chip}</>);
    case 'window': return (<><SceneWindow />{chip}</>);
    case 'gauge': return (<><SceneGauge />{chip}</>);
    case 'shield': return (<><SceneShield />{chip}</>);
    case 'pins': return (<><ScenePins />{chip}</>);
    case 'card': return (<><SceneCard />{chip}</>);
  }
}

/**
 * Scene — animated card-thumbnail primitives. Every `preset` is a recipe over
 * the exported `Scene.X` layers: icon companions (`flash`, `rings`, `halo`,
 * `spark`, `stars`, `orbit`, `pop`, `beam`, `drift`) frame a hero `icon`, the
 * illustrations (`bars` … `card`) are self-contained. When no recipe fits,
 * compose your own from the same layers as `children` — a `Scene.Badge` chip
 * only ever renders when you add it. Colour comes from semantic `tone`
 * (token triplet: ink/wash/solid) × `bg` treatment, so scenes re-theme with
 * the app and hold up in light + dark. Marks scale to the canvas (container
 * units), tempo rides `--motion-scale` (`speed` overrides locally), and every
 * scene holds a legible static frame under `prefers-reduced-motion`. Renders
 * flush like an `<img>` (the card clips it); self-sizing (`ratio`) or `fill` a
 * positioned parent (incl. a {@link Vignette}). Decorative (`aria-hidden`) —
 * give the card a real text label.
 */
function SceneRoot(props: SceneProps): React.ReactElement {
  const {
    preset, icon, badge, children,
    bg = 'gradient', tone = 'accent', speed = 'normal',
    ratio = '16 / 9', fill = false, paused = false, className, style, ...rest
  } = props as SceneAllProps;
  const semantic = SEMANTIC_TONES.has(tone);
  return (
    <div
      className={cx('rdz-scene', fill && 'rdz-scene--fill', paused && 'is-paused', className)}
      data-preset={preset}
      data-bg={bg}
      // accent is the stylesheet default — omit the attribute in the common case
      data-tone={semantic && tone !== 'accent' ? tone : undefined}
      data-speed={speed !== 'normal' ? speed : undefined}
      aria-hidden="true"
      style={{ '--rdz-scene-ratio': ratio, ...(semantic ? null : { '--rdz-scene-ink': tone }), ...style } as React.CSSProperties}
      {...rest}
    >
      <span className="rdz-scene__stage">{children ?? recipe(preset as ScenePreset, icon, badge)}</span>
    </div>
  );
}

/** Canvas + compound layers — `<Scene preset="…"/>` recipes or compose from `Scene.X`. */
export const Scene = Object.assign(SceneRoot, {
  Icon: SceneIcon,
  Glow: SceneGlow,
  Rings: SceneRings,
  Halo: SceneHalo,
  Sparks: SceneSparks,
  Orbit: SceneOrbit,
  Beam: SceneBeam,
  Badge: SceneBadge,
  Bars: SceneBars,
  Waves: SceneWaves,
  Grid: SceneGrid,
  Constellation: SceneConstellation,
  Route: SceneRoute,
  Stack: SceneStack,
  Trend: SceneTrend,
  Chat: SceneChat,
  Terminal: SceneTerminal,
  Window: SceneWindow,
  Gauge: SceneGauge,
  Shield: SceneShield,
  Pins: ScenePins,
  Card: SceneCard,
});
