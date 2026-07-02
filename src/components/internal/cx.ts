export type ClassValue = string | number | false | null | undefined;

/**
 * Join class names, dropping falsy values. The one-liner every component used to
 * repeat (`[...].filter(Boolean).join(' ')`) — use this instead.
 *
 *   cx('rdz-btn', isBusy && 'is-busy', className)
 *
 * Scope: the block class, BOOLEAN modifiers, and the consumer's className.
 * Enumerated one-of-N axes (variant/size/tone/side/…) do NOT belong in here —
 * they ride data attributes (`data-variant={variant}`) styled as
 * `.rdz-btn[data-variant='primary']`; an attribute can only hold one value, so
 * conflicting modifiers are unrepresentable.
 */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
