export type ClassValue = string | number | false | null | undefined;

/**
 * Join class names, dropping falsy values. The one-liner every component used to
 * repeat (`[...].filter(Boolean).join(' ')`) — use this instead.
 *
 *   cx('srx-btn', `srx-btn--${variant}`, size !== 'md' && `srx-btn--${size}`, className)
 */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
