import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from './theme';

const accent9 = () => document.documentElement.style.getPropertyValue('--accent-9');

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('style');
});

describe('useTheme project defaults', () => {
  it('applies the cyan default with no project default and nothing persisted', () => {
    renderHook(() => useTheme());
    expect(accent9()).toBe('var(--cyan-9)');
  });

  it('applies a project default accent when nothing is persisted', () => {
    renderHook(() => useTheme({ accent: 'iris' }));
    expect(accent9()).toBe('var(--iris-9)');
  });

  it('persisted user choice wins over the project default', () => {
    localStorage.setItem('rdz-theme', JSON.stringify({ accent: 'jade', gray: 'auto', radius: 'default', motion: 'smooth' }));
    renderHook(() => useTheme({ accent: 'iris' }));
    expect(accent9()).toBe('var(--jade-9)');
  });
});
