import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '../../internal';

/**
 * @startingPoint section="Forms" subtitle="Inputs, select & labelled fields" viewport="700x340"
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Show the danger ring + aria-invalid. @default false */
  invalid?: boolean;
}

/**
 * A text input. `invalid` switches to the danger ring. Spread any native input
 * attribute (type, placeholder, value, onChange…). Forwards its ref to the
 * native <input> so form libraries can register it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cx('rdz-input', invalid && 'rdz-input--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
