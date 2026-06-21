import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  it('returns false when reduced motion is not preferred (jsdom default)', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('does not throw with the jsdom matchMedia mock (subscribe/cleanup are guarded)', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    expect(() => unmount()).not.toThrow();
  });
});
