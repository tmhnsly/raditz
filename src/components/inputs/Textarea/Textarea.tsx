import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cx } from '../../internal';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Show the danger ring + aria-invalid. @default false */
  invalid?: boolean;
  /** Visible text rows. @default 4 */
  rows?: number;
}

/**
 * A multi-line text input. Vertically resizable; shares the Input styling.
 * Forwards its ref to the native <textarea>.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, rows = 4, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx('rdz-input', 'rdz-textarea', invalid && 'rdz-input--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
