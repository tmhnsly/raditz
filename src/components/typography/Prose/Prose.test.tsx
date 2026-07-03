import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Prose } from './Prose';
import * as stories from './Prose.stories';

const composed = composeStories(stories);

describe('Prose (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Prose', () => {
  it('scopes rendered content under .rdz-prose and clamps the measure by default', () => {
    const { container } = render(<Prose><p>Body</p></Prose>);
    const root = container.querySelector('.rdz-prose') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.classList.contains('is-measured')).toBe(true);
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('drops the measure clamp when measure=false and rides data-size', () => {
    const { container } = render(<Prose measure={false} size="lg"><p>x</p></Prose>);
    const root = container.querySelector('.rdz-prose') as HTMLElement;
    expect(root.classList.contains('is-measured')).toBe(false);
    expect(root.getAttribute('data-size')).toBe('lg');
  });

  it('renders a custom element via `as` and forwards className/rest', () => {
    const { container } = render(<Prose as="article" className="post" id="p1"><p>x</p></Prose>);
    const root = container.querySelector('article.rdz-prose') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.classList.contains('post')).toBe(true);
    expect(root.id).toBe('p1');
  });
});
