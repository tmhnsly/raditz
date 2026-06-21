import { describe, it, expect } from 'vitest';
import { minMax, normalize, toPercent, sparklinePath, donutDashes, paddedDomain, TOOLTIP_FLIP_PCT } from './scale';

describe('minMax', () => {
  it('finds the extremes', () => { expect(minMax([3, 1, 2])).toEqual({ min: 1, max: 3 }); });
  it('handles empty', () => { expect(minMax([])).toEqual({ min: 0, max: 0 }); });
});

describe('normalize', () => {
  it('maps into 0..1', () => { expect(normalize(5, 0, 10)).toBe(0.5); });
  it('guards a zero span', () => { expect(normalize(5, 5, 5)).toBe(0); });
});

describe('toPercent', () => {
  it('computes a percentage', () => { expect(toPercent(2, 4)).toBe(50); });
  it('clamps to 0..100', () => { expect(toPercent(8, 4)).toBe(100); expect(toPercent(-1, 4)).toBe(0); });
  it('guards max <= 0', () => { expect(toPercent(2, 0)).toBe(0); });
});

describe('sparklinePath', () => {
  it('starts at M0 and ends at the right edge', () => {
    const { line, area } = sparklinePath([0, 10], { w: 100, h: 10, pad: 0 });
    expect(line.startsWith('M0')).toBe(true);
    expect(line).toContain('L100');
    expect(area.endsWith('Z')).toBe(true);
  });
  it('puts the min at the bottom and the max at the top', () => {
    const { line } = sparklinePath([0, 10], { w: 100, h: 10, pad: 0 });
    // first point y = bottom (10), last point y = top (0)
    expect(line).toContain('M0.00 10.00');
    expect(line).toContain('L100.00 0.00');
  });
  it('handles empty data', () => { expect(sparklinePath([])).toEqual({ line: '', area: '' }); });
});

describe('donutDashes', () => {
  it('splits the circumference proportionally with running offsets', () => {
    expect(donutDashes([1, 1], 100)).toEqual([
      { dash: 50, gap: 50, offset: -0 },
      { dash: 50, gap: 50, offset: -50 },
    ]);
  });
});

describe('paddedDomain', () => {
  it('expands by range*factor on each side', () => {
    // lo=0, hi=10, range=10, pad=10*0.1=1 → [-1, 11]
    expect(paddedDomain([0, 10], 0.1)).toEqual([-1, 11]);
  });
  it('falls back to ±1 for a flat series (range 0)', () => {
    // lo=5, hi=5, range=0, pad=0||1=1 → [4, 6]
    expect(paddedDomain([5, 5], 0.12)).toEqual([4, 6]);
  });
  it('works with a single value (treated as flat)', () => {
    // lo=3, hi=3, range=0, pad=0||1=1 → [2, 4]
    expect(paddedDomain([3], 0.08)).toEqual([2, 4]);
  });
  it('returns [0, 1] for an empty array', () => {
    expect(paddedDomain([], 0.12)).toEqual([0, 1]);
  });
  it('preserves LineChart factor 0.12 behaviour', () => {
    // lo=0, hi=100, range=100, pad=100*0.12=12 → [-12, 112]
    expect(paddedDomain([0, 100], 0.12)).toEqual([-12, 112]);
  });
  it('preserves ScatterChart factor 0.08 behaviour', () => {
    // lo=0, hi=100, range=100, pad=100*0.08=8 → [-8, 108]
    expect(paddedDomain([0, 100], 0.08)).toEqual([-8, 108]);
  });
});

describe('TOOLTIP_FLIP_PCT', () => {
  it('is 92 — matching the hardcoded py < 92 threshold in both charts', () => {
    expect(TOOLTIP_FLIP_PCT).toBe(92);
  });
});
