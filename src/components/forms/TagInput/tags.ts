// Pure add-a-tag rule for TagInput. Returns the next tags, or null when the input
// is rejected (so the component knows whether to clear its draft). A 0 or undefined
// `max` means "no cap" (legacy behaviour).

export function addTag(tags: string[], raw: string, max?: number): string[] | null {
  const t = raw.trim();
  if (!t || tags.includes(t) || (max ? tags.length >= max : false)) return null;
  return [...tags, t];
}
