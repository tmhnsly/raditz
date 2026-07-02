// The a11y gate (src/a11y.test.tsx) is browser-side, so it can't import the
// Node-only sourceSurface(); it mirrors the public surface with two
// import.meta.glob patterns instead. This test pins the mirror: every story
// file sourceSurface() reports must be reachable by one of the gate's globs,
// and the gate must actually contain those globs — so widening/moving the
// surface without widening the gate fails here instead of silently shrinking
// a11y coverage.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { sourceSurface } from './public-surface.mjs';

const GATE = 'src/a11y.test.tsx';
const GATE_GLOBS = ['./components/**/*.stories.tsx', './sections/**/*.stories.tsx'];

// import.meta.glob patterns are relative to src/ (the gate's directory).
const globCovers = (pattern, storyFile) => {
  const prefix = pattern.replace('./', 'src/').replace('**/*.stories.tsx', '');
  return storyFile.startsWith(prefix) && storyFile.endsWith('.stories.tsx');
};

describe('a11y gate surface', () => {
  const surface = sourceSurface();
  const stories = [...surface.components, ...surface.sections].map((e) => e.storyFile);

  it('the gate file declares exactly the mirrored globs', () => {
    const src = readFileSync(GATE, 'utf8');
    for (const pattern of GATE_GLOBS) {
      expect(src, `${GATE} must glob '${pattern}'`).toContain(`import.meta.glob('${pattern}'`);
    }
  });

  it('every public story file is covered by a gate glob', () => {
    const uncovered = stories.filter((f) => !GATE_GLOBS.some((g) => globCovers(g, f)));
    expect(uncovered, `stories invisible to the a11y gate: ${uncovered.join(', ')}`).toEqual([]);
  });

  it('the surface is non-trivial (walk sanity)', () => {
    expect(surface.components.length).toBeGreaterThan(40);
    expect(surface.sections.length).toBeGreaterThan(15);
  });
});
