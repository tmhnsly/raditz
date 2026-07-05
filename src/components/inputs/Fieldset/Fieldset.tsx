import * as React from 'react';
import { cx } from '../../internal';

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Group heading, rendered as the `<legend>`. */
  legend?: React.ReactNode;
  /** Supporting copy under the legend. */
  hint?: React.ReactNode;
  /** Disable the whole group. Native `<fieldset disabled>` cascades to every
   *  control inside — no per-control wiring. @default false */
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Fieldset — groups related form controls under a `<legend>`, the native,
 * accessible way to label a set of fields (address blocks, preference groups).
 * `disabled` uses the browser's built-in fieldset cascade, so every control
 * inside goes disabled without threading a prop through each one.
 */
export function Fieldset({ legend, hint, disabled = false, className, children, ...rest }: FieldsetProps): React.ReactElement {
  return (
    <fieldset className={cx('rdz-fieldset', className)} disabled={disabled} {...rest}>
      {/* `<legend>` stays a direct child of `<fieldset>` so it names the group. */}
      {legend ? <legend className="rdz-fieldset__legend">{legend}</legend> : null}
      {hint ? <p className="rdz-fieldset__hint">{hint}</p> : null}
      <div className="rdz-fieldset__body">{children}</div>
    </fieldset>
  );
}
