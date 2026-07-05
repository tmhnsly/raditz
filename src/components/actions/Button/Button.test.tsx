import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Button } from './Button';
import * as stories from './Button.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Button (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Button element resolution', () => {
  it('renders a <button> by default and an <a> for href', () => {
    const { container, rerender } = render(<Button>Go</Button>);
    expect(container.querySelector('button.rdz-btn')).toBeTruthy();
    rerender(<Button href="/x">Go</Button>);
    const a = container.querySelector('a.rdz-btn') as HTMLAnchorElement;
    expect(a).toBeTruthy();
    expect(a.getAttribute('href')).toBe('/x');
  });

  it('render (element) swaps the element while merging class, data-attrs and children', () => {
    const { container } = render(
      <Button variant="soft" size="lg" render={<a href="/next" className="link" />}>Label</Button>,
    );
    const a = container.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/next');
    expect(a.classList.contains('rdz-btn')).toBe(true);   // component class
    expect(a.classList.contains('link')).toBe(true);       // consumer class
    expect(a.getAttribute('data-variant')).toBe('soft');
    expect(a.getAttribute('data-size')).toBe('lg');
    expect(a.textContent).toBe('Label');                    // component children win
  });

  it('render (element) chains event handlers from both sides', () => {
    const own = vi.fn();
    const theirs = vi.fn();
    render(<Button onClick={own} render={<a href="#" onClick={theirs} />}>Hit</Button>);
    fireEvent.click(screen.getByText('Hit'));
    expect(own).toHaveBeenCalledTimes(1);
    expect(theirs).toHaveBeenCalledTimes(1);
  });

  it('render (function) receives merged props + state', () => {
    render(
      <Button variant="ghost" size="sm" render={(props, state) => <a {...props} data-testid="fn" data-state-variant={state.variant} />}>
        Fn
      </Button>,
    );
    const el = screen.getByTestId('fn');
    expect(el.tagName).toBe('A');
    expect(el.classList.contains('rdz-btn')).toBe(true);
    expect(el.getAttribute('data-state-variant')).toBe('ghost');
    expect(el.textContent).toBe('Fn');
  });
});
