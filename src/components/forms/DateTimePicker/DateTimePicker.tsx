'use client';
import type { HTMLAttributes, ReactElement } from 'react';
import { cx, useControllableState } from '../../internal';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimePicker } from '../TimePicker/TimePicker';

export interface DateTimePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** Combined value `YYYY-MM-DDTHH:mm` (controlled). */
  value?: string;
  /** Initial combined value (uncontrolled). @default "" */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 12-hour time display. @default true */
  hour12?: boolean;
  disabled?: boolean;
}

// Combine into `date`, `dateTtime`, or `Ttime` (so a time chosen before a date
// isn't dropped), or '' when both are empty.
const combine = (d: string, t: string): string => (d && t ? `${d}T${t}` : d ? d : t ? `T${t}` : '');

/**
 * DateTimePicker — the drill-up {@link DatePicker} and the {@link TimePicker}
 * composed into one control. Emits a combined `YYYY-MM-DDTHH:mm` string (or just
 * the date until a time is chosen).
 */
export function DateTimePicker({
  value,
  defaultValue = '',
  onChange,
  hour12 = true,
  disabled = false,
  className,
  ...rest
}: DateTimePickerProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange });
  const datePart = val.includes('T') ? val.split('T')[0] : val;
  const timePart = val.includes('T') ? val.split('T')[1] ?? '' : '';
  return (
    <span className={cx('rdz-datetimepicker', className)} {...rest}>
      <DatePicker value={datePart} onChange={(d) => setVal(combine(d, timePart))} disabled={disabled} />
      <TimePicker value={timePart} onChange={(t) => setVal(combine(datePart, t))} hour12={hour12} disabled={disabled} />
    </span>
  );
}
