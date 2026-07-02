'use client';
import * as React from 'react';
import { useControllableState, cx } from '../../internal';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Initial pressed state (uncontrolled). @default false */
  defaultPressed?: boolean;
  /** Fires when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual treatment. @default "soft" */
  variant?: 'soft' | 'outline';
  /** Control size. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Toggle — a two-state on/off button (Radix Toggle). Controlled with `pressed`
 * or uncontrolled with `defaultPressed`; `onPressedChange` fires on change.
 */
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  size = 'md',
  variant = 'soft',
  className,
  children,
  ...rest
}: ToggleProps): React.ReactElement {
  const [on, setOn] = useControllableState<boolean>({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  const cls = cx('rdz-toggle', className);
  return (
    <button
      type="button"
      className={cls}
      data-variant={variant}
      data-size={size}
      aria-pressed={!!on}
      data-state={on ? 'on' : 'off'}
      disabled={disabled}
      onClick={() => setOn(!on)}
      {...rest}
    >
      {children}
    </button>
  );
}
