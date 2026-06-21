import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './AppShell.stories';
import { AppShell } from './AppShell';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('AppShell', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders its slots (brand, nav, breadcrumbs, actions, content)', () => {
    const { getByText } = render(
      <AppShell brand="Acme" nav={<nav>Nav</nav>} breadcrumbs={<span>Home</span>} actions={<button type="button">Act</button>}>
        Main content
      </AppShell>,
    );
    expect(getByText('Acme')).toBeTruthy();
    expect(getByText('Nav')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Main content')).toBeTruthy();
  });
});
