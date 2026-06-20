import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Features.stories';
import { FeaturesA, FeaturesB, FeaturesC } from './Features';

const composed = composeStories(stories);

describe('Features (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('FeaturesA renders items (title + description)', () => {
    render(
      <FeaturesA
        eyebrow="Why"
        heading="Wired together"
        items={[
          { title: 'Color system', description: 'Radix scales' },
          { title: 'Components', description: '53 primitives' },
        ]}
      />,
    );
    expect(screen.getByText('Color system')).toBeTruthy();
    expect(screen.getByText('Radix scales')).toBeTruthy();
    expect(screen.getByText('Components')).toBeTruthy();
    expect(screen.getByText('53 primitives')).toBeTruthy();
    expect(screen.getByText('Why')).toBeTruthy();
    expect(screen.getByText('Wired together')).toBeTruthy();
  });

  it('FeaturesA children override auto-rendered body', () => {
    render(
      <FeaturesA items={[{ title: 'should not render' }]}>
        <div data-testid="override">Custom body</div>
      </FeaturesA>,
    );
    expect(screen.getByTestId('override')).toBeTruthy();
    expect(screen.queryByText('should not render')).toBeNull();
  });

  it('FeaturesB renders lead card and remaining cells', () => {
    render(
      <FeaturesB
        items={[
          { title: 'Lead item', description: 'Lead desc' },
          { title: 'Cell one', description: 'Cell desc' },
          { title: 'Wide cell', description: 'Wide desc' },
        ]}
      />,
    );
    expect(screen.getByText('Lead item')).toBeTruthy();
    expect(screen.getByText('Cell one')).toBeTruthy();
    expect(screen.getByText('Wide cell')).toBeTruthy();
  });

  it('FeaturesB children override auto-rendered body', () => {
    render(
      <FeaturesB items={[{ title: 'hidden' }]}>
        <div data-testid="bentochild">Bento override</div>
      </FeaturesB>,
    );
    expect(screen.getByTestId('bentochild')).toBeTruthy();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('FeaturesC renders alternating spotlight items', () => {
    render(
      <FeaturesC
        items={[
          { title: 'Spotlight one', description: 'Desc one' },
          { title: 'Spotlight two', description: 'Desc two' },
        ]}
      />,
    );
    expect(screen.getByText('Spotlight one')).toBeTruthy();
    expect(screen.getByText('Desc two')).toBeTruthy();
  });

  it('FeaturesC children override auto-rendered body', () => {
    render(
      <FeaturesC items={[{ title: 'ignored' }]}>
        <div data-testid="spotchild">Spot override</div>
      </FeaturesC>,
    );
    expect(screen.getByTestId('spotchild')).toBeTruthy();
    expect(screen.queryByText('ignored')).toBeNull();
  });

  it('FeaturesB renders heading and eyebrow', () => {
    render(
      <FeaturesB
        items={[{ title: 'Lead', description: 'Desc' }]}
        heading="H"
        eyebrow="E"
      />,
    );
    expect(screen.getByText('H')).toBeTruthy();
    expect(screen.getByText('E')).toBeTruthy();
  });

  it('FeaturesC renders heading', () => {
    render(
      <FeaturesC
        items={[{ title: 'T', description: 'D' }]}
        heading="H"
      />,
    );
    expect(screen.getByText('H')).toBeTruthy();
  });

  it('FeaturesC without media does not render placeholder', () => {
    render(<FeaturesC items={[{ title: 'T' }]} />);
    expect(document.querySelector('.ph')).toBeNull();
  });
});
