import { describe, it, expect } from 'vitest';
import { isVisible, visibleFields, pruneHiddenErrors } from './formModel';

type F = { name: string; when?: (vals: Record<string, string>) => boolean };

describe('Form conditional-field model', () => {
  describe('isVisible', () => {
    it('is always visible without a `when` predicate', () => {
      expect(isVisible({ name: 'a' }, {})).toBe(true);
    });
    it('follows the `when` predicate', () => {
      const f: F = { name: 'spec', when: (v) => v.choice === 'other' };
      expect(isVisible(f, { choice: 'other' })).toBe(true);
      expect(isVisible(f, { choice: 'a' })).toBe(false);
    });
  });

  describe('visibleFields — the one source of which fields are live', () => {
    it('drops fields whose `when` predicate fails', () => {
      const fields: F[] = [
        { name: 'choice' },
        { name: 'spec', when: (v) => v.choice === 'other' },
      ];
      expect(visibleFields(fields, { choice: 'a' }).map((f) => f.name)).toEqual(['choice']);
      expect(visibleFields(fields, { choice: 'other' }).map((f) => f.name)).toEqual(['choice', 'spec']);
    });
  });

  describe('pruneHiddenErrors — hiding a field clears its stale error', () => {
    const fields: F[] = [
      { name: 'choice' },
      { name: 'spec', when: (v) => v.choice === 'other' },
    ];

    it('drops the error for a field the new values hide (fresh object, input untouched)', () => {
      const errors = { spec: 'Required' };
      const next = pruneHiddenErrors(errors, fields, { choice: 'a' });
      expect(next).toEqual({});
      // Must be a NEW object (so React's Object.is bail-out re-renders) and must not mutate the input.
      expect(next).not.toBe(errors);
      expect(errors).toEqual({ spec: 'Required' });
    });

    it('keeps errors for fields that stay visible', () => {
      const errors = { spec: 'Required' };
      expect(pruneHiddenErrors(errors, fields, { choice: 'other' })).toEqual({ spec: 'Required' });
    });

    it('returns the SAME object reference when nothing changed (skips a render)', () => {
      const errors = { choice: 'Required' };
      expect(pruneHiddenErrors(errors, fields, { choice: 'other' })).toBe(errors);
    });
  });
});
