'use client';
import * as React from 'react';

// Illustration layers — self-contained scenes usable full-canvas (as presets)
// or mixed with decoration layers / a Badge in composed mode. All marks are
// styled/animated in Scene.scss.

// Index-suffixed so per-mark rules work even when the marks share a parent with
// other spans — `:nth-of-type` counts every sibling, a `--0/--1/…` class can't
// be thrown off by neighbours.
const repeat = (n: number, cls: string) =>
  Array.from({ length: n }, (_, i) => <span key={i} className={`${cls} ${cls}--${i}`} />);

/** An equaliser of bouncing bars. */
export function SceneBars(): React.ReactElement {
  return <span className="rdz-scene__bars">{repeat(7, 'rdz-scene__bar')}</span>;
}

/** One clean sine wave flowing across, over a soft signal fill. */
const WAVE_D = 'M-25 20 Q -12.5 7 0 20 T 25 20 T 50 20 T 75 20 T 100 20 T 125 20';
export function SceneWaves(): React.ReactElement {
  return (
    <svg className="rdz-scene__wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path className="rdz-scene__wave-fill" d={`${WAVE_D} L 125 40 L -25 40 Z`} />
      <path className="rdz-scene__wave-line" d={WAVE_D} fill="none" />
    </svg>
  );
}

/** Cells lighting up in a diagonal sweep. */
export function SceneGrid(): React.ReactElement {
  return <span className="rdz-scene__grid">{repeat(16, 'rdz-scene__cell')}</span>;
}

/** Nodes + drawn links, twinkling. */
export function SceneConstellation(): React.ReactElement {
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
}

/** A path drawing with a dot travelling it. */
export function SceneRoute(): React.ReactElement {
  return (
    <svg className="rdz-scene__route" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__path" d="M12 46 C 30 46 30 16 50 16 S 70 46 88 34" fill="none" />
      <circle className="rdz-scene__waypoint" cx="12" cy="46" r="3.2" />
      <circle className="rdz-scene__waypoint" cx="88" cy="34" r="3.2" />
      <circle className="rdz-scene__mover" r="3.6" />
    </svg>
  );
}

/** Sheets assembling into a pile. */
export function SceneStack(): React.ReactElement {
  return <>{repeat(3, 'rdz-scene__sheet')}</>;
}

/* ── new bespoke scenes (marks filled in per-scene tasks) ── */

/** A settled trend line — persistent line + area, a glowing pulse rides up it,
 *  the end-dot beats. Always on the canvas (no redraw-from-blank). */
const TREND_D = 'M10 48 C 26 46 34 36 50 32 S 74 20 90 14';
export function SceneTrend(): React.ReactElement {
  return (
    <svg className="rdz-scene__trend" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__trend-area" d={`${TREND_D} L 90 52 L 10 52 Z`} />
      <path className="rdz-scene__trend-line" d={TREND_D} fill="none" />
      <circle className="rdz-scene__trend-pulse" r="2.4" />
      <circle className="rdz-scene__trend-dot" cx="90" cy="14" r="3.2" />
    </svg>
  );
}

/** Message bubbles popping in, typing-dots on the last. */
export function SceneChat(): React.ReactElement {
  return (
    <span className="rdz-scene__chat">
      <span className="rdz-scene__bubble rdz-scene__bubble--0" />
      <span className="rdz-scene__bubble rdz-scene__bubble--1" />
      <span className="rdz-scene__bubble rdz-scene__bubble--2">
        <span className="rdz-scene__chat-dot" /><span className="rdz-scene__chat-dot" /><span className="rdz-scene__chat-dot" />
      </span>
    </span>
  );
}

/** Window chrome + a prompt line typing with a blinking caret. */
export function SceneTerminal(): React.ReactElement {
  return (
    <span className="rdz-scene__frame rdz-scene__frame--terminal">
      <span className="rdz-scene__frame-bar"><span /><span /><span /></span>
      <span className="rdz-scene__term-line">
        <span className="rdz-scene__term-prompt" />
        <span className="rdz-scene__term-text" />
        <span className="rdz-scene__term-caret" />
      </span>
      <span className="rdz-scene__term-out" />
    </span>
  );
}

