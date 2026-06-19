import { useEffect, useState } from 'react';

const KEY = 'srx-sections-theme';

/** Light/dark toggle — mirrors the original page: flips `class="dark"` on <html>
 *  and persists the choice. Every token/component re-themes from it. */
export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return saved === 'dark';
    } catch {
      /* ignore */
    }
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem(KEY, dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  return [dark, setDark] as const;
}
