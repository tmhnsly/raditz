import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Animate } from './Animate';
import * as stories from './Animate.stories';

const composed = composeStories(stories);

describe('Animate (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Animate', () => {
  it('rides data attributes for preset / trigger / speed', () => {
    const { container } = render(<Animate preset="float" trigger="hover" speed="slow">x</Animate>);
    const el = container.querySelector('.rdz-animate') as HTMLElement;
    expect(el.getAttribute('data-preset')).toBe('float');
    expect(el.getAttribute('data-trigger')).toBe('hover');
    expect(el.getAttribute('data-speed')).toBe('slow');
  });

  it('forwards delay + repeat as custom properties (data, not inline animation)', () => {
    const { container } = render(<Animate preset="pop" delay={400} repeat={3}>x</Animate>);
    const el = container.querySelector('.rdz-animate') as HTMLElement;
    expect(el.style.getPropertyValue('--rdz-animate-delay')).toBe('400ms');
    expect(el.style.getPropertyValue('--rdz-animate-count')).toBe('3');
  });

  it('marks paused', () => {
    const { container } = render(<Animate preset="spin" paused>x</Animate>);
    expect((container.querySelector('.rdz-animate') as HTMLElement).classList.contains('is-paused')).toBe(true);
  });

  it('renders a custom element via `as` and forwards className/rest', () => {
    const { container } = render(<Animate as="div" preset="glow" className="c" id="g">x</Animate>);
    const el = container.querySelector('div.rdz-animate') as HTMLElement;
    expect(el.classList.contains('c')).toBe(true);
    expect(el.id).toBe('g');
  });

  it('for the inview trigger, latches is-in once observed (jsdom has no IO → immediate)', () => {
    // useInView reports inView:true immediately when IntersectionObserver is
    // absent (jsdom), so the animation isn't stuck hidden in tests/SSR.
    const { container } = render(<Animate preset="pop" trigger="inview">x</Animate>);
    expect((container.querySelector('.rdz-animate') as HTMLElement).classList.contains('is-in')).toBe(true);
  });
});
