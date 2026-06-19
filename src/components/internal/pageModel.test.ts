import { describe, it, expect } from 'vitest';
import { pageCount, buildPages } from './pageModel';

describe('pageCount', () => {
  it('ceils items / pageSize', () => {
    expect(pageCount(10, 5)).toBe(2);
    expect(pageCount(11, 5)).toBe(3);
  });
  it('is at least 1, and 1 when pageSize <= 0', () => {
    expect(pageCount(0, 5)).toBe(1);
    expect(pageCount(10, 0)).toBe(1);
  });
});

describe('buildPages (fixed-width window)', () => {
  it('lists all pages when they fit', () => {
    expect(buildPages(1, 3, 1)).toEqual([1, 2, 3]);
  });
  it('keeps a constant slot count for large totals', () => {
    expect(buildPages(1, 10, 1)).toEqual([1, 2, 3, 4, 5, '…', 10]);
    expect(buildPages(5, 10, 1)).toEqual([1, '…', 4, 5, 6, '…', 10]);
    expect(buildPages(10, 10, 1)).toEqual([1, '…', 6, 7, 8, 9, 10]);
  });
});
