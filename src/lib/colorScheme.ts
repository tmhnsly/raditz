// Server-safe core of the Color-scheme module (NO 'use client'): the storage key,
// the media query, and the pre-paint faces that apply class="dark" before first
// paint. The runtime hook (useColorScheme) imports the same constants, so the
// resolution rule — explicit stored choice wins, else follow the OS — lives in ONE
// place across all faces (the hook, the SSR no-flash script, and the client-render
// init for non-SSR apps).

/** What the app actually renders. */
export type ColorScheme = 'light' | 'dark';
/** What the user chose: an explicit scheme, or 'system' = follow the OS. */
export type ColorPreference = 'system' | ColorScheme;

export const COLOR_SCHEME_KEY = 'rdz-color-scheme';
export const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * The pre-paint no-flash script as a string, for a Next/SSR `<head>`:
 * `<script dangerouslySetInnerHTML={{ __html: colorSchemeScript(DEFAULT_SCHEME) }} />`.
 * It mirrors `useColorScheme` exactly (same key, query, precedence) so there's no
 * light→dark flash and no second copy of the rule to keep in sync.
 */
export function colorSchemeScript(defaultScheme: ColorPreference = 'system'): string {
  const k = JSON.stringify(COLOR_SCHEME_KEY);
  const q = JSON.stringify(COLOR_SCHEME_QUERY);
  const d = JSON.stringify(defaultScheme);
  return (
    `(function(){try{var k=${k},d=${d},v=localStorage.getItem(k);` +
    `var dark=v==='dark'||(v!=='light'&&(d==='dark'||(d!=='light'&&window.matchMedia(${q}).matches)));` +
    `if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`
  );
}

/**
 * The pre-paint no-flash init for client-rendered (non-SSR) apps, e.g. Vite: call it
 * at the very top of the entry module, BEFORE the first render, so `class="dark"` is
 * set before anything paints. Same key, query, and precedence as `colorSchemeScript`
 * (this is that script as a callable, for apps with no server-rendered `<head>`);
 * `useColorScheme` then keeps the class in sync after mount.
 */
export function initColorScheme(defaultScheme: ColorPreference = 'system'): void {
  try {
    const v = localStorage.getItem(COLOR_SCHEME_KEY);
    const dark =
      v === 'dark' ||
      (v !== 'light' &&
        (defaultScheme === 'dark' ||
          (defaultScheme !== 'light' && window.matchMedia(COLOR_SCHEME_QUERY).matches)));
    if (dark) document.documentElement.classList.add('dark');
  } catch {
    /* no DOM / storage blocked — useColorScheme applies the scheme on mount */
  }
}
