import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColorScheme } from './useColorScheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useColorScheme defaultScheme', () => {
  it('follows system (light in jsdom) by default', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.scheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('honours defaultScheme: dark when nothing is persisted', () => {
    const { result } = renderHook(() => useColorScheme({ defaultScheme: 'dark' }));
    expect(result.current.scheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persisted choice wins over defaultScheme', () => {
    localStorage.setItem('rdz-color-scheme', 'light');
    const { result } = renderHook(() => useColorScheme({ defaultScheme: 'dark' }));
    expect(result.current.scheme).toBe('light');
  });
});
