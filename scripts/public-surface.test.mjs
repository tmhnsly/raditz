import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { sourceSurface, LIB } from './public-surface.mjs';

describe('sourceSurface', () => {
  const s = sourceSurface();
  it('finds the public components and sections (story-gated, internal excluded)', () => {
    expect(s.components.length).toBeGreaterThan(50);
    expect(s.sections.length).toBeGreaterThan(10);
    expect(s.components.some((e) => e.category === 'internal')).toBe(false);
  });
  it('resolves each entry to a real component source file', () => {
    for (const e of [...s.components, ...s.sections]) {
      expect(fs.existsSync(e.componentFile), e.componentFile).toBe(true);
      expect(fs.existsSync(e.storyFile), e.storyFile).toBe(true);
    }
  });
  it('keeps the curated lib primitives products import (guards LIB drift)', () => {
    // Regression guard: a LIB omission once dropped colorScheme/ColorSchemeToggle,
    // breaking a consumer's `import { colorSchemeScript } from 'raditz'`. Pin the set
    // in BOTH the allowlist and the generated barrel so a drop fails here, not in a app.
    const critical = [
      './lib/colorScheme', './lib/useColorScheme', './lib/ColorSchemeToggle',
      './lib/theme', './lib/ThemePicker', './lib/SectionShell', './lib/InView', './lib/hooks',
    ];
    const barrel = fs.readFileSync('src/index.ts', 'utf8');
    for (const m of critical) {
      expect(LIB, `${m} missing from LIB allowlist`).toContain(m);
      expect(barrel, `${m} missing from generated barrel`).toContain(`from '${m}'`);
    }
  });
  it('agrees with the committed barrel (every surface entry has a barrel export)', () => {
    const barrel = fs.readFileSync('src/index.ts', 'utf8');
    for (const e of s.components) {
      expect(barrel, e.name).toContain(`./components/${e.category}/${e.name}`);
    }
    for (const e of s.sections) {
      expect(barrel, e.name).toContain(`./sections/${e.name}`);
    }
  });
});
