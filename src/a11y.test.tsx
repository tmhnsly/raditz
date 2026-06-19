/// <reference types="vite/client" />
// Accessibility gate: renders the first story of every component and asserts
// zero axe-core violations. Runs as part of `pnpm test`.
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import type { ComponentType } from 'react';

type CSFModule = Parameters<typeof composeStories>[0];

const modules = import.meta.glob('./components/**/*.stories.tsx', { eager: true });

describe('a11y', () => {
  for (const [p, mod] of Object.entries(modules)) {
    const composed = composeStories(mod as CSFModule);
    const entries = Object.entries(composed) as [string, ComponentType][];
    if (!entries.length) continue;
    const [storyName, Story] = entries[0];
    it(`${p.replace('./components/', '')} :: ${storyName}`, async () => {
      const { container } = render(<Story />);
      const results = await axe(container);
      const violations = results.violations.map((v) => `${v.id}(${v.nodes.length})`);
      expect(violations, violations.join(', ')).toEqual([]);
    });
  }
});
