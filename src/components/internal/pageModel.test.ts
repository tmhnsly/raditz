import { describe, it, expect } from 'vitest';
import { pageCount, buildPages, pageSlice, pageRange } from './pageModel';

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

describe('pageSlice (0-based page)', () => {
  const items = [0, 1, 2, 3, 4, 5, 6];
  it('returns the slice for the page, including a partial last page', () => {
    expect(pageSlice(items, 0, 3)).toEqual([0, 1, 2]);
    expect(pageSlice(items, 1, 3)).toEqual([3, 4, 5]);
    expect(pageSlice(items, 2, 3)).toEqual([6]);
  });
  it('returns all items (same ref) when pageSize <= 0', () => {
    expect(pageSlice(items, 0, 0)).toBe(items);
  });
});

describe('pageRange (1-based human range)', () => {
  it('reports from–to of total, clamping the last page to total', () => {
    expect(pageRange(0, 10, 53)).toEqual({ from: 1, to: 10, total: 53 });
    expect(pageRange(5, 10, 53)).toEqual({ from: 51, to: 53, total: 53 });
  });
  it('is empty when there are no items', () => {
    expect(pageRange(0, 10, 0)).toEqual({ from: 0, to: 0, total: 0 });
  });
});
