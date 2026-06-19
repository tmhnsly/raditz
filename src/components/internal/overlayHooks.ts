import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import type { RefObject, Dispatch, SetStateAction, KeyboardEvent as ReactKeyboardEvent } from 'react';

// Overlay internals for SuperRadix — React-only (no react-dom dependency).
// Overlays render inline with position:fixed and are positioned from client
// rects, so they escape normal flow without a portal.
const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface DismissOptions {
  ignoreRef?: RefObject<HTMLElement | null>;
  /** React to the Escape key. @default true */
  escape?: boolean;
  /** React to an outside pointerdown. @default true */
  outside?: boolean;
}

/**
 * Escape key + outside-pointer dismissal. `ignoreRef` (e.g. the trigger) is
 * excluded from outside detection. `escape` and `outside` toggle each channel
 * independently, so a caller can keep a scrim but disable outside-dismiss
 * (AlertDialog) or disable both and drive close itself (HoverCard).
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onDismiss: () => void,
  options: DismissOptions = {},
): void {
  const { ignoreRef, escape = true, outside = true } = options;
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onDismiss(); }
    };
    const onPointer = (e: PointerEvent) => {
      const c = ref.current;
      const ig = ignoreRef && ignoreRef.current;
      const target = e.target as Node;
      if (c && !c.contains(target) && !(ig && ig.contains(target))) onDismiss();
    };
    if (escape) document.addEventListener('keydown', onKey, true);
    const id = outside
      ? window.setTimeout(() => document.addEventListener('pointerdown', onPointer, true), 0)
      : undefined;
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (id !== undefined) clearTimeout(id);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, [enabled, onDismiss, ref, ignoreRef, escape, outside]);
}

/** Trap Tab focus inside `ref` while enabled, restoring focus on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !ref.current) return undefined;
    const node = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const sel = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const items = () => {
      const all = [...node.querySelectorAll<HTMLElement>(sel)];
      const visible = all.filter((x) => x.offsetParent !== null);
      // Fall back to all focusables when none report as visible (e.g. layout-less
      // environments) rather than trapping among nothing.
      return visible.length ? visible : all;
    };
    const first = items()[0];
    (first || node).focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const a = list[0];
      const b = list[list.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
      else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
  }, [enabled, ref]);
}

/** Lock body scroll while enabled. */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    // Compensate for the vanishing scrollbar so the page doesn't shift.
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) {
      const base = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${base + sbw}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [enabled]);
}

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface AnchoredOptions {
  side?: Side;
  align?: Align;
  gap?: number;
  matchWidth?: boolean;
}

export interface AnchoredPosition {
  top: number;
  left: number;
  ready: boolean;
  side: Side;
  width?: number;
}

/**
 * Position `contentRef` against `anchorRef` while `open`. Returns
 * { top, left, ready, side }. Flips side and clamps to the viewport.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  open: boolean,
  opts: AnchoredOptions = {},
): AnchoredPosition {
  const { side = 'bottom', align = 'center', gap = 8, matchWidth = false } = opts;
  const [pos, setPos] = useState<AnchoredPosition>({ top: 0, left: 0, ready: false, side });

  const update = useCallback(() => {
    const a = anchorRef.current;
    const c = contentRef.current;
    if (!a || !c) return;
    const ar = a.getBoundingClientRect();
    const cw = matchWidth ? ar.width : c.offsetWidth;
    const ch = c.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

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
    setPos({ top, left, ready: true, side: useSide, width: matchWidth ? ar.width : undefined });
  }, [anchorRef, contentRef, side, align, gap, matchWidth]);

  useIso(() => {
    if (!open) { setPos((p) => ({ ...p, ready: false })); return undefined; }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update]);

  return pos;
}

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

export interface RovingMenu {
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  onKeyDown: (e: ReactKeyboardEvent) => void;
}

/** Roving keyboard nav for a vertical menu list. Returns handlers + active index. */
export function useRovingMenu(count: number, open: boolean, onClose?: () => void): RovingMenu {
  const [active, setActive] = useState(-1);
  useEffect(() => { if (!open) setActive(-1); }, [open]);
  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % count); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + count) % count); }
      else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(count - 1); }
      else if (e.key === 'Escape') { e.preventDefault(); onClose && onClose(); }
    },
    [count, onClose],
  );
  return { active, setActive, onKeyDown };
}
