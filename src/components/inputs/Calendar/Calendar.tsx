'use client';
import { useState } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import { addMonths, addYears, format, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { cx, useControllableState, useGridFocus, parseISO, toISO, sameDay, outOfRange, monthGrid } from '../../internal';

/** An inclusive date span as ISO `YYYY-MM-DD` endpoints. */
export interface DateRange {
  from?: string;
  to?: string;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selected ISO date (controlled, single mode). */
  value?: string;
  /** Initial ISO date (uncontrolled, single mode). @default "" */
  defaultValue?: string;
  /** Fires with the new ISO date. */
  onValueChange?: (value: string) => void;
  /** Selected span (controlled, range mode). Presence of any range prop switches
   *  the calendar into range selection. */
  range?: DateRange;
  /** Initial span (uncontrolled, range mode). */
  defaultRange?: DateRange;
  /** Fires with the new span as it's built (first click sets `from`, second `to`). */
  onRangeChange?: (range: DateRange) => void;
  /** Earliest selectable ISO date. */
  min?: string;
  /** Latest selectable ISO date. */
  max?: string;
  /** Focus a day when the day grid mounts / re-enters (popover use). @default false */
  autoFocus?: boolean;
}

const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
  </svg>
);

type Mode = 'day' | 'month' | 'year';

/** Sorted [lo, hi] of two dates (either may be null). */
function span(a: Date | null, b: Date | null): [Date | null, Date | null] {
  if (!a || !b) return [a ?? b, null];
  return a <= b ? [a, b] : [b, a];
}

/**
 * Calendar — the inline month surface behind DatePicker / DateRangePicker, also
 * usable on its own. Drill-up title (day → month → year), arrow-paged views, and
 * grid-roving keyboard focus. Single mode uses `value` / `onValueChange` (ISO
 * `YYYY-MM-DD`); passing any `range` prop switches to range selection
 * (`onRangeChange` fires as `from` then `to` are picked, swapping if the second
 * click precedes the first). `min` / `max` bound both. Built on date-fns.
 */
export function Calendar({
  value,
  defaultValue = '',
  onValueChange,
  range,
  defaultRange,
  onRangeChange,
  min,
  max,
  autoFocus = false,
  className,
  ...rest
}: CalendarProps): ReactElement {
  const rangeMode = range !== undefined || defaultRange !== undefined || onRangeChange !== undefined;

  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const [rng, setRng] = useControllableState<DateRange>({ value: range, defaultValue: defaultRange ?? {}, onChange: onRangeChange });
  const [hover, setHover] = useState<Date | null>(null);

  const selected = parseISO(val);
  const from = rangeMode ? parseISO(rng.from) : null;
  const to = rangeMode ? parseISO(rng.to) : null;
  // A half-built range previews to the hovered day until the second click lands.
  const previewTo = rangeMode && from && !to ? hover : to;
  const [lo, hi] = span(from, previewTo);

  const anchor = rangeMode ? from : selected;
  const [view, setView] = useState<Date>(() => anchor || new Date());
  const [mode, setMode] = useState<Mode>('day');

  const minD = parseISO(min);
  const maxD = parseISO(max);
  const today = new Date();
  const y = getYear(view);
  const m = getMonth(view);
  const decadeStart = Math.floor(y / 10) * 10;

  const pickDay = (d: Date): void => {
    if (outOfRange(d, minD, maxD)) return;
    if (!rangeMode) { setVal(toISO(d)); return; }
    // First click (or restart after a complete span) sets `from` and clears `to`;
    // the second click sets `to`, swapping if it precedes `from`.
    if (!from || (from && to)) {
      setRng({ from: toISO(d), to: undefined });
    } else if (d < from) {
      setRng({ from: toISO(d), to: rng.from });
    } else {
      setRng({ from: rng.from, to: toISO(d) });
    }
  };

  const drillUp = (): void => setMode((mo) => (mo === 'day' ? 'month' : 'year'));
  const step = (delta: number): void =>
    setView(mode === 'day' ? addMonths(view, delta) : mode === 'month' ? addYears(view, delta) : addYears(view, delta * 10));

  const title = mode === 'day' ? format(view, 'MMMM yyyy') : mode === 'month' ? format(view, 'yyyy') : `${decadeStart} – ${decadeStart + 9}`;

  const { ref: gridRef, onKeyDown: onGridKey } = useGridFocus<HTMLDivElement>({
    open: autoFocus && mode === 'day',
    initialFocus: [
      '.rdz-calendar__day.is-selected',
      '.rdz-calendar__day.is-range-start',
      '.rdz-calendar__day[aria-current="date"]',
      '.rdz-calendar__day:not(:disabled)',
    ],
    strategy: { kind: 'grid', itemSelector: 'button:not(:disabled)' },
  });

  const dayClass = (d: Date): string => {
    if (rangeMode) {
      const isStart = !!lo && sameDay(d, lo);
      const isEnd = !!hi && sameDay(d, hi) && !(lo && hi && sameDay(lo, hi));
      const isMid = !!lo && !!hi && d > lo && d < hi;
      return cx(
        'rdz-calendar__day',
        sameDay(d, today) && 'is-today',
        isStart && 'is-range-start',
        isEnd && 'is-range-end',
        (isStart || isEnd) && 'is-selected',
        isMid && 'is-in-range',
      );
    }
    return cx('rdz-calendar__day', sameDay(d, selected) && 'is-selected', sameDay(d, today) && 'is-today');
  };

  const cellSelectedMonth = (i: number): boolean =>
    !!anchor && getYear(anchor) === y && getMonth(anchor) === i;
  const cellSelectedYear = (yr: number): boolean => !!anchor && getYear(anchor) === yr;

  return (
    <div className={cx('rdz-calendar', className)} {...rest}>
      <div className="rdz-calendar__head">
        <button type="button" className="rdz-calendar__nav" aria-label="Previous" onClick={() => step(-1)}><Chevron dir="prev" /></button>
        <button type="button" className="rdz-calendar__title" onClick={drillUp} disabled={mode === 'year'} aria-label={`Current view ${title} — change`}>{title}</button>
        <button type="button" className="rdz-calendar__nav" aria-label="Next" onClick={() => step(1)}><Chevron dir="next" /></button>
      </div>

      {mode === 'day' ? (
        <>
          <div className="rdz-calendar__dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="rdz-calendar__grid" ref={gridRef} onKeyDown={onGridKey} onMouseLeave={() => rangeMode && setHover(null)}>
            {monthGrid(y, m).map((d, i) => d ? (
              <button
                key={i}
                type="button"
                className={dayClass(d)}
                disabled={outOfRange(d, minD, maxD)}
                aria-current={sameDay(d, today) ? 'date' : undefined}
                onClick={() => pickDay(d)}
                onMouseEnter={rangeMode ? () => setHover(d) : undefined}
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
              className={cx('rdz-calendar__cell', cellSelectedMonth(i) && 'is-selected')}
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
              className={cx('rdz-calendar__cell', cellSelectedYear(yr) && 'is-selected', (yr < decadeStart || yr > decadeStart + 9) && 'is-muted')}
              onClick={() => { setView(setYear(view, yr)); setMode('month'); }}
            >{yr}</button>
          ))}
        </div>
      )}
    </div>
  );
}
