'use client';
import { useEffect } from 'react';
import { useSyncExternalStore } from 'react';
import {
  type ColorScheme,
  type ColorPreference,
  COLOR_SCHEME_KEY as KEY,
  COLOR_SCHEME_QUERY as QUERY,
} from './colorScheme';

function systemScheme(): ColorScheme {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches ? 'dark' : 'light';
}

function readStored(): ColorScheme | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch { /* ignore */ }
  return null;
}

/**
 * One shared store behind every `useColorScheme` call, so multiple consumers
 * (e.g. a `ThemeRuntime` that sets the default AND a `ColorSchemeToggle` in the
 * nav) stay in sync instead of fighting over `class="dark"`. State resets when
 * the last subscriber unmounts, so a remounted app — and each test — re-derives
 * cleanly from storage/default.
 */
const listeners = new Set<() => void>();
let preference: ColorPreference | undefined; // undefined = not yet initialised
let system: ColorScheme = 'light';
let mql: MediaQueryList | null = null;

function computeScheme(): ColorScheme {
  return preference === undefined || preference === 'system' ? system : preference;
}

function applyClass(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', computeScheme() === 'dark');
  }
}

function emit(): void {
  for (const l of listeners) l();
}

/** Lazily seed the store from a persisted choice, else the caller's default. */
function ensureInit(defaultScheme: ColorPreference): void {
  if (preference !== undefined) return;
  preference = readStored() ?? defaultScheme;
  system = systemScheme();
  applyClass();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (!mql && typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia(QUERY);
    mql.addEventListener('change', () => {
      system = mql!.matches ? 'dark' : 'light';
      applyClass();
      emit();
    });
  }
  return () => {
    listeners.delete(cb);
    // No subscribers left → forget the in-memory choice so the next mount (or the
    // next test) re-derives from storage/default rather than leaking state.
    if (listeners.size === 0) preference = undefined;
  };
}

function setPreference(p: ColorPreference): void {
  preference = p;
  if (typeof localStorage !== 'undefined') {
    try {
      if (p === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, p);
    } catch { /* ignore */ }
  }
  applyClass();
  emit();
}

/** Flip light↔dark; if the result equals the OS, fall back to following it. */
function toggle(): void {
  const next: ColorScheme = computeScheme() === 'dark' ? 'light' : 'dark';
  setPreference(next === system ? 'system' : next);
}

/**
 * Color scheme for the whole app — framework primitive, usable in any project.
 *
 * Starts from the OS preference (`prefers-color-scheme`) and **live-follows** it.
 * The toggle sets an explicit override that wins over the OS; if a toggle lands
 * back on the value the OS currently reports, the override is cleared and we
 * follow the system again. Only an explicit override is persisted. Applies
 * `class="dark"` on `<html>`. All callers share one store (see above).
 *
 * Pass `{ defaultScheme: 'dark' }` to open in dark mode by default (still
 * user-toggleable; a persisted user choice always wins).
 */
export function useColorScheme(opts?: { defaultScheme?: ColorPreference }) {
  const fallback = opts?.defaultScheme ?? 'system';
  ensureInit(fallback);
  const scheme = useSyncExternalStore(
    subscribe,
    computeScheme,
    () => (fallback === 'dark' ? 'dark' : 'light'),
  );
  // Re-assert the class after (re)mount — covers the first client render and any
  // remount that re-seeded the store.
  useEffect(() => { applyClass(); }, [scheme]);

  return {
    scheme,
    preference: preference ?? 'system',
    isDark: scheme === 'dark',
    toggle,
    setPreference,
  };
}
