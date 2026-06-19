import { cloneElement, createContext, isValidElement, useContext } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx, useStableId } from '../../internal';

export interface FieldContextValue {
  /** Id assigned to the control (and the label's `for`). */
  id: string;
  /** Id of the hint/error message, for `aria-describedby`. */
  describedBy?: string;
  /** Whether the field is in an error state. */
  invalid: boolean;
  /** Whether the field is required. */
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Read the wiring published by the enclosing {@link Field} — for controls that
 * aren't Field's direct child (nested/custom layouts) and so miss cloneElement. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Label text. */
  label?: ReactNode;
  /** Helper text below the control. */
  hint?: ReactNode;
  /** Error message (replaces hint, applies danger styling + aria-invalid). */
  error?: ReactNode;
  /** Show a required asterisk and mark the control required. @default false */
  required?: boolean;
  /** Override the generated control id (else one is generated and linked). */
  htmlFor?: string;
  children?: ReactNode;
}

interface InjectableProps {
  id?: string;
  required?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * A labelled form row that OWNS the field wiring: it generates an id and links
 * the label, the control, and the hint/error message (`for` / `id` /
 * `aria-describedby`), and sets `aria-invalid` + `required` on the control. The
 * wiring is injected into the direct control child via cloneElement (existing
 * controls need no changes) and also published through {@link useField} for
 * nested/custom controls.
 *
 * Deleting Field now genuinely loses the wiring — it is a deep module, not a
 * structural wrapper.
 */
export function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  className,
  children,
  ...rest
}: FieldProps): ReactElement {
  const autoId = useStableId('srx-field');
  const id = htmlFor ?? autoId;
  const msgId = `${id}-msg`;
  const invalid = !!error;
  const describedBy = error || hint ? msgId : undefined;

  let control = children;
  if (isValidElement(children)) {
    const child = children as ReactElement<InjectableProps>;
    const p = child.props;
    control = cloneElement(child, {
      id: p.id ?? id,
      required: p.required ?? (required || undefined),
      'aria-invalid': p['aria-invalid'] ?? (invalid || undefined),
      'aria-describedby': p['aria-describedby'] ?? describedBy,
    });
  }

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid, required }}>
      <div className={cx('srx-field', className)} {...rest}>
        {label && (
          <label className="srx-field__label" htmlFor={id}>
            {label}
            {required && <span className="srx-field__req" aria-hidden="true">*</span>}
          </label>
        )}
        {control}
        {error ? (
          <span className="srx-field__error" id={msgId}>{error}</span>
        ) : hint ? (
          <span className="srx-field__hint" id={msgId}>{hint}</span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
