import { describe, it, expect } from 'vitest';
import {
  CATEGORIES,
  TITLE_EXCEPTIONS,
  expectedTitle,
  titleSegments,
  kebab,
  slugForTitle,
  humanize,
} from './taxonomy.mjs';

describe('taxonomy grammar', () => {
  describe('kebab', () => {
    it('lowercases, collapses non-alphanumerics to single dashes', () => {
      expect(kebab('A Centered Dual CTA')).toBe('a-centered-dual-cta');
    });
    it('trims leading/trailing separators', () => {
      expect(kebab('  Hello / World!  ')).toBe('hello-world');
    });
  });

  describe('humanize', () => {
    it('splits a story export id into spaced words', () => {
      expect(humanize('A_CenteredDualCTA')).toBe('A Centered Dual CTA');
    });
  });

  describe('titleSegments', () => {
    it('splits a slash title into trimmed segments', () => {
      expect(titleSegments('Components/Actions/Button')).toEqual(['Components', 'Actions', 'Button']);
    });
    it('trims whitespace around segments', () => {
      expect(titleSegments('Pages/ App shell ')).toEqual(['Pages', 'App shell']);
    });
  });

  describe('slugForTitle', () => {
    it('derives the kebab slug path from a title', () => {
      expect(slugForTitle('Components/Actions/Button')).toBe('components/actions/button');
    });
    it('matches the slug for a multi-word segment', () => {
      expect(slugForTitle('Pages/App shell')).toBe('pages/app-shell');
    });
  });

  describe('expectedTitle', () => {
    it('derives the title from a component folder', () => {
      expect(expectedTitle({ category: 'actions', name: 'Button' })).toBe('Components/Actions/Button');
    });
    it('honours a curated showroom exception', () => {
      expect(expectedTitle({ category: 'layout', name: 'AppShell' })).toBe(TITLE_EXCEPTIONS['layout/AppShell']);
    });
    it('returns null for an unknown category', () => {
      expect(expectedTitle({ category: 'nope', name: 'Whatever' })).toBeNull();
    });
  });

  describe('CATEGORIES', () => {
    it('is the documented 13-category set', () => {
      expect(Object.keys(CATEGORIES).sort()).toEqual(
        [
          'actions', 'data', 'disclosure', 'display', 'feedback', 'inputs',
          'layout', 'media', 'motion', 'navigation', 'overlay', 'surfaces', 'typography',
        ].sort(),
      );
    });
  });
});
