import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import { composeStories } from '@storybook/react';
import * as stories from './Breadcrumb.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Breadcrumb', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Breadcrumb behaviour', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Nav', onClick: () => {} },
    { label: 'Here' },
  ];

  it('renders link, button and current forms; last item is aria-current', () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[items[0], { label: 'Nav', onClick }, items[2]]} />);
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    fireEvent.click(screen.getByRole('button', { name: 'Nav' }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByText('Here').getAttribute('aria-current')).toBe('page');
  });

  it('separator overrides the default chevron', () => {
    const { container } = render(<Breadcrumb items={items} separator="/" />);
    const seps = container.querySelectorAll('.rdz-breadcrumb__sep');
    expect(seps.length).toBe(2);
    expect(seps[0].textContent).toBe('/');
    expect(seps[0].getAttribute('aria-hidden')).toBe('true');
  });
});
