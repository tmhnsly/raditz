'use client';
import { useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactElement } from 'react';
import { cx, useControllableState } from '../../internal';

export interface PasswordToggleFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'type'> {
  /** Controlled value. */
  value?: string;
  /** Initial value (uncontrolled). @default "" */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Start with the password revealed. @default false */
  defaultVisible?: boolean;
  /** Render the invalid (danger) state. @default false */
  invalid?: boolean;
}

const EYE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EYE_OFF = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.16 2.94M6.06 6.06A13.2 13.2 0 0 0 2 11s3.5 7 10 7a9.1 9.1 0 0 0 3.94-.94" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /><line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

/**
 * PasswordToggleField — a password input with a show/hide button (Radix
 * Password Toggle field). Controlled with `value`, uncontrolled with
 * `defaultValue`. `defaultVisible` starts revealed.
 */
export function PasswordToggleField({
  value,
  defaultValue = '',
  onChange,
  placeholder,
  disabled = false,
  defaultVisible = false,
  invalid = false,
  className,
  ...rest
}: PasswordToggleFieldProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange });
  const [visible, setVisible] = useState(defaultVisible);
  return (
    <div className={cx('rdz-password', className)}>
      <input
        className={cx('rdz-input', 'rdz-password__input', invalid && 'rdz-input--invalid')}
        type={visible ? 'text' : 'password'}
        value={val}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid ? 'true' : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
        {...rest}
      />
      <button
        type="button"
        className="rdz-password__toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        disabled={disabled}
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? EYE_OFF : EYE}
      </button>
    </div>
  );
}
