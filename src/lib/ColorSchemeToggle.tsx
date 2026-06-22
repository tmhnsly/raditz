'use client';
import type { ReactElement } from 'react';
import { useColorScheme } from './useColorScheme';
import { Icon } from '../components/foundation/Icon';
import { cx } from '../components/internal';

export interface ColorSchemeToggleProps {
  className?: string;
}

/**
 * ColorSchemeToggle — a single icon button that flips light ↔ dark. Wraps
 * {@link useColorScheme}, so it persists the choice, live-follows the OS until
 * the user opts in, and applies `class="dark"` on `<html>`. Drop it in any nav.
 */
export function ColorSchemeToggle({ className }: ColorSchemeToggleProps): ReactElement {
  const { isDark, toggle } = useColorScheme();
  return (
    <button
      type="button"
      className={cx('rdz-scheme-toggle', className)}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  );
}
