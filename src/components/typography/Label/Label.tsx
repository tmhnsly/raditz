import type { LabelHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Id of the control this labels. */
  htmlFor?: string;
  /** Append a required asterisk. @default false */
  required?: boolean;
  /** Dim the label to indicate its control is disabled. @default false */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Label — a form label (Radix Label). Associate it with a control via `htmlFor`;
 * `required` appends a danger-colored asterisk.
 */
export function Label({ htmlFor, required = false, disabled = false, className, children, ...rest }: LabelProps): ReactElement {
  return (
    <label htmlFor={htmlFor} className={cx('rdz-label', disabled && 'rdz-label--disabled', className)} {...rest}>
      {children}
      {required ? (
        <span className="rdz-label__req" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
