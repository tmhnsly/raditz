import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Carousel.stories';
import { Carousel } from './Carousel';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Carousel', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

// jsdom has no layout, so we assert the active slide via the dot indicators
// (role="tab" + aria-selected), never via scroll geometry.
const slides = (n = 3): React.ReactNode[] =>
  Array.from({ length: n }, (_, i) => <div key={i}>Slide {i + 1}</div>);

const selectedDot = (): number =>
  screen.getAllByRole('tab').findIndex((t) => t.getAttribute('aria-selected') === 'true');

describe('Carousel — behaviour', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Next advances the active slide; Previous goes back', async () => {
    const user = userEvent.setup();
    render(<Carousel>{slides()}</Carousel>);
    expect(selectedDot()).toBe(0);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(selectedDot()).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(selectedDot()).toBe(0);
  });

  it('loops by default: Previous on the first slide wraps to the last', async () => {
    const user = userEvent.setup();
    render(<Carousel>{slides(3)}</Carousel>);

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(selectedDot()).toBe(2);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(selectedDot()).toBe(0); // wraps forward too
  });

  it('loop={false} disables Previous on the first slide and Next on the last', async () => {
    const user = userEvent.setup();
    render(<Carousel loop={false}>{slides(2)}</Carousel>);
    const prev = screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement;
    const next = screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement;

    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    await user.click(next);
    expect(selectedDot()).toBe(1);
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });

  it('clicking a dot jumps straight to that slide', async () => {
    const user = userEvent.setup();
    render(<Carousel>{slides(4)}</Carousel>);

    await user.click(screen.getByRole('tab', { name: 'Go to slide 3' }));
    expect(selectedDot()).toBe(2);
  });

  it('autoplay advances on the interval and wraps past the end', () => {
    vi.useFakeTimers();
    render(<Carousel autoplay interval={1000}>{slides(3)}</Carousel>);
    expect(selectedDot()).toBe(0);

    // Advance tick-by-tick: the interval reads the active index from a ref that
    // React updates on render, so each tick needs its own act() flush.
    act(() => vi.advanceTimersByTime(1000));
    expect(selectedDot()).toBe(1);

    act(() => vi.advanceTimersByTime(1000));
    expect(selectedDot()).toBe(2);

    act(() => vi.advanceTimersByTime(1000));
    expect(selectedDot()).toBe(0); // wraps past the end
  });

  it('does not auto-advance without autoplay', () => {
    vi.useFakeTimers();
    render(<Carousel interval={1000}>{slides(3)}</Carousel>);

    act(() => vi.advanceTimersByTime(10_000));
    expect(selectedDot()).toBe(0);
  });

  it('renders no dots or arrows for a single slide', () => {
    render(<Carousel>{slides(1)}</Carousel>);
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });
});
