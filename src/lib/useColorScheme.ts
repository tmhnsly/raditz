import { useEffect, useState } from 'react';

/** What the app actually renders. */
export type ColorScheme = 'light' | 'dark';
/** What the user chose: an explicit scheme, or 'system' = follow the OS. */
export type ColorPreference = 'system' | ColorScheme;

const KEY = 'srx-color-scheme';
const QUERY = '(prefers-color-scheme: dark)';

function systemScheme(): ColorScheme {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches ? 'dark' : 'light';
}

function loadPreference(): ColorPreference {
  if (typeof localStorage !== 'undefined') {
    try {
      const v = localStorage.getItem(KEY);
      if (v === 'light' || v === 'dark') return v;
    } catch { /* ignore */ }
  }
  return 'system';
}

/**
 * Color scheme for the whole app — framework primitive, usable in any project.
 *
 * Starts from the OS preference (`prefers-color-scheme`) and **live-follows** it.
 * The toggle sets an explicit override that wins over the OS; if a toggle lands
 * back on the value the OS currently reports, the override is cleared and we
 * follow the system again. Only an explicit override is persisted (clearing it
 * removes the key), so a fresh project/visit always honours the OS until the
 * user opts in. Applies `class="dark"` on `<html>`.
 */
export function useColorScheme() {
  const [preference, setPreference] = useState<ColorPreference>(loadPreference);
  const [system, setSystem] = useState<ColorScheme>(systemScheme);

  // Live-follow the OS preference (matters whenever preference === 'system').
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const onChange = (): void => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scheme: ColorScheme = preference === 'system' ? system : preference;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', scheme === 'dark');
    if (typeof localStorage !== 'undefined') {
      try {
        if (preference === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, preference);
      } catch { /* ignore */ }
    }
  }, [scheme, preference]);

  /** Flip light↔dark; if the result equals the OS, fall back to following it. */
  const toggle = (): void => {
    const next: ColorScheme = scheme === 'dark' ? 'light' : 'dark';
    setPreference(next === system ? 'system' : next);
  };

  return { scheme, preference, isDark: scheme === 'dark', toggle, setPreference };
}
