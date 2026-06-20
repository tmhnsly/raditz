import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
const DEFAULT_SCHEME = 'system' as const;

// Applies dark mode (class="dark" on <html>) following OS + persisted choice.
// To also use the live accent picker with YOUR brand as the baseline, call
// useTheme({ accent: 'iris' }) here too (import it from 'raditz').
export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
