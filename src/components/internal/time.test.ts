import { describe, it, expect } from 'vitest';
import { parseTime, toISOTime, to12, to24, formatTime } from './time';

describe('time helpers', () => {
  it('parses valid HH:mm', () => {
    expect(parseTime('09:05')).toEqual({ h: 9, m: 5 });
    expect(parseTime('23:59')).toEqual({ h: 23, m: 59 });
    expect(parseTime('9:05')).toEqual({ h: 9, m: 5 });
  });

  it('rejects invalid / empty', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime(undefined)).toBeNull();
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('12:60')).toBeNull();
    expect(parseTime('9:5')).toBeNull();
    expect(parseTime('aa:bb')).toBeNull();
  });

  it('formats the canonical ISO time', () => {
    expect(toISOTime(9, 5)).toBe('09:05');
    expect(toISOTime(0, 0)).toBe('00:00');
  });

  it('round-trips 24h <-> 12h', () => {
    expect(to12(0)).toEqual({ h12: 12, period: 'AM' });
    expect(to12(12)).toEqual({ h12: 12, period: 'PM' });
    expect(to12(13)).toEqual({ h12: 1, period: 'PM' });
    expect(to24(12, 'AM')).toBe(0);
    expect(to24(1, 'PM')).toBe(13);
    expect(to24(12, 'PM')).toBe(12);
  });

  it('formats display strings', () => {
    expect(formatTime(9, 5, true)).toBe('9:05 AM');
    expect(formatTime(21, 5, false)).toBe('21:05');
    expect(formatTime(0, 0, true)).toBe('12:00 AM');
    expect(formatTime(12, 30, true)).toBe('12:30 PM');
  });
});
