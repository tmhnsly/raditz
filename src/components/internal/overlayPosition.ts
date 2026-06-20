import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
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

export interface AnchorRect { top: number; left: number; right: number; bottom: number; width: number; height: number; }
export interface Box { width: number; height: number; }
export interface Viewport { width: number; height: number; }

/**
 * Pure anchored-overlay solver. Given the trigger rect, the panel size, the
 * requested side/align/gap and the viewport, resolve the panel's viewport
 * coordinates — flipping to the OPPOSITE side (on both axes) when the requested
 * side would overflow and the opposite side has room, aligning on the cross
 * axis, then clamping into the viewport with `margin`. No DOM: unit-tested
 * directly. The hook below feeds it real `getBoundingClientRect()` data.
 */
export function resolveAnchored(
  anchor: AnchorRect,
  panel: Box,
  opts: { side: Side; align: Align; gap: number },
  vp: Viewport,
  margin = 8,
): { side: Side; top: number; left: number } {
  const { gap, align } = opts;
  const cw = panel.width;
  const ch = panel.height;
  let side = opts.side;

  // Flip when the preferred side overflows and the opposite side fits. Vertical
  // sides flip top<->bottom; horizontal sides flip left<->right.
  if (side === 'bottom' && anchor.bottom + gap + ch > vp.height && anchor.top - gap - ch >= 0) side = 'top';
  else if (side === 'top' && anchor.top - gap - ch < 0 && anchor.bottom + gap + ch <= vp.height) side = 'bottom';
  else if (side === 'right' && anchor.right + gap + cw > vp.width && anchor.left - gap - cw >= 0) side = 'left';
  else if (side === 'left' && anchor.left - gap - cw < 0 && anchor.right + gap + cw <= vp.width) side = 'right';

  let top: number;
  let left: number;

  // Main-axis offset from the resolved side.
  if (side === 'bottom') top = anchor.bottom + gap;
  else if (side === 'top') top = anchor.top - ch - gap;
  else top = anchor.top; // left/right resolve `top` on the cross axis below.

  if (side === 'left') left = anchor.left - cw - gap;
  else if (side === 'right') left = anchor.right + gap;
  else if (align === 'start') left = anchor.left;
  else if (align === 'end') left = anchor.right - cw;
  else left = anchor.left + anchor.width / 2 - cw / 2;

  // Cross axis for horizontal sides — align resolves against the resolved side.
  if (side === 'left' || side === 'right') {
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.bottom - ch;
    else top = anchor.top + anchor.height / 2 - ch / 2;
  }

  // Clamp into the viewport so a flip/align never pushes the panel off-screen.
  left = Math.max(margin, Math.min(left, vp.width - cw - margin));
  top = Math.max(margin, Math.min(top, vp.height - ch - margin));
  return { side, top, left };
}

/**
 * Position a panel for any {@link OverlayPosition}. For `centered`/`side` the
 * panel is positioned by CSS, so this returns `{ ready: true }` with no coords.
 * For `anchored`/`point` it measures and clamps to the viewport, flipping on
 * overflow (see {@link resolveAnchored}).
 *
 * Scroll/resize re-positioning is coalesced to one measurement per animation
 * frame (rAF) and written STRAIGHT to the panel's CSS custom properties, so a
 * scroll doesn't wait on a React render — that render-per-scroll-event lag was
 * the "floaty wobble". React state is only updated when the resolved `side`
 * (or readiness) changes, which is what `data-side` / first paint depend on.
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

  // Last applied result so the rAF loop can skip redundant React renders.
  const lastRef = useRef<OverlayPositionResult | null>(null);

  const measure = useCallback((): OverlayPositionResult | null => {
    const c = contentRef.current;
    if (!c) return null;
    const vp = { width: window.innerWidth, height: window.innerHeight };

    if (kind === 'point') {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      const left = Math.max(8, Math.min(px, vp.width - w - 8));
      const top = Math.max(8, Math.min(py, vp.height - h - 8));
      return { ready: true, top, left };
    }

    const a = anchorRef?.current;
    if (!a) return null;
    const ar = a.getBoundingClientRect();
    const cw = matchWidth ? ar.width : c.offsetWidth;
    const ch = c.offsetHeight;
    const r = resolveAnchored(ar, { width: cw, height: ch }, { side, align, gap }, vp);
    return { ready: true, side: r.side, top: r.top, left: r.left, width: matchWidth ? ar.width : undefined };
  }, [contentRef, kind, anchorRef, side, align, gap, matchWidth, px, py]);

  useIso(() => {
    if (kind === 'centered' || kind === 'side') { setState({ ready: true }); return undefined; }
    if (!open) { setState({ ready: false }); lastRef.current = null; return undefined; }

    const c = contentRef.current;
    const apply = (next: OverlayPositionResult): void => {
      const prev = lastRef.current;
      // Write coords directly to the panel so a scroll re-position doesn't wait
      // on React; only re-render when the side or readiness actually changes.
      if (c) {
        if (next.top != null) c.style.setProperty('--rdz-overlay-top', `${next.top}px`);
        if (next.left != null) c.style.setProperty('--rdz-overlay-left', `${next.left}px`);
        if (next.width != null) c.style.setProperty('--rdz-overlay-width', `${next.width}px`);
      }
      if (!prev || prev.side !== next.side || prev.ready !== next.ready) setState(next);
      lastRef.current = next;
    };

    const first = measure();
    if (first) apply(first);

    let raf = 0;
    const schedule = (): void => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = measure();
        if (next) apply(next);
      });
    };
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [open, measure, kind, contentRef]);

  return state;
}
