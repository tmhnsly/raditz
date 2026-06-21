import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme, themeVars } from './theme';

const accent9 = () => document.documentElement.style.getPropertyValue('--accent-9');

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('style');
});

describe('themeVars (palette resolution)', () => {
  it('resolves the accent ramp + auto gray pairing', () => {
    const v = themeVars({ accent: 'iris', gray: 'auto' });
    expect(v['--accent-9']).toBe('var(--iris-9)');
    expect(v['--neutral-9']).toBe('var(--slate-9)'); // iris pairs with slate
  });
  it('picks a semantic scale AWAY from the accent', () => {
    // success family is ['grass','jade',…]; first member ≠ accent wins.
    expect(themeVars({ accent: 'grass', gray: 'auto' })['--success']).toBe('var(--jade-9)'); // accent IS grass → pick away to jade
    expect(themeVars({ accent: 'cyan', gray: 'auto' })['--success']).toBe('var(--grass-9)'); // default: first family member
    expect(themeVars({ accent: 'green', gray: 'auto' })['--success']).toBe('var(--grass-9)'); // grass is first and ≠ green
  });
  it('gives light accents dark on-accent text', () => {
    expect(themeVars({ accent: 'sky', gray: 'auto' })['--on-accent']).toBe('var(--black-a12)');
    expect(themeVars({ accent: 'cyan', gray: 'auto' })['--on-accent']).toBe('var(--white-a12)');
  });
  it('sets the secondary complement + radius factor', () => {
    expect(themeVars({ accent: 'cyan', gray: 'auto' })['--accent-2-solid']).toBe('var(--gold-9)');
    expect(themeVars({ accent: 'cyan', gray: 'auto', radius: 'round' })['--radius-factor']).toBe('2.0');
  });
  it('falls back to defaults for omitted axes', () => {
    expect(themeVars()['--accent-9']).toBe('var(--cyan-9)'); // default accent
  });
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
