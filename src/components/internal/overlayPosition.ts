import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import type { RefObject } from 'react';

// Overlay concern: panel positioning. Panels are positioned from client rects and
// portaled to <body> (see Overlay.tsx) so position:fixed stays viewport-relative
// even under a transformed/filtered ancestor. Re-exported by overlayHooks.ts.
const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

/**
 * The four overlay topologies, as a discriminated union — each variant carries
 * only the params it needs, so illegal combinations (e.g. `x` on a centered
 * overlay) don't typecheck. `anchored`/`point` are positioned by JS against a
 * trigger rect or a pointer; `centered`/`side` are positioned by CSS.
 */
export type OverlayPosition =
  | { kind: 'anchored'; anchor: RefObject<HTMLElement | null>; side?: Side; align?: Align; gap?: number; matchWidth?: boolean }
  | { kind: 'point'; x: number; y: number }
  | { kind: 'centered'; size?: 'sm' | 'md' | 'lg' }
  | { kind: 'side'; side: Side; size?: string };

export interface OverlayPositionResult {
  ready: boolean;
  /** Resolved coordinates (anchored/point only) — consumed as CSS custom properties. */
  top?: number;
  left?: number;
  width?: number;
  /** Resolved side after flipping (for `data-side`). */
  side?: Side;
}

/**
 * Position a panel for any {@link OverlayPosition}. For `centered`/`side` the
 * panel is positioned by CSS, so this returns `{ ready: true }` with no coords.
 * For `anchored`/`point` it measures and clamps to the viewport, flipping
 * `anchored` to the opposite side on overflow. The result is *data* (numbers),
 * which the caller feeds to CSS as custom properties — no inline styling.
 */
export function useOverlayPosition(
  contentRef: RefObject<HTMLElement | null>,
  position: OverlayPosition,
  open: boolean,
): OverlayPositionResult {
  const cssPositioned = position.kind === 'centered' || position.kind === 'side';
  const [state, setState] = useState<OverlayPositionResult>(
    cssPositioned ? { ready: true } : { ready: false },
  );

  // Pull primitives out so the callback memoizes on values, not object identity.
  const anchorRef = position.kind === 'anchored' ? position.anchor : null;
  const side = position.kind === 'anchored' ? position.side ?? 'bottom' : position.kind === 'side' ? position.side : 'bottom';
  const align = position.kind === 'anchored' ? position.align ?? 'center' : 'center';
  const gap = position.kind === 'anchored' ? position.gap ?? 8 : 8;
  const matchWidth = position.kind === 'anchored' ? !!position.matchWidth : false;
  const px = position.kind === 'point' ? position.x : 0;
  const py = position.kind === 'point' ? position.y : 0;
  const kind = position.kind;

  const update = useCallback(() => {
    const c = contentRef.current;
    if (!c) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (kind === 'point') {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      const left = Math.max(8, Math.min(px, vw - w - 8));
      const top = Math.max(8, Math.min(py, vh - h - 8));
      setState({ ready: true, top, left });
      return;
    }

    // anchored
    const a = anchorRef?.current;
    if (!a) return;
    const ar = a.getBoundingClientRect();
    const cw = matchWidth ? ar.width : c.offsetWidth;
    const ch = c.offsetHeight;

    let useSide: Side = side;
    if (side === 'bottom' && ar.bottom + gap + ch > vh && ar.top - gap - ch > 0) useSide = 'top';
    if (side === 'top' && ar.top - gap - ch < 0 && ar.bottom + gap + ch < vh) useSide = 'bottom';

    let top: number;
    let left: number;
    if (useSide === 'bottom') top = ar.bottom + gap;
    else if (useSide === 'top') top = ar.top - ch - gap;
    else top = ar.top;

    if (useSide === 'left') left = ar.left - cw - gap;
    else if (useSide === 'right') left = ar.right + gap;
    else if (align === 'start') left = ar.left;
    else if (align === 'end') left = ar.right - cw;
    else left = ar.left + ar.width / 2 - cw / 2;

    if (useSide === 'left' || useSide === 'right') {
      if (align === 'start') top = ar.top;
      else if (align === 'end') top = ar.bottom - ch;
      else top = ar.top + ar.height / 2 - ch / 2;
    }

    left = Math.max(8, Math.min(left, vw - cw - 8));
    top = Math.max(8, Math.min(top, vh - ch - 8));
    setState({ ready: true, side: useSide, top, left, width: matchWidth ? ar.width : undefined });
  }, [contentRef, kind, anchorRef, side, align, gap, matchWidth, px, py]);

  useIso(() => {
    if (kind === 'centered' || kind === 'side') { setState({ ready: true }); return undefined; }
    if (!open) { setState({ ready: false }); return undefined; }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update, kind]);

  return state;
}
