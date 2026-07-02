import { describe, it, expect } from 'vitest';
import { STATUS_TONE_ICON, statusToneRole } from './statusTone';
import type { FeedbackTone, StatusTone } from './statusTone';

const FEEDBACK_TONES: FeedbackTone[] = ['info', 'success', 'warning', 'danger'];
const ALL_TONES: StatusTone[] = ['accent', 'neutral', ...FEEDBACK_TONES];

describe('statusTone', () => {
  it('maps every feedback tone to an icon name', () => {
    for (const tone of FEEDBACK_TONES) {
      expect(STATUS_TONE_ICON[tone]).toBeTruthy();
    }
    // The map declares exactly the feedback tones — nothing extra, nothing missing.
    expect(Object.keys(STATUS_TONE_ICON).sort()).toEqual([...FEEDBACK_TONES].sort());
  });

  it('gives danger the interrupting alert role and everything else status', () => {
    expect(statusToneRole('danger')).toBe('alert');
    for (const tone of ALL_TONES.filter((t) => t !== 'danger')) {
      expect(statusToneRole(tone)).toBe('status');
    }
  });
});
