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

/** Two out-of-phase sine lines drifting. */
export function SceneWaves(): React.ReactElement {
  return (
    <svg className="rdz-scene__wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path className="rdz-scene__wave-a" d="M-25 20 Q -12.5 4 0 20 T 25 20 T 50 20 T 75 20 T 100 20 T 125 20" fill="none" />
      <path className="rdz-scene__wave-b" d="M-25 20 Q -12.5 36 0 20 T 25 20 T 50 20 T 75 20 T 100 20 T 125 20" fill="none" />
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

/** Line chart drawing itself upward — soft area fill, pulsing end-dot. */
export function SceneTrend(): React.ReactElement {
  return (
    <svg className="rdz-scene__trend" viewBox="0 0 100 60" aria-hidden="true">
      <path className="rdz-scene__trend-area" d="M10 48 C 26 46 34 36 50 32 S 74 20 90 14 L 90 52 L 10 52 Z" />
      <path className="rdz-scene__trend-line" pathLength={1} d="M10 48 C 26 46 34 36 50 32 S 74 20 90 14" fill="none" />
      <circle className="rdz-scene__trend-dot" cx="90" cy="14" r="3.2" />
    </svg>
  );
}

/** Message bubbles popping in, typing-dots on the last. */
export function SceneChat(): React.ReactElement {
  return <span className="rdz-scene__chat" />;
}

/** Window chrome + a prompt line typing with a blinking caret. */
export function SceneTerminal(): React.ReactElement {
  return <span className="rdz-scene__frame rdz-scene__frame--terminal" />;
}

/** Browser frame with skeleton content blocks shimmering in. */
export function SceneWindow(): React.ReactElement {
  return <span className="rdz-scene__frame rdz-scene__frame--window" />;
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

/** Shield outline draws on, check lands, one soft scan pass. */
export function SceneShield(): React.ReactElement {
  return <svg className="rdz-scene__shield" viewBox="0 0 100 60" aria-hidden="true" />;
}

/** Dotted map fragment; two pins drop with landing ripples. */
export function ScenePins(): React.ReactElement {
  return <svg className="rdz-scene__pins" viewBox="0 0 100 60" aria-hidden="true" />;
}

/** Payment card — chip, number lines, shine sweep, tap ripple. */
export function SceneCard(): React.ReactElement {
  return <span className="rdz-scene__pay" />;
}
