'use client';
import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';
import { Field } from '../Field/Field';
import { Select, type SelectOption } from '../Select/Select';
import { resolveFieldError } from './validate';
import type { ValidityKey } from './validate';
import { visibleFields as liveFields, pruneHiddenErrors } from './formModel';

export type { ValidityKey };

export interface FormFieldSpec {
  /** Key in the submitted values object. */
  name: string;
  label?: ReactNode;
  /** Input type — any native input type, `'textarea'`, or `'select'`. @default "text" */
  type?: string;
  required?: boolean;
  placeholder?: string;
  /** Options for a `type: 'select'` field (a leading placeholder option is added
   *  from `placeholder`). */
  options?: SelectOption[];
  /** Helper text shown when there's no error. */
  hint?: ReactNode;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  /** Render + validate this field only when the predicate passes — e.g. a
   *  conditional "please specify" that appears only for a particular choice.
   *  A hidden field is excluded from validation and from the visible form. */
  when?: (values: Record<string, string>) => boolean;
  /** Map ValidityState keys → error copy. */
  messages?: Partial<Record<ValidityKey, string>>;
  /** Custom validator; return an error string, or '' when valid. */
  validate?: (value: string, allValues: Record<string, string>) => string;
}

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Field specs to render and validate. */
  fields?: FormFieldSpec[];
  /** Submit button label. @default "Submit" */
  submitLabel?: ReactNode;
  /** Fires with the values object only when all fields are valid. */
  onSubmit?: (values: Record<string, string>) => void;
  /** Extra node placed in the actions row, before the submit button. */
  footer?: ReactNode;
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/**
 * Form — a data-driven form with native + custom validation and per-field
 * messages (Radix Form). `fields` is an array of
 * `{ name, label, type?, required?, placeholder?, hint?, minLength?, maxLength?,
 *    pattern?, messages?, validate? }`. Validation runs on submit, then live on
 * change/blur for fields the user has touched. `messages` maps ValidityState
 * keys (valueMissing, typeMismatch, tooShort, patternMismatch, …) to copy;
 * `validate(value, allValues)` returns a custom error string (or '').
 * `onSubmit(values)` fires only when everything is valid.
 */
export function Form({ fields = [], submitLabel = 'Submit', onSubmit, footer, className, ...rest }: FormProps): ReactElement {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ''])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const refs = useRef<Record<string, FieldElement | null>>({});

  const validateField = (f: FormFieldSpec, value: string, all: Record<string, string>): string => {
    const el = refs.current[f.name];
    const customError = f.validate ? (f.validate(value, all) || '') : '';
    return resolveFieldError(el?.validity, el?.validationMessage ?? '', f.messages, customError);
  };

  const recompute = (name: string, vals: Record<string, string>): void => {
    const f = fields.find((x) => x.name === name);
    if (!f) return;
    setErrors((prev) => {
      const cp = { ...prev };
      const e = validateField(f, vals[name], vals);
      if (e) cp[name] = e; else delete cp[name];
      return cp;
    });
  };

  // One source of "which fields are live right now" — render and submit-validation
  // both read this, so they can't disagree about what a `when` predicate hides.
  const visibleFields = liveFields(fields, values);

  const onChange = (name: string, value: string): void => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) recompute(name, next);
    // A field this change hides shouldn't keep showing a stale error.
    setErrors((prev) => pruneHiddenErrors(prev, fields, next));
  };

  const handleSubmit = (ev: FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    setSubmitted(true);
    const errs: Record<string, string> = {};
    // Only the currently-visible fields are validated.
    visibleFields.forEach((f) => { const e = validateField(f, values[f.name], values); if (e) errs[f.name] = e; });
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) onSubmit(values);
  };

  return (
    <form className={cx('rdz-form', className)} noValidate onSubmit={handleSubmit} {...rest}>
      {visibleFields.map((f) => {
        const err = errors[f.name];
        const shared = {
          name: f.name,
          value: values[f.name],
          placeholder: f.placeholder,
          minLength: f.minLength,
          maxLength: f.maxLength,
          onChange: (e: ChangeEvent<FieldElement>) => onChange(f.name, e.target.value),
          onBlur: () => { if (submitted) recompute(f.name, values); },
        };
        // Field owns label / id / aria-invalid / aria-describedby / required.
        return (
          <Field key={f.name} label={f.label} hint={f.hint} error={err || undefined} required={f.required}>
            {f.type === 'select' ? (
              <Select ref={(el) => { refs.current[f.name] = el; }} invalid={!!err} {...shared}>
                {f.placeholder ? <option value="">{f.placeholder}</option> : null}
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            ) : f.type === 'textarea' ? (
              <textarea ref={(el) => { refs.current[f.name] = el; }} className={cx('rdz-input', 'rdz-textarea', err && 'rdz-input--invalid')} {...shared} />
            ) : (
              <input ref={(el) => { refs.current[f.name] = el; }} className={cx('rdz-input', err && 'rdz-input--invalid')} type={f.type || 'text'} pattern={f.pattern} {...shared} />
            )}
          </Field>
        );
      })}
      <div className="rdz-form__actions">
        {footer}
        <button type="submit" className="rdz-btn rdz-btn--primary">{submitLabel}</button>
      </div>
    </form>
  );
}
