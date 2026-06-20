import type { TextareaHTMLAttributes, ReactElement } from 'react';
import { cx } from '../../internal';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  rows?: number;
}

/**
 * A multi-line text input. Vertically resizable; shares the Input styling.
 */
export function Textarea({ invalid = false, rows = 4, className, ...rest }: TextareaProps): ReactElement {
  return (
    <textarea
      rows={rows}
      className={cx('rdz-input', 'rdz-textarea', invalid && 'rdz-input--invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
