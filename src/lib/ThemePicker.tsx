import type { CSSProperties } from 'react';
import { cx } from '../components/internal';
import { useTheme, ACCENTS, GRAYS, resolveGray } from './theme';

/**
 * ThemePicker — pick an accent and a gray; the whole app re-themes live.
 * Accent swatches repoint the accent ramp; "Auto" uses Radix's recommended
 * paired gray, or pick a specific gray (incl. neutral "gray"). Persists.
 */
export function ThemePicker() {
  const { accent, gray, setAccent, setGray, reset } = useTheme();
  const paired = resolveGray(accent, 'auto');
  return (
    <div className="theme-picker">
      <div className="theme-picker__row">
        <strong className="theme-picker__title">Accent</strong>
        <button type="button" className="srx-btn srx-btn--ghost srx-btn--sm" onClick={reset}>Reset</button>
      </div>
      <div className="theme-picker__swatches">
        {ACCENTS.map((a) => (
          <button
            key={a}
            type="button"
            title={a}
            aria-label={a}
            aria-pressed={accent === a}
            className={cx('theme-picker__sw', accent === a && 'is-active')}
            style={{ '--sw': `var(--${a}-9)` } as CSSProperties}
            onClick={() => setAccent(a)}
          />
        ))}
      </div>
      <div className="theme-picker__row">
        <strong className="theme-picker__title">Gray</strong>
        <span className="theme-picker__hint">auto → {paired}</span>
      </div>
      <div className="theme-picker__swatches">
        <button
          type="button"
          className={cx('theme-picker__chip', gray === 'auto' && 'is-active')}
          aria-pressed={gray === 'auto'}
          onClick={() => setGray('auto')}
        >
          Auto
        </button>
        {GRAYS.map((g) => (
          <button
            key={g}
            type="button"
            title={g}
            aria-label={g}
            aria-pressed={gray === g}
            className={cx('theme-picker__sw', gray === g && 'is-active')}
            style={{ '--sw': `var(--${g}-9)` } as CSSProperties}
            onClick={() => setGray(g)}
          />
        ))}
      </div>
    </div>
  );
}
