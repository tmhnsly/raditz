import { describe, it, expect } from 'vitest';
import { resolveAnchored } from './overlayPosition';
import type { AnchorRect } from './overlayPosition';

const rect = (top: number, left: number, w: number, h: number): AnchorRect => ({
  top, left, right: left + w, bottom: top + h, width: w, height: h,
});
const vp = { width: 1000, height: 800 };

describe('resolveAnchored', () => {
  it('places below an anchor with room, centred on the trigger', () => {
    const r = resolveAnchored(rect(100, 400, 80, 30), { width: 200, height: 100 }, { side: 'bottom', align: 'center', gap: 8 }, vp);
    expect(r.side).toBe('bottom');
    expect(r.top).toBe(138); // 100 + 30 + 8
    expect(r.left).toBe(340); // 440 (centre) - 100
  });

  it('flips bottom→top when the panel would overflow the bottom edge', () => {
    const r = resolveAnchored(rect(740, 400, 80, 30), { width: 200, height: 100 }, { side: 'bottom', align: 'center', gap: 8 }, vp);
    expect(r.side).toBe('top');
    expect(r.top).toBe(632); // 740 - 100 - 8
  });

  it('flips right→left when the panel would overflow the right edge', () => {
    const r = resolveAnchored(rect(300, 950, 40, 40), { width: 160, height: 120 }, { side: 'right', align: 'center', gap: 8 }, vp);
    expect(r.side).toBe('left');
    expect(r.left).toBe(782); // 950 - 160 - 8
  });

  it('clamps into the viewport so it never goes off-screen', () => {
    const r = resolveAnchored(rect(100, 0, 20, 20), { width: 200, height: 80 }, { side: 'bottom', align: 'end', gap: 8 }, vp);
    expect(r.left).toBeGreaterThanOrEqual(8);
    expect(r.left).toBeLessThanOrEqual(vp.width - 200 - 8);
    expect(r.top).toBeGreaterThanOrEqual(8);
  });

  it('aligns start/end on the main axis for vertical sides', () => {
    const start = resolveAnchored(rect(100, 400, 80, 30), { width: 200, height: 60 }, { side: 'bottom', align: 'start', gap: 8 }, vp);
    expect(start.left).toBe(400);
    const end = resolveAnchored(rect(100, 400, 80, 30), { width: 200, height: 60 }, { side: 'bottom', align: 'end', gap: 8 }, vp);
    expect(end.left).toBe(280); // 480 - 200
  });

  it('does not flip when the opposite side has no room either (stays + clamps)', () => {
    // Tall panel, short viewport: neither side fully fits → keep requested side, clamp.
    const r = resolveAnchored(rect(380, 400, 80, 30), { width: 120, height: 700 }, { side: 'bottom', align: 'center', gap: 8 }, { width: 1000, height: 800 });
    expect(r.side).toBe('bottom');
    expect(r.top).toBeGreaterThanOrEqual(8);
  });
});
