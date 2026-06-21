import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { sourceSurface, LIB } from './public-surface.mjs';

describe('sourceSurface', () => {
  const s = sourceSurface();
  it('finds the public components and sections (story-gated, internal excluded)', () => {
    expect(s.components.length).toBe(86);
    expect(s.sections.length).toBe(18);
    expect(s.components.some((e) => e.category === 'internal')).toBe(false);
  });
  it('resolves each entry to a real component source file', () => {
    for (const e of [...s.components, ...s.sections]) {
      expect(fs.existsSync(e.componentFile), e.componentFile).toBe(true);
      expect(fs.existsSync(e.storyFile), e.storyFile).toBe(true);
    }
  });
  it('keeps the curated lib allowlist', () => {
    expect(LIB).toContain('./lib/SectionShell');
  });
});
