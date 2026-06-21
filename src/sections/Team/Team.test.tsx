import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Team.stories';
import { TeamA } from './Team';

const composed = composeStories(stories);

describe('Team (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders all member names', () => {
    const { getByText } = render(
      <TeamA
        members={[
          { name: 'Alice', role: 'Designer' },
          { name: 'Bob', role: 'Engineer' },
        ]}
      />,
    );
    getByText('Alice');
    getByText('Bob');
    getByText('Designer');
    getByText('Engineer');
  });

  it('renders optional heading when provided', () => {
    const { getByText } = render(
      <TeamA heading="Our people" members={[{ name: 'Alice' }]} />,
    );
    getByText('Our people');
  });

  it('children override auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <TeamA members={[{ name: 'Alice' }]}>
        <span>custom override</span>
      </TeamA>,
    );
    getByText('custom override');
    expect(queryByText('Alice')).toBeNull();
  });
});