/** Browser frame with skeleton content blocks shimmering in. */
export function SceneWindow(): React.ReactElement {
  return (
    <span className="rdz-scene__frame rdz-scene__frame--window">
      <span className="rdz-scene__frame-bar"><span /><span /><span /></span>
      <span className="rdz-scene__win-body">
        <span className="rdz-scene__skel rdz-scene__skel--0" />
        <span className="rdz-scene__skel rdz-scene__skel--1" />
        <span className="rdz-scene__skel rdz-scene__skel--2" />
        <span className="rdz-scene__skel rdz-scene__skel--3" />
      </span>
    </span>
  );
}

/** Arc meter sweeping to ~70% with a glowing tip. */
export function SceneGauge(): React.ReactElement {
  return (
    <svg className="rdz-scene__gauge" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__gauge-track" d="M18 50 A 34 34 0 1 1 82 50" fill="none" />
      <path className="rdz-scene__gauge-fill" pathLength={1} d="M18 50 A 34 34 0 1 1 82 50" fill="none" />
      <circle className="rdz-scene__gauge-tip" r="3.4" />
    </svg>
  );
}

const SHIELD_D = 'M50 8 L70 15 V 32 C 70 44 61 52 50 56 C 39 52 30 44 30 32 V 15 Z';

/** A persistent verified shield (fill + outline + check) with a periodic scan
 *  sweep — always on the canvas, so it never blanks between loops. */
export function SceneShield(): React.ReactElement {
  // Sanitise the id (useId yields ':r0:'-style colons — safe for CSS id refs in
  // modern browsers, but the strip is cheap insurance for SVG clip references).
  const clipId = React.useId().replace(/:/g, '');
  return (
    <svg className="rdz-scene__shield" viewBox="0 0 100 60" aria-hidden="true">
      <clipPath id={clipId}><path d={SHIELD_D} /></clipPath>
      <path className="rdz-scene__shield-fill" d={SHIELD_D} />
      <path className="rdz-scene__shield-outline" d={SHIELD_D} fill="none" />
      <path className="rdz-scene__shield-check" d="M42 32 L48 38 L59 26" fill="none" />
      <rect className="rdz-scene__shield-scan" clipPath={`url(#${clipId})`} x="26" y="6" width="48" height="8" />
    </svg>
  );
}

/** Dotted map fragment; two pins drop with landing ripples. */
export function ScenePins(): React.ReactElement {
  return (
    <svg className="rdz-scene__pins" viewBox="0 0 100 60" aria-hidden="true">
      <g className="rdz-scene__pins-dots">
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i} cx={18 + (i % 5) * 16} cy={16 + Math.floor(i / 5) * 14} r="1.4" />
        ))}
      </g>
      <circle className="rdz-scene__pin-ripple rdz-scene__pin-ripple--0" cx="34" cy="31" r="6" />
      <circle className="rdz-scene__pin-ripple rdz-scene__pin-ripple--1" cx="66" cy="45" r="6" />
      {/* teardrop with a punched hole (evenodd: outer drop + inner circle subpath) */}
      <path className="rdz-scene__pin rdz-scene__pin--0" fillRule="evenodd"
        d="M34 31 C 29 25 26 22 26 17 A 8 8 0 1 1 42 17 C 42 22 39 25 34 31 Z M34 20 a 3 3 0 1 0 0-6 a 3 3 0 1 0 0 6 Z" />
      <path className="rdz-scene__pin rdz-scene__pin--1" fillRule="evenodd"
        d="M66 45 C 61 39 58 36 58 31 A 8 8 0 1 1 74 31 C 74 36 71 39 66 45 Z M66 34 a 3 3 0 1 0 0-6 a 3 3 0 1 0 0 6 Z" />
    </svg>
  );
}

/** Payment card — chip, number lines, shine sweep, tap ripple. */
export function SceneCard(): React.ReactElement {
  return (
    <span className="rdz-scene__pay">
      <span className="rdz-scene__pay-chip" />
      <span className="rdz-scene__pay-line rdz-scene__pay-line--0" />
      <span className="rdz-scene__pay-line rdz-scene__pay-line--1" />
      <span className="rdz-scene__pay-shine" />
      <span className="rdz-scene__pay-ring" />
    </span>
  );
}
