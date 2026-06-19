import { useState } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import { cx, useControllableState, Overlay, useTrigger, parseISO, toISO, sameDay, outOfRange, monthGrid } from '../../internal';

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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * DatePicker — a text trigger that opens a calendar popover (Radix-style).
 * Value is an ISO `YYYY-MM-DD` string; controlled with `value` / `onChange` or
 * uncontrolled with `defaultValue`. `min` / `max` (ISO strings) bound the range.
 *
 * Renders its calendar directly into an {@link Overlay} (`anchored` topology).
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

  const minD = parseISO(min); const maxD = parseISO(max);
  const y = view.getFullYear(); const m = view.getMonth();
  const cells = monthGrid(y, m);

  const pick = (d: Date): void => { if (outOfRange(d, minD, maxD)) return; setVal(toISO(d)); close(); };
  const shiftMonth = (delta: number): void => setView(new Date(y, m + delta, 1));

  const label = selected ? selected.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <span className={cx('srx-datepicker', className)} {...rest}>
      <button
        type="button"
        ref={anchorRef}
        className={cx('srx-input', 'srx-datepicker__trigger', !label && 'is-placeholder')}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => { if (selected) setView(selected); toggle(); }}
      >
        <svg className="srx-datepicker__cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
        <span>{label || placeholder}</span>
      </button>
      <Overlay
        open={open}
        onDismiss={close}
        position={{ kind: 'anchored', anchor: anchorRef, side: 'bottom', align: 'start' }}
        ignore={anchorRef}
        focus="none"
        className="srx-calendar"
        role="dialog"
        aria-label="Choose date"
      >
        <div className="srx-calendar__head">
          <button type="button" className="srx-calendar__nav" aria-label="Previous month" onClick={() => shiftMonth(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></button>
          <span className="srx-calendar__title">{MONTHS[m]} {y}</span>
          <button type="button" className="srx-calendar__nav" aria-label="Next month" onClick={() => shiftMonth(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
        <div className="srx-calendar__dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="srx-calendar__grid">
          {cells.map((d, i) => d ? (
            <button
              key={i}
              type="button"
              className={cx('srx-calendar__day', sameDay(d, selected) && 'is-selected', sameDay(d, new Date()) && 'is-today')}
              disabled={outOfRange(d, minD, maxD)}
              aria-current={sameDay(d, new Date()) ? 'date' : undefined}
              onClick={() => pick(d)}
            >{d.getDate()}</button>
          ) : <span key={i} />)}
        </div>
      </Overlay>
    </span>
  );
}
