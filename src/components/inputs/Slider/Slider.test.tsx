import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Slider.stories';
import { Slider } from './Slider';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Slider', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Slider — keyboard behaviour', () => {
  it('ArrowRight/ArrowLeft step by `step` and fire onValueChange with the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider defaultValue={50} step={10} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('60');
    expect(onValueChange).toHaveBeenLastCalledWith(60);

    await user.keyboard('{ArrowLeft}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    expect(onValueChange).toHaveBeenLastCalledWith(50);
  });

  it('ArrowUp/ArrowDown are equivalent to ArrowRight/ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={5} step={1} max={10} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowUp}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('6');
    await user.keyboard('{ArrowDown}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('5');
  });

  it('Home/End jump to min/max', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider defaultValue={40} min={10} max={90} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{End}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('90');
    expect(onValueChange).toHaveBeenLastCalledWith(90);

    await user.keyboard('{Home}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('10');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it('clamps keyboard steps at the bounds', async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={100} max={100} step={25} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamps an out-of-range value into [min, max] for aria-valuenow', () => {
    render(<Slider defaultValue={150} min={0} max={100} />);
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('100');
  });

  it('is inert when disabled: unreachable by tab and keyboard changes nothing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider defaultValue={50} disabled onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');

    expect(thumb.getAttribute('aria-disabled')).toBe('true');
    expect(thumb.tabIndex).toBe(-1);

    thumb.focus(); // even if focused programmatically, keys must not commit
    await user.keyboard('{ArrowRight}{End}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('controlled: keeps rendering `value` but still reports the attempted change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider value={30} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(31);
    expect(thumb.getAttribute('aria-valuenow')).toBe('30'); // parent didn't update value
  });
});
