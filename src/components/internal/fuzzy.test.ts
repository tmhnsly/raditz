import { describe, it, expect } from 'vitest';
import { fuzzyScore, fuzzyFilter } from './fuzzy';

describe('fuzzyScore', () => {
  it('matches a subsequence', () => {
    expect(fuzzyScore('Button', 'btn')).not.toBeNull();
    expect(fuzzyScore('Button', 'bn')).not.toBeNull();
  });

  it('returns null when characters are missing or out of order', () => {
    expect(fuzzyScore('Button', 'xyz')).toBeNull();
    expect(fuzzyScore('Button', 'ntb')).toBeNull(); // wrong order
  });

  it('empty query matches everything (score 0)', () => {
    expect(fuzzyScore('anything', '')).toBe(0);
  });

  it('scores a contiguous prefix higher than a scattered match', () => {
    const prefix = fuzzyScore('Button', 'but')!;
    const scattered = fuzzyScore('Breadcrumb tab', 'but')!;
    expect(prefix).toBeGreaterThan(scattered);
  });

  it('rewards matches at word boundaries', () => {
    const boundary = fuzzyScore('Drop Down Menu', 'ddm')!;
    expect(boundary).not.toBeNull();
    expect(boundary).toBeGreaterThan(0);
  });
});

describe('fuzzyFilter', () => {
  const items = ['Button', 'Badge', 'Breadcrumb', 'Dropdown Menu', 'Avatar'];

  it('returns all items unchanged for an empty query', () => {
    expect(fuzzyFilter(items, '', (s) => s)).toEqual(items);
  });

  it('keeps only matches and ranks the best first', () => {
    const out = fuzzyFilter(items, 'ba', (s) => s);
    expect(out).toContain('Badge');
    expect(out).not.toContain('Avatar');
    expect(out[0]).toBe('Badge'); // prefix beats internal match
  });

  it('matches across word boundaries', () => {
    expect(fuzzyFilter(items, 'dm', (s) => s)).toContain('Dropdown Menu');
  });
});
