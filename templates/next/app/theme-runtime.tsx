'use client';
import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
export const DEFAULT_SCHEME = 'system' as const;

// Applies dark mode after hydration (the inline script in layout handles first paint).
// For the live accent picker with your brand baseline, also call useTheme({ accent: … }).
//
// Scroll reveals + title animations follow CSS defaults out of the box. For an app-wide
// "vibe", add data-reveal / data-title-anim to <html> in layout (fixed), or pass the
// axes to useTheme({ reveal: 'blur', titleAnim: 'blur-in', motion: 'calm' }).
export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
