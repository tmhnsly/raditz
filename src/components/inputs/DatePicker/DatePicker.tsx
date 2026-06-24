'use client';
import { useState, useEffect, useRef } from 'react';
import type { HTMLAttributes, ReactElement, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { addMonths, addYears, format, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { cx, useControllableState, Overlay, useTrigger, parseISO, toISO, sameDay, outOfRange, monthGrid, KEYS } from '../../internal';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** ISO YYYY-MM-DD (controlled). */
  value?: string;
  /** Initial ISO date (uncontrolled). @default "" */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Earliest selectable ISO date. */
  min?: string;
  /** Latest selectable ISO date. */
  max?: string;
  disabled?: boolean;
}

const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
  </svg>
);

type Mode = 'day' | 'month' | 'year';

/**
 * DatePicker — a text trigger that opens a calendar popover with drill-up
 * navigation: the title steps day → month → year (click "June 2026" to pick a
 * month, "2026" to pick a year), and the arrows page the current view. Value is
 * an ISO `YYYY-MM-DD` string (controlled `value`/`onChange` or `defaultValue`);
 * `min`/`max` bound the range. Built on date-fns; renders into an {@link Overlay}.
 */
export function DatePicker({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select date',
  min,
  max,
  disabled = false,
  className,
  ...rest
}: DatePickerProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange });
  const { open, toggle, close, anchorRef } = useTrigger<HTMLButtonElement>({});
  const selected = parseISO(val);
  const [view, setView] = useState<Date>(() => selected || new Date());
  const [mode, setMode] = useState<Mode>('day');

  const minD = parseISO(min);
  const maxD = parseISO(max);
  const y = getYear(view);
  const m = getMonth(view);
  const decadeStart = Math.floor(y / 10) * 10;

  const pick = (d: Date): void => { if (outOfRange(d, minD, maxD)) return; setVal(toISO(d)); close(); };
  const openCal = (): void => { if (selected) setView(selected); setMode('day'); toggle(); };
  const drillUp = (): void => setMode((mo) => (mo === 'day' ? 'month' : 'year'));
  const step = (delta: number): void => setView(mode === 'day' ? addMonths(view, delta) : mode === 'month' ? addYears(view, delta) : addYears(view, delta * 10));

  const title = mode === 'day' ? format(view, 'MMMM yyyy') : mode === 'month' ? format(view, 'yyyy') : `${decadeStart} – ${decadeStart + 9}`;
  const label = selected ? format(selected, 'MMM d, yyyy') : '';

  // Keyboard: focus a day on open, then rove the grid with arrows AND
  // preventDefault, so they move the selection instead of scrolling the page (the
  // "freeze boundary"). One generic handler covers the day grid and the
  // month/year cells — it reads the real column count off the grid so Up/Down
  // jump a whole row.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || mode !== 'day') return;
    const grid = gridRef.current;
    const focusBtn = grid?.querySelector<HTMLButtonElement>('.rdz-calendar__day.is-selected')
      ?? grid?.querySelector<HTMLButtonElement>('.rdz-calendar__day[aria-current="date"]')
      ?? grid?.querySelector<HTMLButtonElement>('.rdz-calendar__day:not(:disabled)');
    focusBtn?.focus();
  }, [open, mode]);

  const onGridKey = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    const grid = e.currentTarget;
    const btns = Array.from(grid.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    const i = btns.indexOf(e.target as HTMLButtonElement);
    if (i === -1) return;
    const tracks = getComputedStyle(grid).gridTemplateColumns;
    const cols = Math.max(1, tracks ? tracks.split(' ').filter(Boolean).length : 1);
    let n: number;
    if (e.key === KEYS.ArrowRight) n = Math.min(i + 1, btns.length - 1);
    else if (e.key === KEYS.ArrowLeft) n = Math.max(i - 1, 0);
    else if (e.key === KEYS.ArrowDown) n = Math.min(i + cols, btns.length - 1);
    else if (e.key === KEYS.ArrowUp) n = Math.max(i - cols, 0);
    else if (e.key === KEYS.Home) n = 0;
    else if (e.key === KEYS.End) n = btns.length - 1;
    else return;
    e.preventDefault();
    btns[n]?.focus();
  };

  return (
    <span className={cx('rdz-datepicker', className)} {...rest}>
      <button
        type="button"
        ref={anchorRef}
        className={cx('rdz-input', 'rdz-datepicker__trigger', !label && 'is-placeholder')}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openCal}
      >
        <svg className="rdz-datepicker__cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
        <span>{label || placeholder}</span>
      </button>
      <Overlay
        open={open}
        onDismiss={close}
        position={{ kind: 'anchored', anchor: anchorRef, side: 'bottom', align: 'start' }}
        ignore={anchorRef}
        focus="none"
        className="rdz-calendar"
        role="dialog"
        aria-label="Choose date"
      >
        <div className="rdz-calendar__head">
          <button type="button" className="rdz-calendar__nav" aria-label="Previous" onClick={() => step(-1)}><Chevron dir="prev" /></button>
          <button type="button" className="rdz-calendar__title" onClick={drillUp} disabled={mode === 'year'} aria-label={`Current view ${title} — change`}>{title}</button>
          <button type="button" className="rdz-calendar__nav" aria-label="Next" onClick={() => step(1)}><Chevron dir="next" /></button>
        </div>

        {mode === 'day' ? (
          <>
            <div className="rdz-calendar__dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
            <div className="rdz-calendar__grid" ref={gridRef} onKeyDown={onGridKey}>
              {monthGrid(y, m).map((d, i) => d ? (
                <button
                  key={i}
                  type="button"
                  className={cx('rdz-calendar__day', sameDay(d, selected) && 'is-selected', sameDay(d, new Date()) && 'is-today')}
                  disabled={outOfRange(d, minD, maxD)}
                  aria-current={sameDay(d, new Date()) ? 'date' : undefined}
                  onClick={() => pick(d)}
                >{d.getDate()}</button>
              ) : <span key={i} />)}
            </div>
          </>
        ) : mode === 'month' ? (
          <div className="rdz-calendar__cells" onKeyDown={onGridKey}>
            {MONTHS_SHORT.map((mn, i) => (
              <button
                key={mn}
                type="button"
                className={cx('rdz-calendar__cell', selected && getYear(selected) === y && getMonth(selected) === i && 'is-selected')}
                onClick={() => { setView(setMonth(view, i)); setMode('day'); }}
              >{mn}</button>
            ))}
          </div>
        ) : (
          <div className="rdz-calendar__cells" onKeyDown={onGridKey}>
            {Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i).map((yr) => (
              <button
                key={yr}
                type="button"
                className={cx('rdz-calendar__cell', selected && getYear(selected) === yr && 'is-selected', (yr < decadeStart || yr > decadeStart + 9) && 'is-muted')}
                onClick={() => { setView(setYear(view, yr)); setMode('month'); }}
              >{yr}</button>
            ))}
          </div>
        )}
      </Overlay>
    </span>
  );
}
