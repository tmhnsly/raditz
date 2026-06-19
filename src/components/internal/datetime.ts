// Pure date helpers for calendar UIs (DatePicker, and any future date control).
// "ISO" here means a YYYY-MM-DD *local* date string. Kept dependency-free.

/** Parse a YYYY-MM-DD string to a local Date (midnight), or null when empty. */
export function parseISO(v: string | undefined): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Format a Date to YYYY-MM-DD (local), or '' for null. */
export function toISO(d: Date | null): string {
  return d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : '';
}

/** True when two dates fall on the same calendar day (null → no match). */
export function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** True when d is before min or after max; either bound null means unbounded. */
export function outOfRange(d: Date, min: Date | null, max: Date | null): boolean {
  return Boolean((min && d < min) || (max && d > max));
}

/** Monday-first calendar cells for a month: leading nulls to the first weekday,
 *  then a Date for each day of the month. */
export function monthGrid(year: number, month: number): Array<Date | null> {
  const startIdx = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startIdx; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}
