import { useColorScheme } from 'raditz';

// Applies dark mode (class="dark" on <html>) following OS + persisted choice.
// To also use the live accent picker with YOUR brand as the baseline, call
// useTheme({ accent: 'iris' }) here too (import it from 'raditz').
export function ThemeRuntime() {
  useColorScheme();
  return null;
}
