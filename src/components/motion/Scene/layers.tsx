'use client';
import * as React from 'react';
import { cx } from '../../internal';

// Layer components — the building blocks Scene presets are recipes over.
// Attached as `Scene.X` compounds; every mark is styled/animated in Scene.scss
// and sized in container units so it scales to any canvas.

type Vars = React.CSSProperties;

export type SceneIconMotion = 'none' | 'flash' | 'bob' | 'pulse' | 'spin' | 'float';

/** Hero glyph (or a plain core disc when no glyph is given). */
export function SceneIcon({ motion = 'none', children }: { motion?: SceneIconMotion; children?: React.ReactNode }): React.ReactElement {
  // Enumerated axis → data attribute (house rule; see scripts/style-contract.test.mjs).
  const m = motion !== 'none' ? motion : undefined;
  return children != null
    ? <span className="rdz-scene__icon" data-motion={m}>{children}</span>
    : <span className="rdz-scene__core" data-motion={m} />;
}

/** Throbbing radial glow behind the hero. */
export function SceneGlow({ strength = 'full' }: { strength?: 'soft' | 'full' }): React.ReactElement {
  return <span className={cx('rdz-scene__glow', strength === 'soft' && 'rdz-scene__glow--soft')} />;
}

/** Expanding concentric rings. `duration` (seconds) sets the emit cadence. */
export function SceneRings({ count = 3, duration = 3 }: { count?: number; duration?: number }): React.ReactElement {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="rdz-scene__ring" style={{ '--i': i, '--n': count, '--rdz-rings-dur': `${duration}s` } as Vars} />
      ))}
    </>
  );
}

/** Soft breathing disc. */
export function SceneHalo({ strength = 'full' }: { strength?: 'soft' | 'full' }): React.ReactElement {
  return <span className={cx('rdz-scene__halo', strength === 'soft' && 'rdz-scene__halo--soft')} />;
}

/** A 4-point spark glyph. */
const SparkGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.7 6 5.3 10.6 12 12-6.7 1.4-11.3 6-12 12-.7-6-5.3-10.6-12-12C6.7 10.6 11.3 6 12 0Z" /></svg>
);
/** A 5-point star glyph. */
const StarGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5l3 6.4 7 .9-5.2 4.8 1.4 6.9L12 17.9 5.8 20.5l1.4-6.9L2 8.8l7-.9z" /></svg>
);

/** Glyphs twinkling around the hero (max 5 placement slots). */
export function SceneSparks({ shape = 'spark', count = 3 }: { shape?: 'spark' | 'star'; count?: number }): React.ReactElement {
  const Glyph = shape === 'star' ? StarGlyph : SparkGlyph;
  return (
    <>
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className="rdz-scene__spark" data-i={i}><Glyph /></span>
      ))}
    </>
  );
}

/** Dots circling the hero on up to three orbit rings. */
export function SceneOrbit({ count = 3 }: { count?: number }): React.ReactElement {
  return (
    <>
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <span key={i} className="rdz-scene__orbit" data-i={i}><span className="rdz-scene__orbit-dot" /></span>
      ))}
    </>
  );
}

/** Soft diagonal light sweep across the canvas. */
export function SceneBeam(): React.ReactElement {
  return <span className="rdz-scene__beam" />;
}

/** One-shot popping chip — only exists when you add it. */
export function SceneBadge({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="rdz-scene__badge">{children}</span>;
}
