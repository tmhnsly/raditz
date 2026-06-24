import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Options array; alternatively pass <option> children. */
  options?: SelectOption[];
  invalid?: boolean;
  children?: ReactNode;
}

/**
 * A styled native <select> with a custom chevron. Pass <option> children, or an
 * `options` array of { value, label }. Forwards its ref to the inner <select> so
 * forms can read its validity.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, invalid = false, className, children, ...rest },
  ref,
) {
  return (
    <span className={cx('rdz-select', className)}>
      <select ref={ref} aria-invalid={invalid || undefined} {...rest}>
        {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
      </select>
      <span className="rdz-select__chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </span>
  );
});
