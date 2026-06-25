'use client';
import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
export const DEFAULT_SCHEME = 'system' as const;

// Applies dark mode after hydration (the inline script in layout handles first paint).
// For the live accent picker with your brand baseline, also call useTheme({ accent: … }).
//
// Scroll reveals + title animations follow CSS defaults out of the box. For an app-wide
// entrance style, set data-reveal on <html> in layout (fixed; the heading entrance is
// derived from it), or pass it live via useTheme({ reveal: 'blur', motion: 'calm' }).
export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
