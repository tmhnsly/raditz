import { describe, it, expect } from 'vitest';
import { minMax, normalize, toPercent, sparklinePath, donutDashes } from './scale';

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
