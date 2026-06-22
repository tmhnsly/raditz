// Server-safe core of the Color-scheme module (NO 'use client'): the storage key,
// the media query, and the pre-paint script that applies class="dark" before first
// paint. The runtime hook (useColorScheme) imports the same constants, so the
// resolution rule — explicit stored choice wins, else follow the OS — lives in ONE
// place across both faces (the hook AND the SSR no-flash script).

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
