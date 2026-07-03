import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

// Pages are full compositions, not gated by the a11y/api-contract story globs
// (those cover components + sections). This smoke test renders every page once
// so a broken composition (a bad prop, a null map) fails CI instead of only
// showing up in the explorer.
const pages = import.meta.glob('./*/*.stories.tsx', { eager: true }) as Record<
  string,
  { default?: { component?: React.ComponentType } }
>;

describe('pages render without throwing', () => {
  for (const [path, mod] of Object.entries(pages)) {
    const Page = mod.default?.component;
    if (!Page) continue;
    it(path.replace('./', '').replace('/', ' · '), () => {
      const { container } = render(<Page />);
      expect(container.firstChild).toBeTruthy();
    });
  }
});
