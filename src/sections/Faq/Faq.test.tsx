import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Faq.stories';
import { FaqA, FaqB } from './Faq';

const composed = composeStories(stories);

describe('Faq (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('FaqA renders all items', () => {
    const items = [
      { question: 'Q one', answer: 'A one' },
      { question: 'Q two', answer: 'A two' },
    ];
    const { getByText } = render(<FaqA items={items} />);
    getByText('Q one');
    getByText('A one');
    getByText('Q two');
    getByText('A two');
  });

  it('FaqB renders all items', () => {
    const items = [
      { question: 'What is this?', answer: 'A library.' },
      { question: 'Is it free?', answer: 'Yes.' },
    ];
    const { getByText } = render(<FaqB items={items} />);
    getByText('What is this?');
    getByText('A library.');
    getByText('Is it free?');
    getByText('Yes.');
  });

  it('FaqA renders heading when provided', () => {
    const { getByText } = render(
      <FaqA items={[{ question: 'Q', answer: 'A' }]} heading="Common questions" />,
    );
    getByText('Common questions');
  });

  it('FaqA children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <FaqA items={[{ question: 'Q', answer: 'A' }]}>
        <p>custom slot</p>
      </FaqA>,
    );
    getByText('custom slot');
    expect(queryByText('Q')).toBeNull();
  });

  it('FaqB children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <FaqB items={[{ question: 'Q', answer: 'A' }]}>
        <p>override content</p>
      </FaqB>,
    );
    getByText('override content');
    expect(queryByText('Q')).toBeNull();
  });

  it('FaqA align="center" centres the heading block (the sanctioned knob — products must not target internal DOM)', () => {
    const { container } = render(
      <FaqA heading="FAQs" align="center" items={[{ question: 'Q', answer: 'A' }]} />,
    );
    const head = container.querySelector('.sx-sec__head');
    expect(head?.className).toContain('sx-center');
  });
});
