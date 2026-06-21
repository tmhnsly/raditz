import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './SocialProof.stories';
import { SocialProofA, SocialProofB } from './SocialProof';

const composed = composeStories(stories);

describe('SocialProof (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders logo names in SocialProofA', () => {
    const { getAllByText } = render(
      <SocialProofA logos={[{ name: 'Acme' }, { name: 'Globex' }]} />,
    );
    // Marquee duplicates the group for scroll animation (aria-hidden clone)
    expect(getAllByText('Acme').length).toBeGreaterThan(0);
    expect(getAllByText('Globex').length).toBeGreaterThan(0);
  });

  it('renders label and logo names in SocialProofB', () => {
    const { getByText } = render(
      <SocialProofB
        logos={[{ name: 'Initech' }]}
        label="Trusted by teams at"
      />,
    );
    getByText('Trusted by teams at');
    getByText('Initech');
  });

  it('children override auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <SocialProofA logos={[{ name: 'Hidden' }]}>
        <span>custom logos</span>
      </SocialProofA>,
    );
    getByText('custom logos');
    expect(queryByText('Hidden')).toBeNull();
  });
});
