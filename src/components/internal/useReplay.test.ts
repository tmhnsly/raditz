import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReplay } from './useReplay';

describe('useReplay', () => {
  it('starts at 0 and increments the key on replay', () => {
    const { result } = renderHook(() => useReplay());
    expect(result.current.key).toBe(0);
    act(() => result.current.replay());
    expect(result.current.key).toBe(1);
    act(() => result.current.replay());
    expect(result.current.key).toBe(2);
  });

  it('keeps a stable replay reference across renders', () => {
    const { result, rerender } = renderHook(() => useReplay());
    const first = result.current.replay;
    rerender();
    expect(result.current.replay).toBe(first);
  });
});
