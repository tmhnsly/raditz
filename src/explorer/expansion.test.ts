import { describe, it, expect } from 'vitest';
import { initialExpanded, reconcileExpanded, openBranch } from './expansion';

describe('Sidebar expansion model', () => {
  describe('initialExpanded — compositions open, the collapsed group shut, route path opened', () => {
    it('opens every top group except the collapsed one', () => {
      expect(initialExpanded(['sections', 'components', 'pages'], [], 'components').sort()).toEqual(['pages', 'sections']);
    });
    it('re-opens the collapsed group when the route lands inside it', () => {
      const out = initialExpanded(['sections', 'components'], ['components', 'components/actions'], 'components');
      expect(out).toContain('components');
      expect(out).toContain('components/actions');
    });
  });

  describe('reconcileExpanded — scroll-spy moved the active section', () => {
    it('keeps the previous set untouched when there is no active path', () => {
      const prev = ['a', 'b'];
      expect(reconcileExpanded(prev, [], true)).toBe(prev);
    });
    it('collapses to just the active path when auto-collapse is on', () => {
      expect(reconcileExpanded(['a', 'b'], ['components', 'components/actions'], true)).toEqual(['components', 'components/actions']);
    });
    it('merges the active path into the existing set when auto-collapse is off', () => {
      expect(reconcileExpanded(['a'], ['a', 'b'], false).sort()).toEqual(['a', 'b']);
    });
  });

  describe('openBranch', () => {
    it('adds a newly-opened branch', () => {
      expect(openBranch(['a'], 'b')).toEqual(['a', 'b']);
    });
    it('does not duplicate an already-open branch', () => {
      expect(openBranch(['a', 'b'], 'a')).toEqual(['a', 'b']);
    });
  });
});
