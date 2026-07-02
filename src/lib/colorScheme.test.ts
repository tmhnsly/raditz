import { describe, it, expect, beforeEach } from 'vitest';
import { colorSchemeScript, initColorScheme, COLOR_SCHEME_KEY } from './colorScheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

// initColorScheme is the runtime face of colorSchemeScript (same key/precedence),
// so the two are exercised side by side: the script string is eval'd where the
// callable is called, and both must land on the same class="dark" outcome.
function runScript(defaultScheme?: 'system' | 'light' | 'dark') {
  // eslint-disable-next-line no-eval
  (0, eval)(colorSchemeScript(defaultScheme));
}

describe.each([
  ['initColorScheme (runtime face)', initColorScheme],
  ['colorSchemeScript (SSR face)', runScript],
])('%s', (_label, apply) => {
  it('follows the system (light in jsdom) by default', () => {
    apply(undefined);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark before paint when defaultScheme is dark', () => {
    apply('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('a persisted dark choice wins over a light default', () => {
    localStorage.setItem(COLOR_SCHEME_KEY, 'dark');
    apply('light');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('a persisted light choice wins over a dark default', () => {
    localStorage.setItem(COLOR_SCHEME_KEY, 'light');
    apply('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
