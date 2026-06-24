'use client';
import type { CSSProperties } from 'react';
import { cx } from '../components/internal';
import { useTheme, ACCENTS, GRAYS, RADII, MOTIONS, REVEALS, resolveGray } from './theme';

/**
 * ThemePicker — pick an accent, gray, corner radius, motion feel, and animation
 * style; the whole app re-themes live. Accent swatches repoint the accent ramp;
 * "Auto" uses Radix's recommended paired gray; radius scales --radius-factor;
 * motion maps to the data-motion presets; the Animation choice sets the scroll
 * reveal and its matching heading entrance together (they stay in step). Persists.
 */
export function ThemePicker() {
  const { accent, gray, radius, motion, reveal, setAccent, setGray, setRadius, setMotion, setReveal, reset } = useTheme();
  const paired = resolveGray(accent, 'auto');
  return (
    <div className="theme-picker">
      <div className="theme-picker__row">
        <strong className="theme-picker__title">Accent</strong>
        <button type="button" className="rdz-btn rdz-btn--ghost rdz-btn--sm" onClick={reset}>Reset</button>
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

      <div className="theme-picker__row">
        <strong className="theme-picker__title">Radius</strong>
      </div>
      <div className="theme-picker__swatches">
        {RADII.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={radius === r}
            className={cx('theme-picker__chip', radius === r && 'is-active')}
            onClick={() => setRadius(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="theme-picker__row">
        <strong className="theme-picker__title">Motion</strong>
      </div>
      <div className="theme-picker__swatches">
        {MOTIONS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={motion === m}
            className={cx('theme-picker__chip', motion === m && 'is-active')}
            onClick={() => setMotion(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="theme-picker__row">
        <strong className="theme-picker__title">Animation</strong>
        <span className="theme-picker__hint">reveal + title, in step</span>
      </div>
      <div className="theme-picker__swatches">
        {REVEALS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={reveal === r}
            className={cx('theme-picker__chip', reveal === r && 'is-active')}
            onClick={() => setReveal(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
