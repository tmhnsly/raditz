import { describe, it, expect } from 'vitest';
import { activeSection } from './scrollSpy';

// `activeSection` picks which section the reader is "on" from live geometry:
// the last section (in vertical order) whose top has crossed the activation line.
// Stateless — recomputed from scratch each scroll frame, so it can't get stuck on
// a stale IntersectionObserver batch.
describe('activeSection', () => {
  it('is Overview ("") when there are no sections', () => {
    expect(activeSection([], 200)).toBe('');
  });

  it('is Overview while the first section is still below the line', () => {
    expect(activeSection([{ id: 'a', top: 500 }, { id: 'b', top: 900 }], 200)).toBe('');
  });

  it('is the first section once its top reaches the line', () => {
    expect(activeSection([{ id: 'a', top: 150 }, { id: 'b', top: 700 }], 200)).toBe('a');
  });

  it('is the deepest section whose top has crossed the line', () => {
    const secs = [{ id: 'a', top: -300 }, { id: 'b', top: 50 }, { id: 'c', top: 600 }];
    expect(activeSection(secs, 200)).toBe('b');
  });

  it('is the last section when the whole page has scrolled above the line', () => {
    expect(activeSection([{ id: 'a', top: -800 }, { id: 'b', top: -200 }], 200)).toBe('b');
  });
});
