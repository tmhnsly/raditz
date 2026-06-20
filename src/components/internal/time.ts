// Pure time helpers for the TimePicker. The canonical value is a 24-hour
// "HH:mm" string; these convert to/from the 12-hour display form. Dependency-free.

export interface Time {
  /** Hour 0–23. */
  h: number;
  /** Minute 0–59. */
  m: number;
}

/** Parse a "HH:mm" (or "H:mm") 24-hour string; null when empty/invalid. */
export function parseTime(v: string | undefined): Time | null {
  if (!v) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

/** Format hour + minute to the canonical 24-hour "HH:mm" string. */
export function toISOTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 24-hour hour → 12-hour hour (1–12) + period. */
export function to12(h: number): { h12: number; period: 'AM' | 'PM' } {
  return { h12: h % 12 || 12, period: h < 12 ? 'AM' : 'PM' };
}

/** 12-hour hour (1–12) + period → 24-hour hour (0–23). */
export function to24(h12: number, period: 'AM' | 'PM'): number {
  const base = h12 % 12;
  return period === 'PM' ? base + 12 : base;
}

/** Human display string, e.g. "9:05 AM" (hour12) or "21:05" (24-hour). */
export function formatTime(h: number, m: number, hour12: boolean): string {
  const mm = String(m).padStart(2, '0');
  if (!hour12) return `${String(h).padStart(2, '0')}:${mm}`;
  const { h12, period } = to12(h);
  return `${h12}:${mm} ${period}`;
}
