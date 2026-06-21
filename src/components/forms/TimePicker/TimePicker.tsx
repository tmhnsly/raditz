'use client';
import { useEffect, useRef } from 'react';
import type { HTMLAttributes, ReactElement, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx, useControllableState, Overlay, useTrigger, parseTime, toISOTime, to12, to24, formatTime, KEYS } from '../../internal';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** 24-hour "HH:mm" (controlled). */
  value?: string;
  /** Initial "HH:mm" (uncontrolled). @default "" */
  defaultValue?: string;
  onChange?: (value: string) => void;
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
 * with `value`/`onChange` or uncontrolled with `defaultValue`. Built on the pure
 * `time` helpers (see time.test.ts); renders into an {@link Overlay}.
 */
export function TimePicker({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select time',
  hour12 = true,
  minuteStep = 5,
  disabled = false,
  className,
  ...rest
}: TimePickerProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange });
  const { open, toggle, close, anchorRef } = useTrigger<HTMLButtonElement>({});
  const t = parseTime(val);
  const h = t?.h ?? 0;
  const m = t?.m ?? 0;
  const { h12, period } = to12(h);

  const commit = (nh: number, nm: number): void => setVal(toISOTime(nh, nm));
  const hours = hour12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  const label = t ? formatTime(h, m, hour12) : '';

  // Keyboard: on open, focus a real option so the columns are immediately
  // drivable; arrows then rove within/between columns AND preventDefault, so they
  // move the selection instead of scrolling the page (the "freeze boundary").
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const opt = menu?.querySelector<HTMLButtonElement>('.rdz-timemenu__opt.is-selected')
      ?? menu?.querySelector<HTMLButtonElement>('.rdz-timemenu__opt');
    opt?.focus();
  }, [open]);

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    const opt = (e.target as HTMLElement).closest<HTMLButtonElement>('.rdz-timemenu__opt');
    const menu = menuRef.current;
    if (!opt || !menu) return;
    const col = opt.closest('.rdz-timemenu__col');
    if (!col) return;
    const opts = Array.from(col.querySelectorAll<HTMLButtonElement>('.rdz-timemenu__opt'));
    const i = opts.indexOf(opt);
    let next: HTMLButtonElement | null | undefined;
    if (e.key === KEYS.ArrowDown) next = opts[Math.min(i + 1, opts.length - 1)];
    else if (e.key === KEYS.ArrowUp) next = opts[Math.max(i - 1, 0)];
    else if (e.key === KEYS.Home) next = opts[0];
    else if (e.key === KEYS.End) next = opts[opts.length - 1];
    else if (e.key === KEYS.ArrowRight || e.key === KEYS.ArrowLeft) {
      const cols = Array.from(menu.querySelectorAll<HTMLElement>('.rdz-timemenu__col'));
      const ci = cols.indexOf(col as HTMLElement);
      const nc = cols[e.key === KEYS.ArrowRight ? Math.min(ci + 1, cols.length - 1) : Math.max(ci - 1, 0)];
      next = nc?.querySelector<HTMLButtonElement>('.rdz-timemenu__opt');
    } else return;
    e.preventDefault();
    next?.focus();
  };

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
