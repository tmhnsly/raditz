import type { IconName } from '../display/Icon/Icon';

/**
 * The one semantic-status vocabulary. Components keep their own prop names
 * (`tone`, `color`, `variant`) and may accept only a documented subset via
 * `Extract<StatusTone, ...>`, but the values all come from this union so the
 * design system never invents a seventh spelling of "warning".
 */
export type StatusTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** The tones that carry feedback semantics — these get an icon and a live-region role. */
export type FeedbackTone = Extract<StatusTone, 'info' | 'success' | 'warning' | 'danger'>;

/** Canonical tone → icon mapping (registry names) for feedback surfaces. */
export const STATUS_TONE_ICON: Record<FeedbackTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

/**
 * Live-region role for a status surface: `danger` interrupts (`alert`), every
 * other tone announces politely (`status`).
 */
export function statusToneRole(tone: StatusTone): 'alert' | 'status' {
  return tone === 'danger' ? 'alert' : 'status';
}
