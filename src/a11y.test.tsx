/// <reference types="vite/client" />
// Accessibility gate: renders EVERY composed story of every public component AND
// section and asserts zero axe-core violations. Runs as part of `pnpm test`.
//
// The two globs below are the browser-side mirror of the public surface defined by
// scripts/public-surface.mjs (`sourceSurface()` walks src/components + src/sections
// for *.stories.tsx). This test can't import that Node-only module (import.meta.glob
// is the browser-side face), so scripts/a11y-surface.test.mjs asserts these patterns
// cover every story path sourceSurface() reports — keep the two in sync.
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import type { ComponentType } from 'react';

type CSFModule = Parameters<typeof composeStories>[0];

const modules = {
  ...import.meta.glob('./components/**/*.stories.tsx', { eager: true }),
  ...import.meta.glob('./sections/**/*.stories.tsx', { eager: true }),
};

// Narrowly-scoped skips: `path :: story` → axe rule ids disabled for that story
// only, each with a reason. Never disable a rule globally.
const SKIPPED_RULES: Record<string, string[]> = {
  // jsdom never loads media, so axe's no-autoplay-audio check waits forever on
  // <video> metadata and times out the suite. Environment limitation, not a real
  // violation — SectionBackground renders its video muted.
  'components/layout/SectionBackground/SectionBackground.stories.tsx :: Video': [
    'no-autoplay-audio',
  ],
};

describe('a11y', () => {
  for (const [p, mod] of Object.entries(modules)) {
    const composed = composeStories(mod as CSFModule);
    const entries = Object.entries(composed) as [string, ComponentType][];
    for (const [storyName, Story] of entries) {
      const key = `${p.replace('./', '')} :: ${storyName}`;
      it(key, async () => {
        const { container } = render(<Story />);
        const skipped = SKIPPED_RULES[key] ?? [];
        const results = await axe(container, {
          rules: Object.fromEntries(skipped.map((id) => [id, { enabled: false }])),
        });
        const violations = results.violations.map((v) => `${v.id}(${v.nodes.length})`);
        expect(violations, violations.join(', ')).toEqual([]);
      });
    }
  }
});
