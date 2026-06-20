'use client';
import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
export const DEFAULT_SCHEME = 'system' as const;

// Applies dark mode after hydration (the inline script in layout handles first paint).
// For the live accent picker with your brand baseline, also call useTheme({ accent: … }).
export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
