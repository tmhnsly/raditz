import type { InputHTMLAttributes, ReactElement } from 'react';
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
 * attribute (type, placeholder, value, onChange…).
 */
export function Input({ invalid = false, className, ...rest }: InputProps): ReactElement {
  return (
    <input
      className={cx('rdz-input', invalid && 'rdz-input--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
