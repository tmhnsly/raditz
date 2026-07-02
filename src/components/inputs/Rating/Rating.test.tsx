import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Rating } from './Rating';
import * as stories from './Rating.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Rating (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const radio = (name: string): HTMLElement => screen.getByRole('radio', { name });
const checked = (name: string): boolean => radio(name).getAttribute('aria-checked') === 'true';
const fgStyle = (container: HTMLElement, star: number): string =>
  container.querySelectorAll('.rdz-rating__fg')[star - 1]?.getAttribute('style') ?? '';

describe('Rating (behaviour)', () => {
  it('clicking a star sets the value and fires onValueChange', () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={0} onValueChange={onValueChange} />);
    fireEvent.click(radio('3 stars'));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(checked('3 stars')).toBe(true);
  });

  it('clicking the current value clears back to 0', () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={3} onValueChange={onValueChange} />);
    fireEvent.click(radio('3 stars'));
    expect(onValueChange).toHaveBeenCalledWith(0);
    expect(checked('3 stars')).toBe(false);
  });

  it('half precision selects half-star values', () => {
    const onValueChange = vi.fn();
    render(<Rating precision="half" onValueChange={onValueChange} />);
    fireEvent.click(radio('2.5 stars'));
    expect(onValueChange).toHaveBeenCalledWith(2.5);
    expect(checked('2.5 stars')).toBe(true);
  });

  it('hover previews the fill and resets on mouse leave', () => {
    const { container } = render(<Rating defaultValue={0} />);
    fireEvent.mouseEnter(radio('4 stars'));
    expect(fgStyle(container, 4)).toContain('100%');
    fireEvent.mouseLeave(container.querySelector('.rdz-rating')!);
    expect(fgStyle(container, 4)).toContain('0%');
  });

  it('arrow keys change the value by one step; Home/End jump to min/max', () => {
    render(<Rating defaultValue={2} count={5} />);
    fireEvent.keyDown(radio('2 stars'), { key: 'ArrowRight' });
    expect(checked('3 stars')).toBe(true);
    expect(document.activeElement).toBe(radio('3 stars'));

    fireEvent.keyDown(radio('3 stars'), { key: 'ArrowDown' });
    expect(checked('2 stars')).toBe(true);

    fireEvent.keyDown(radio('2 stars'), { key: 'Home' });
    expect(checked('1 star')).toBe(true);
    // decreasing stops at the minimum (clear via click/Space instead)
    fireEvent.keyDown(radio('1 star'), { key: 'ArrowLeft' });
    expect(checked('1 star')).toBe(true);

    fireEvent.keyDown(radio('1 star'), { key: 'End' });
    expect(checked('5 stars')).toBe(true);
    expect(document.activeElement).toBe(radio('5 stars'));
  });

  it('half precision arrows step by 0.5', () => {
    render(<Rating precision="half" defaultValue={2} />);
    fireEvent.keyDown(radio('2 stars'), { key: 'ArrowUp' });
    expect(checked('2.5 stars')).toBe(true);
    fireEvent.keyDown(radio('2.5 stars'), { key: 'ArrowLeft' });
    expect(checked('2 stars')).toBe(true);
    fireEvent.keyDown(radio('2 stars'), { key: 'Home' });
    expect(checked('0.5 stars')).toBe(true);
  });

  it('keeps a single tab stop: the checked radio, or the first when unrated', () => {
    const { unmount } = render(<Rating defaultValue={3} />);
    const radios = screen.getAllByRole('radio');
    expect(radios.filter((r) => r.tabIndex === 0)).toEqual([radio('3 stars')]);
    unmount();

    render(<Rating defaultValue={0} />);
    const fresh = screen.getAllByRole('radio');
    expect(fresh.filter((r) => r.tabIndex === 0)).toEqual([radio('1 star')]);
  });

  it('disabled is inert: radios disabled, keys do nothing', () => {
    render(<Rating disabled defaultValue={2} />);
    for (const r of screen.getAllByRole('radio')) expect((r as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(radio('2 stars'), { key: 'ArrowRight' });
    expect(checked('2 stars')).toBe(true);
    expect(checked('3 stars')).toBe(false);
  });

  it('readOnly renders a non-interactive img with fractional fill', () => {
    const { container } = render(<Rating readOnly value={3.2} />);
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(fgStyle(container, 4)).toMatch(/: 20(\.0+\d+)?%/); // ~20% (float precision)
  });
});
