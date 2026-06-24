import { describe, it, expect } from 'vitest';
import { addTag } from './tags';

describe('addTag', () => {
  it('appends a trimmed tag', () => {
    expect(addTag(['a'], '  b ')).toEqual(['a', 'b']);
  });
  it('rejects empty / whitespace / duplicate input (null = no change)', () => {
    expect(addTag(['a'], '   ')).toBeNull();
    expect(addTag(['a'], 'a')).toBeNull();
  });
  it('respects max, but treats 0/undefined as no cap (legacy behaviour)', () => {
    expect(addTag(['a', 'b'], 'c', 2)).toBeNull();
    expect(addTag(['a', 'b'], 'c', 3)).toEqual(['a', 'b', 'c']);
    expect(addTag(['a', 'b'], 'c', 0)).toEqual(['a', 'b', 'c']);
    expect(addTag(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });
});
