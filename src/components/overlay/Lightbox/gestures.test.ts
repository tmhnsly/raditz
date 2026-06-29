import { describe, it, expect } from 'vitest';
import {
  MAX_SCALE,
  resolveDrag,
  swipePage,
  dismissShouldClose,
  dismissView,
  pinch,
  clampPan,
  zoomScale,
} from './gestures';

describe('Lightbox gestures', () => {
  describe('resolveDrag — a pending drag becomes a vertical dismiss or a horizontal swipe', () => {
    it('is a dismiss when mostly-downward', () => {
      expect(resolveDrag(0, 20)).toBe('dismiss');
      expect(resolveDrag(5, 20)).toBe('dismiss'); // 20 > 5*1.2
    });
    it('is a swipe when horizontal dominates', () => {
      expect(resolveDrag(20, 10)).toBe('swipe');
      expect(resolveDrag(20, 20)).toBe('swipe'); // 20 not > 24
    });
    it('is a swipe when the vertical travel is upward', () => {
      expect(resolveDrag(0, -30)).toBe('swipe');
    });
  });

  describe('swipePage — on release, decide whether/which way to page', () => {
    it('pages next on a long leftward swipe', () => {
      expect(swipePage(-80, 3)).toBe(1);
    });
    it('pages prev on a long rightward swipe', () => {
      expect(swipePage(80, 3)).toBe(-1);
    });
    it('stays put at or below the threshold', () => {
      expect(swipePage(40, 3)).toBe(0);
      expect(swipePage(60, 3)).toBe(0); // boundary: |dx| === SWIPE_X must not page
    });
    it('never pages a single-image gallery', () => {
      expect(swipePage(-200, 1)).toBe(0);
    });
  });

  describe('dismissShouldClose', () => {
    it('closes past the threshold', () => {
      expect(dismissShouldClose(121)).toBe(true);
    });
    it('stays open at or below it', () => {
      expect(dismissShouldClose(120)).toBe(false);
      expect(dismissShouldClose(50)).toBe(false);
    });
  });

  describe('dismissView — live transform + scrim fade while dragging down', () => {
    it('damps the horizontal, follows the vertical, and fades the scrim', () => {
      expect(dismissView(100, 250)).toEqual({ x: 40, y: 250, scrim: 0.5 });
    });
    it('clamps an upward drag to no travel and full scrim', () => {
      expect(dismissView(0, -10)).toEqual({ x: 0, y: 0, scrim: 1 });
    });
    it('floors the scrim at 0.2 for a long drag', () => {
      expect(dismissView(0, 1000).scrim).toBe(0.2);
    });
  });

  describe('pinch — two pointers → next scale and centroid-tracked pan', () => {
    it('doubles the scale when the finger distance doubles, tracking the centroid', () => {
      const g = { startScale: 1, startDist: 100, cx: 50, cy: 50, panX: 0, panY: 0 };
      expect(pinch(g, { x: 0, y: 0 }, { x: 200, y: 0 })).toEqual({ scale: 2, x: 50, y: -50 });
    });
    it('clamps scale to MAX_SCALE', () => {
      const g = { startScale: 2, startDist: 100, cx: 0, cy: 0, panX: 0, panY: 0 };
      expect(pinch(g, { x: 0, y: 0 }, { x: 1000, y: 0 }).scale).toBe(MAX_SCALE);
    });
    it('guards a zero start distance — coincident pointers give scale 1, not NaN', () => {
      const g = { startScale: 1, startDist: 0, cx: 0, cy: 0, panX: 0, panY: 0 };
      // Two fingers on the same pixel → dist 0; without the `|| 1` guard this is 0/0 = NaN.
      expect(pinch(g, { x: 0, y: 0 }, { x: 0, y: 0 }).scale).toBe(1);
    });
  });

  describe('clampPan — keep the projected image on the stage (+margin)', () => {
    it('clamps an over-pan to the computed bound', () => {
      // mx = (1000-400)/2 + 24 = 324
      expect(clampPan(500, 0, { projW: 1000, projH: 400, stageW: 400, stageH: 400 })).toEqual({ x: 324, y: 0 });
    });
    it('pins a smaller-than-stage image to centre', () => {
      expect(clampPan(50, 50, { projW: 200, projH: 200, stageW: 400, stageH: 400 })).toEqual({ x: 0, y: 0 });
    });
  });

  describe('zoomScale', () => {
    it('clamps below 1 up to 1 and above MAX down to MAX', () => {
      expect(zoomScale(0.5)).toBe(1);
      expect(zoomScale(10)).toBe(MAX_SCALE);
      expect(zoomScale(2)).toBe(2);
    });
  });
});
