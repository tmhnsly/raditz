'use client';
import { useColorScheme } from 'raditz';

// Applies dark mode after hydration (the inline script in layout handles first paint).
// For the live accent picker with your brand baseline, also call useTheme({ accent: … }).
export function ThemeRuntime() {
  useColorScheme();
  return null;
}
