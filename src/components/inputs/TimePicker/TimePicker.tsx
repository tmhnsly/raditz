'use client';
import type { HTMLAttributes, ReactElement } from 'react';
import { cx, useControllableState, Overlay, useTrigger, useGridFocus, parseTime, toISOTime, to12, to24, formatTime } from '../../internal';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** 24-hour "HH:mm" (controlled). */
  value?: string;
  /** Initial "HH:mm" (uncontrolled). @default "" */
  defaultValue?: string;
  /** Fires with the new 24-hour "HH:mm" string. */
  onValueChange?: (value: string) => void;
  /** Trigger text when no time is chosen. @default "Select time" */
  placeholder?: string;
  /** 12-hour display with AM/PM. @default true */
  hour12?: boolean;
  /** Minute increment in the list. @default 5 */
  minuteStep?: number;
  disabled?: boolean;
}

/**
 * TimePicker — a trigger that opens hour / minute (/ AM-PM) columns. The value is
 * a canonical 24-hour `HH:mm` string; the display follows `hour12`. Controlled
 * with `value`/`onValueChange` or uncontrolled with `defaultValue`. Built on the pure
 * `time` helpers (see time.test.ts); renders into an {@link Overlay}.
 */
export function TimePicker({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select time',
  hour12 = true,
  minuteStep = 5,
  disabled = false,
  className,
  ...rest
}: TimePickerProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const { open, toggle, close, anchorRef } = useTrigger<HTMLButtonElement>({});
  const t = parseTime(val);
  const h = t?.h ?? 0;
  const m = t?.m ?? 0;
  const { h12, period } = to12(h);

  const commit = (nh: number, nm: number): void => setVal(toISOTime(nh, nm));
  const hours = hour12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  const label = t ? formatTime(h, m, hour12) : '';

  // Keyboard "freeze boundary": focus a real option on open so the columns are
  // immediately drivable, then rove DOM focus within/between columns (see
  // useGridFocus's `columns` strategy).
  const { ref: menuRef, onKeyDown: onMenuKey } = useGridFocus<HTMLDivElement>({
    open,
    initialFocus: ['.rdz-timemenu__opt.is-selected', '.rdz-timemenu__opt'],
    strategy: { kind: 'columns', columnSelector: '.rdz-timemenu__col', itemSelector: '.rdz-timemenu__opt' },
  });

  return (
    <span className={cx('rdz-timepicker', className)} {...rest}>
      <button
        type="button"
        ref={anchorRef}
        className={cx('rdz-input', 'rdz-timepicker__trigger', !label && 'is-placeholder')}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
      >
        <svg className="rdz-timepicker__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
        <span>{label || placeholder}</span>
      </button>
      <Overlay
        open={open}
        onDismiss={close}
        position={{ kind: 'anchored', anchor: anchorRef, side: 'bottom', align: 'start' }}
        ignore={anchorRef}
        focus="none"
        className="rdz-timemenu"
        role="dialog"
        aria-label="Choose time"
      >
        <div className="rdz-timemenu__cols" ref={menuRef} onKeyDown={onMenuKey}>
          <div className="rdz-timemenu__col" role="group" aria-label="Hour">
            {hours.map((hh) => {
              const active = !!t && (hour12 ? hh === h12 : hh === h);
              return (
                <button key={hh} type="button" aria-pressed={active} className={cx('rdz-timemenu__opt', active && 'is-selected')} onClick={() => commit(hour12 ? to24(hh, period) : hh, m)}>
                  {hour12 ? hh : String(hh).padStart(2, '0')}
                </button>
              );
            })}
          </div>
          <div className="rdz-timemenu__col" role="group" aria-label="Minute">
            {minutes.map((mm) => (
              <button key={mm} type="button" aria-pressed={!!t && mm === m} className={cx('rdz-timemenu__opt', !!t && mm === m && 'is-selected')} onClick={() => commit(h, mm)}>
                {String(mm).padStart(2, '0')}
              </button>
            ))}
          </div>
          {hour12 ? (
            <div className="rdz-timemenu__col" role="group" aria-label="AM or PM">
              {(['AM', 'PM'] as const).map((p) => (
                <button key={p} type="button" aria-pressed={!!t && p === period} className={cx('rdz-timemenu__opt', !!t && p === period && 'is-selected')} onClick={() => commit(to24(h12, p), m)}>
                  {p}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </Overlay>
    </span>
  );
}
