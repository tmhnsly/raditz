// Lightbox gesture model — the pure geometry + decisions behind the viewer's
// pinch / pan / swipe / dismiss interactions, lifted out of the pointer handlers
// so the bug-prone bits (the swipe-vs-dismiss axis rule, paging/close thresholds,
// the scrim fade, pinch centroid-pan, pan clamping) are unit-tested instead of
// reachable only by simulating multi-touch pointer streams. Lightbox.tsx is the
// thin adapter that feeds DOM-measured numbers in and writes the result out.
// Same co-located "pure core" pattern as OneTimePasswordField/otp.ts, TagInput/tags.ts.

export const MAX_SCALE = 4;
export const SWIPE_X = 60; // px of horizontal travel to page
export const DISMISS_Y = 120; // px of downward travel to dismiss
export const PAN_MARGIN = 24; // px of slack so a panned image keeps a sliver on-stage

export interface Point {
  x: number;
  y: number;
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));
export const dist = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

/** A drag still in the 'pending' mode resolves to a vertical dismiss or a horizontal swipe. */
export function resolveDrag(dx: number, dy: number): 'dismiss' | 'swipe' {
  return Math.abs(dy) > Math.abs(dx) * 1.2 && dy > 0 ? 'dismiss' : 'swipe';
}

/** On release: 1 = page next, -1 = page prev, 0 = snap back. */
export function swipePage(dx: number, count: number): 1 | -1 | 0 {
  if (Math.abs(dx) <= SWIPE_X || count <= 1) return 0;
  return dx < 0 ? 1 : -1;
}

/** On release: did a downward dismiss-drag travel far enough to close? */
export function dismissShouldClose(dy: number): boolean {
  return dy > DISMISS_Y;
}

/** Live transform + scrim opacity while dragging down to dismiss. */
export function dismissView(dx: number, dy: number): { x: number; y: number; scrim: number } {
  const y = Math.max(0, dy);
  return { x: dx * 0.4, y, scrim: clamp(1 - y / 500, 0.2, 1) };
}

export interface PinchState {
  startScale: number;
  startDist: number;
  cx: number;
  cy: number;
  panX: number;
  panY: number;
}

/** Two live pointers → next scale and centroid-tracked pan offset (before clamping). */
export function pinch(g: PinchState, a: Point, b: Point): { scale: number; x: number; y: number } {
  const scale = clamp(g.startScale * (dist(a, b) / (g.startDist || 1)), 1, MAX_SCALE);
  const ncx = (a.x + b.x) / 2;
  const ncy = (a.y + b.y) / 2;
  return { scale, x: g.panX + (ncx - g.cx), y: g.panY + (ncy - g.cy) };
}

export interface StageBox {
  projW: number;
  projH: number;
  stageW: number;
  stageH: number;
  margin?: number;
}

/** Clamp a pan offset so the projected image can't be dragged off the stage. */
export function clampPan(x: number, y: number, box: StageBox): { x: number; y: number } {
  const margin = box.margin ?? PAN_MARGIN;
  const mx = Math.max(0, (box.projW - box.stageW) / 2 + margin);
  const my = Math.max(0, (box.projH - box.stageH) / 2 + margin);
  return { x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
}

/** Clamp a target zoom into the legal [1, MAX_SCALE] range. */
export const zoomScale = (s: number): number => clamp(s, 1, MAX_SCALE);
