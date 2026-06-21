import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Cta.stories';
import { CtaA, CtaB } from './Cta';

const composed = composeStories(stories);

describe('Cta (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('CtaA renders required title', () => {
    render(<CtaA title="Hello CTA" />);
    expect(screen.getByText('Hello CTA')).toBeTruthy();
  });

  it('CtaA children override the body', () => {
    render(
      <CtaA title="unused">
        <span>override content</span>
      </CtaA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });

  it('CtaB renders required title', () => {
    render(
      <CtaB
        title="Start shipping"
        emailCapture={{ placeholder: 'x@y.com', action: { label: 'Go' } }}
      />,
    );
    expect(screen.getByText('Start shipping')).toBeTruthy();
  });

  it('CtaB children override the body', () => {
    render(
      <CtaB title="unused">
        <span>override content</span>
      </CtaB>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });
});
