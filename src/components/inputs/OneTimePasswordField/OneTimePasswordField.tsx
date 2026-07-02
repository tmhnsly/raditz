'use client';
import { useRef } from 'react';
import type { ChangeEvent, ClipboardEvent, FocusEvent, HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { cx, useControllableState, onKeys, KEYS } from '../../internal';
import { otpDigits, withOtpChar, sanitizeOtpPaste } from './otp';

export interface OneTimePasswordFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Number of boxes. @default 6 */
  length?: number;
  /** Controlled value (the concatenated code). */
  value?: string;
  /** Initial value (uncontrolled). @default "" */
  defaultValue?: string;
  /** Fires with the concatenated code on every edit. */
  onValueChange?: (value: string) => void;
  /** Fires when every box is filled. */
  onComplete?: (value: string) => void;
  /** 'text' (visible) or 'password' (masked). @default "text" */
  type?: 'text' | 'password';
  disabled?: boolean;
}

/**
 * OneTimePasswordField — a segmented one-time-code input (Radix OTP field).
 * `length` boxes (default 6); auto-advances on entry, backspaces to the
 * previous box, supports paste and arrow keys. Controlled with `value`,
 * uncontrolled with `defaultValue`. `onComplete` fires when all boxes fill.
 */
export function OneTimePasswordField({
  length = 6,
  value,
  defaultValue = '',
  onValueChange,
  onComplete,
  type = 'text',
  disabled = false,
  className,
  ...rest
}: OneTimePasswordFieldProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = otpDigits(val, length);

  const focusBox = (i: number): void => { const el = refs.current[i]; if (el) { el.focus(); el.select(); } };
  const commit = (code: string): string => {
    setVal(code);
    if (code.length === length && onComplete) onComplete(code);
    return code;
  };
  const setChar = (i: number, ch: string): void => {
    commit(withOtpChar(val, i, ch, length));
    if (ch && i < length - 1) focusBox(i + 1);
  };
  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>): void => {
    onKeys<KeyboardEvent<HTMLInputElement>>({
      [KEYS.Backspace]: () => {
        if (chars[i]) setChar(i, '');
        else if (i > 0) { focusBox(i - 1); setChar(i - 1, ''); }
      },
      ...(i > 0 ? { [KEYS.ArrowLeft]: () => focusBox(i - 1) } : {}),
      ...(i < length - 1 ? { [KEYS.ArrowRight]: () => focusBox(i + 1) } : {}),
    })(e);
  };
  const onPaste = (e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const clean = commit(sanitizeOtpPaste(e.clipboardData.getData('text') || '', length));
    focusBox(Math.min(clean.length, length - 1));
  };

  return (
    <div className={cx('rdz-otp', className)} onPaste={onPaste} role="group" {...rest}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="rdz-otp__box"
          type={type === 'password' ? 'password' : 'text'}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={c}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setChar(i, e.target.value.slice(-1))}
          onKeyDown={(e) => onKeyDown(i, e)}
          onFocus={(e: FocusEvent<HTMLInputElement>) => e.target.select()}
        />
      ))}
    </div>
  );
}
