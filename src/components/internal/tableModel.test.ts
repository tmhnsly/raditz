import { describe, it, expect } from 'vitest';
import { compareValues, sortRows, nextSort, toggleSelected, togglePage, pageSelectionState } from './tableModel';

describe('compareValues (ascending, nullish last, type-aware)', () => {
  it('orders numbers numerically, not lexically', () => {
    expect(compareValues(9, 10)).toBeLessThan(0); // 9 before 10 (not "10" < "9")
    expect(compareValues(10, 9)).toBeGreaterThan(0);
  });
  it('orders strings by locale', () => {
    expect(compareValues('apple', 'banana')).toBeLessThan(0);
    expect(compareValues('banana', 'apple')).toBeGreaterThan(0);
  });
  it('sorts nullish values last', () => {
    expect(compareValues(null, 5)).toBeGreaterThan(0);
    expect(compareValues(5, null)).toBeLessThan(0);
    expect(compareValues(null, null)).toBe(0);
  });
});

describe('sortRows', () => {
  const rows = [{ n: 2, s: 'b' }, { n: 10, s: 'a' }, { n: 1, s: 'c' }];
  const get = (r: { n: number; s: string }, k: string) => (r as Record<string, unknown>)[k];

  it('returns the same array reference when sort is null (no work)', () => {
    expect(sortRows(rows, null, get)).toBe(rows);
  });
  it('sorts ascending by a numeric key', () => {
    expect(sortRows(rows, { key: 'n', dir: 'asc' }, get).map((r) => r.n)).toEqual([1, 2, 10]);
  });
  it('sorts descending by a numeric key', () => {
    expect(sortRows(rows, { key: 'n', dir: 'desc' }, get).map((r) => r.n)).toEqual([10, 2, 1]);
  });
  it('keeps nullish values last even when descending', () => {
    const withNull = [{ n: 2 }, { n: null }, { n: 5 }];
    const g = (r: { n: number | null }, k: string) => (r as Record<string, unknown>)[k];
    expect(sortRows(withNull, { key: 'n', dir: 'asc' }, g).map((r) => r.n)).toEqual([2, 5, null]);
    expect(sortRows(withNull, { key: 'n', dir: 'desc' }, g).map((r) => r.n)).toEqual([5, 2, null]);
  });
  it('does not mutate the input array', () => {
    const input = [{ n: 3 }, { n: 1 }];
    const g = (r: { n: number }, k: string) => (r as Record<string, unknown>)[k];
    sortRows(input, { key: 'n', dir: 'asc' }, g);
    expect(input.map((r) => r.n)).toEqual([3, 1]);
  });
});

describe('nextSort (header-click cycle)', () => {
  it('a fresh column starts ascending', () => {
    expect(nextSort(null, 'name')).toEqual({ key: 'name', dir: 'asc' });
    expect(nextSort({ key: 'age', dir: 'asc' }, 'name')).toEqual({ key: 'name', dir: 'asc' });
  });
  it('the active column cycles asc → desc → off', () => {
    expect(nextSort({ key: 'name', dir: 'asc' }, 'name')).toEqual({ key: 'name', dir: 'desc' });
    expect(nextSort({ key: 'name', dir: 'desc' }, 'name')).toBeNull();
  });
});

describe('selection algebra', () => {
  it('toggleSelected adds an absent key and removes a present one', () => {
    expect(toggleSelected([1, 2], 3)).toEqual([1, 2, 3]);
    expect(toggleSelected([1, 2, 3], 2)).toEqual([1, 3]);
  });
  it('togglePage selects the whole page, preserving off-page selection, without dups', () => {
    expect(togglePage(['x'], ['a', 'b'])).toEqual(['x', 'a', 'b']);
    expect(togglePage(['a'], ['a', 'b'])).toEqual(['a', 'b']);
  });
  it('togglePage clears the page when every page key is already selected, keeping off-page', () => {
    expect(togglePage(['x', 'a', 'b'], ['a', 'b'])).toEqual(['x']);
  });
  it('pageSelectionState reports all / some / none (and none for an empty page)', () => {
    expect(pageSelectionState(['a', 'b'], ['a', 'b'])).toBe('all');
    expect(pageSelectionState(['a'], ['a', 'b'])).toBe('some');
    expect(pageSelectionState(['z'], ['a', 'b'])).toBe('none');
    expect(pageSelectionState(['a', 'b'], [])).toBe('none');
  });
});
