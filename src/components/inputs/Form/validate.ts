// Pure field-error resolution for Form. The component reads the live DOM
// ValidityState and runs the custom validator; this decides which message wins,
// so the precedence (native invalidity → mapped message → browser message;
// otherwise the custom error) is testable without rendering a form.

export type ValidityKey =
  | 'valueMissing' | 'typeMismatch' | 'tooShort' | 'tooLong'
  | 'patternMismatch' | 'rangeUnderflow' | 'rangeOverflow' | 'stepMismatch';

export const VALIDITY_KEYS: ValidityKey[] = [
  'valueMissing', 'typeMismatch', 'tooShort', 'tooLong',
  'patternMismatch', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch',
];

/** The slice of the DOM ValidityState this module reads (structurally compatible
 *  with the real `ValidityState`). */
export type FieldValidity = { valid: boolean } & Partial<Record<ValidityKey, boolean>>;

/**
 * Resolve a field's error string. Native invalidity wins: the first failing
 * ValidityState key with a mapped message uses it, otherwise the browser's
 * `validationMessage`. When the field is natively valid (or has no element),
 * the already-computed `customError` is used.
 */
export function resolveFieldError(
  validity: FieldValidity | null | undefined,
  validationMessage: string,
  messages: Partial<Record<ValidityKey, string>> | undefined,
  customError: string,
): string {
  if (validity && !validity.valid) {
    const msgs = messages || {};
    for (const key of VALIDITY_KEYS) {
      if (validity[key] && msgs[key]) return msgs[key] as string;
    }
    return validationMessage;
  }
  return customError;
}
