// Pure string logic for the segmented one-time-code input. The component owns the
// box refs + focus advancement; this owns turning a code string into boxes and back.

/** The per-box characters of a code, padded to `length` with empty strings. */
export function otpDigits(value: string, length: number): string[] {
  return Array.from({ length }, (_, i) => value[i] || '');
}

/** The code with `ch` placed at box `index`, joined and truncated to `length`.
 *  Clearing a middle box collapses the join (the value is the concatenated boxes). */
export function withOtpChar(value: string, index: number, ch: string, length: number): string {
  const next = otpDigits(value, length);
  next[index] = ch;
  return next.join('').slice(0, length);
}

/** Clean pasted text into a code: strip whitespace, truncate to `length`. */
export function sanitizeOtpPaste(text: string, length: number): string {
  return text.replace(/\s/g, '').slice(0, length);
}
