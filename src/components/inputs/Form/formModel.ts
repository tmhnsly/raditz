// Form conditional-field model — the pure rules behind `when` predicates, lifted
// out of Form's change/submit/render closures so the conditional-field semantics
// (which fields are live, and that hiding one clears its stale error) are tested
// without rendering a form. Generic over a minimal field shape so it stays
// decoupled from FormFieldSpec. Field VALUE validation lives in validate.ts; this
// is purely about VISIBILITY. Same co-located "pure core" pattern as validate.ts.

/** The only field facets visibility depends on. FormFieldSpec satisfies this. */
export interface VisibilityField {
  name: string;
  when?: (values: Record<string, string>) => boolean;
}

/** A field with no `when` is always live; otherwise its predicate decides. */
export function isVisible(field: VisibilityField, values: Record<string, string>): boolean {
  return !field.when || field.when(values);
}

/** The fields live for these values — the one source render AND submit-validation read. */
export function visibleFields<T extends VisibilityField>(fields: T[], values: Record<string, string>): T[] {
  return fields.filter((f) => isVisible(f, values));
}

/**
 * Drop errors belonging to fields these values now hide. Returns the SAME `errors`
 * reference when nothing changed, so the caller can skip a needless re-render.
 */
export function pruneHiddenErrors(
  errors: Record<string, string>,
  fields: VisibilityField[],
  values: Record<string, string>,
): Record<string, string> {
  let next = errors;
  for (const f of fields) {
    if (!isVisible(f, values) && next[f.name]) {
      if (next === errors) next = { ...errors };
      delete next[f.name];
    }
  }
  return next;
}
