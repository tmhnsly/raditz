import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
const DEFAULT_SCHEME = 'system' as const;

// Applies dark mode (class="dark" on <html>) following OS + persisted choice.
// To also use the live accent picker with YOUR brand as the baseline, call
// useTheme({ accent: 'iris' }) here too (import it from 'raditz').
//
// Scroll reveals + title animations follow CSS defaults out of the box. To set an
// app-wide entrance style, add data-reveal to <html> in index.html (fixed; the heading
// entrance is derived from it), or pass it live via useTheme({ reveal: 'blur', motion: 'calm' }).
export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
