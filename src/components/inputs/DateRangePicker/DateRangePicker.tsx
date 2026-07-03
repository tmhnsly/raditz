'use client';
import type { HTMLAttributes, ReactElement } from 'react';
import { format } from 'date-fns';
import { cx, useControllableState, Overlay, useTrigger, parseISO } from '../../internal';
import { Calendar, type DateRange } from '../Calendar';

export interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** Selected span as ISO endpoints (controlled). */
  value?: DateRange;
  /** Initial span (uncontrolled). */
  defaultValue?: DateRange;
  /** Fires as the span is built (first pick sets `from`, second `to`). */
  onValueChange?: (value: DateRange) => void;
  /** Trigger text when no span is chosen. @default "Select dates" */
  placeholder?: string;
  /** Earliest selectable ISO date. */
  min?: string;
  /** Latest selectable ISO date. */
  max?: string;
  disabled?: boolean;
}

/** "Jul 6 – Jul 12, 2026", or a half-open "Jul 6, 2026 – …", or '' when empty. */
function rangeLabel(range: DateRange): string {
  const from = parseISO(range.from);
  const to = parseISO(range.to);
  if (from && to) {
    const sameYear = from.getFullYear() === to.getFullYear();
    return `${format(from, sameYear ? 'MMM d' : 'MMM d, yyyy')} – ${format(to, 'MMM d, yyyy')}`;
  }
  if (from) return `${format(from, 'MMM d, yyyy')} – …`;
  return '';
}

/**
 * DateRangePicker — a text trigger that opens a {@link Calendar} in range mode:
 * the first day click sets the start, the second the end (hovering previews the
 * span, and a second click before the first swaps them). Value is a
 * `{ from, to }` pair of ISO `YYYY-MM-DD` strings (controlled `value` /
 * `onValueChange` or `defaultValue`); the popover closes once both ends are set.
 */
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select dates',
  min,
  max,
  disabled = false,
  className,
  ...rest
}: DateRangePickerProps): ReactElement {
  const [val, setVal] = useControllableState<DateRange>({ value, defaultValue: defaultValue ?? {}, onChange: onValueChange });
  const { open, toggle, close, anchorRef } = useTrigger<HTMLButtonElement>({});
  const label = rangeLabel(val);

  return (
    <span className={cx('rdz-daterange', className)} {...rest}>
      <button
        type="button"
        ref={anchorRef}
        className={cx('rdz-input', 'rdz-datepicker__trigger', 'rdz-daterange__trigger', !label && 'is-placeholder')}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
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
        role="dialog"
        aria-label="Choose date range"
      >
        <Calendar
          autoFocus
          range={val}
          min={min}
          max={max}
          onRangeChange={(next) => { setVal(next); if (next.from && next.to) close(); }}
        />
      </Overlay>
    </span>
  );
}
