'use client';
import type { HTMLAttributes, ReactElement } from 'react';
import { format } from 'date-fns';
import { cx, useControllableState, Overlay, useTrigger, parseISO } from '../../internal';
import { Calendar } from '../Calendar';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** ISO YYYY-MM-DD (controlled). */
  value?: string;
  /** Initial ISO date (uncontrolled). @default "" */
  defaultValue?: string;
  /** Fires with the new ISO date string. */
  onValueChange?: (value: string) => void;
  /** Trigger text when no date is chosen. @default "Select date" */
  placeholder?: string;
  /** Earliest selectable ISO date. */
  min?: string;
  /** Latest selectable ISO date. */
  max?: string;
  disabled?: boolean;
}

/**
 * DatePicker — a text trigger that opens a {@link Calendar} popover with drill-up
 * navigation: the title steps day → month → year, and the arrows page the view.
 * Value is an ISO `YYYY-MM-DD` string (controlled `value`/`onValueChange` or
 * `defaultValue`); `min`/`max` bound the range. Renders into an {@link Overlay};
 * the calendar surface itself is the standalone `Calendar` component.
 */
export function DatePicker({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select date',
  min,
  max,
  disabled = false,
  className,
  ...rest
}: DatePickerProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const { open, toggle, close, anchorRef } = useTrigger<HTMLButtonElement>({});
  const selected = parseISO(val);
  const label = selected ? format(selected, 'MMM d, yyyy') : '';

  return (
    <span className={cx('rdz-datepicker', className)} {...rest}>
      <button
        type="button"
        ref={anchorRef}
        className={cx('rdz-input', 'rdz-datepicker__trigger', !label && 'is-placeholder')}
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
        aria-label="Choose date"
      >
        <Calendar
          autoFocus
          value={val}
          min={min}
          max={max}
          onValueChange={(iso) => { setVal(iso); close(); }}
        />
      </Overlay>
    </span>
  );
}
