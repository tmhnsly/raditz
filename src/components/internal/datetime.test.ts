import { describe, it, expect } from 'vitest';
import { parseISO, toISO, sameDay, outOfRange, monthGrid } from './datetime';

describe('parseISO / toISO', () => {
  it('round-trips a YYYY-MM-DD string', () => {
    expect(toISO(parseISO('2026-06-19'))).toBe('2026-06-19');
  });
  it('pads single-digit month and day', () => {
    expect(toISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('returns null / empty for missing input', () => {
    expect(parseISO('')).toBeNull();
    expect(parseISO(undefined)).toBeNull();
    expect(toISO(null)).toBe('');
  });
});

describe('sameDay', () => {
  it('compares the calendar day and treats null as no-match', () => {
    expect(sameDay(new Date(2026, 5, 19), new Date(2026, 5, 19, 23))).toBe(true);
    expect(sameDay(new Date(2026, 5, 19), new Date(2026, 5, 20))).toBe(false);
    expect(sameDay(null, new Date())).toBe(false);
  });
});

describe('outOfRange', () => {
  const min = new Date(2026, 5, 10);
  const max = new Date(2026, 5, 20);
  it('flags dates below min or above max; null bounds are open', () => {
    expect(outOfRange(new Date(2026, 5, 9), min, max)).toBe(true);
    expect(outOfRange(new Date(2026, 5, 21), min, max)).toBe(true);
    expect(outOfRange(new Date(2026, 5, 15), min, max)).toBe(false);
    expect(outOfRange(new Date(2000, 0, 1), null, null)).toBe(false);
  });
});

describe('monthGrid (Monday-first)', () => {
  it('pads leading blanks to the first weekday, then lists every day', () => {
    const [y, m] = [2026, 1]; // February 2026 (not a leap year → 28 days)
    const grid = monthGrid(y, m);
    const startIdx = (new Date(y, m, 1).getDay() + 6) % 7;
    expect(grid.slice(0, startIdx).every((c) => c === null)).toBe(true);
    expect(grid[startIdx]).toBeInstanceOf(Date);
    expect((grid[startIdx] as Date).getDate()).toBe(1);
    expect(grid.filter(Boolean)).toHaveLength(28);
    expect(grid).toHaveLength(startIdx + 28);
  });
  it('handles leap February (2024 → 29 days)', () => {
    expect(monthGrid(2024, 1).filter(Boolean)).toHaveLength(29);
  });
});
