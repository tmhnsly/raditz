import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { NumberInput } from './NumberInput';
import * as stories from './NumberInput.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('NumberInput (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const input = (): HTMLInputElement => screen.getByRole('textbox') as HTMLInputElement;
const dec = (): HTMLElement => screen.getByRole('button', { name: 'Decrease' });
const inc = (): HTMLElement => screen.getByRole('button', { name: 'Increase' });

describe('NumberInput (behaviour)', () => {
  it('steps up and down with the buttons and fires onValueChange (uncontrolled)', () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="n" defaultValue={2} onValueChange={onValueChange} />);
    fireEvent.click(inc());
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(input().value).toBe('3');
    fireEvent.click(dec());
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(input().value).toBe('2');
  });

  it('honours a controlled value (display follows the prop, not internal state)', () => {
    const { rerender } = render(<NumberInput aria-label="n" value={4} onValueChange={() => {}} />);
    expect(input().value).toBe('4');
    fireEvent.click(inc()); // onValueChange fires but value prop is fixed
    expect(input().value).toBe('4');
    rerender(<NumberInput aria-label="n" value={7} onValueChange={() => {}} />);
    expect(input().value).toBe('7');
  });

  it('clamps at the bounds and disables the stepper that would overflow', () => {
    render(<NumberInput aria-label="n" defaultValue={8} min={1} max={8} />);
    expect((inc() as HTMLButtonElement).disabled).toBe(true);
    expect((dec() as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(dec());
    expect(input().value).toBe('7');
    expect((inc() as HTMLButtonElement).disabled).toBe(false);
  });

  it('steps with ArrowUp/ArrowDown and jumps to bounds with Home/End', () => {
    render(<NumberInput aria-label="n" defaultValue={5} min={0} max={10} />);
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().value).toBe('6');
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().value).toBe('5');
    fireEvent.keyDown(input(), { key: 'End' });
    expect(input().value).toBe('10');
    fireEvent.keyDown(input(), { key: 'Home' });
    expect(input().value).toBe('0');
  });

  it('commits typed text on blur, clamping into range', () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="n" defaultValue={0} min={0} max={20} onValueChange={onValueChange} />);
    fireEvent.change(input(), { target: { value: '50' } });
    fireEvent.blur(input());
    expect(input().value).toBe('20'); // clamped
    expect(onValueChange).toHaveBeenLastCalledWith(20);
  });

  it('reverts to the last committed value when the draft is not a number', () => {
    render(<NumberInput aria-label="n" defaultValue={3} />);
    fireEvent.change(input(), { target: { value: 'abc' } });
    fireEvent.blur(input());
    expect(input().value).toBe('3');
  });

  it('commits on Enter', () => {
    render(<NumberInput aria-label="n" defaultValue={0} />);
    fireEvent.change(input(), { target: { value: '9' } });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(input().value).toBe('9');
  });

  it('is inert when disabled', () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="n" defaultValue={2} disabled onValueChange={onValueChange} />);
    expect(input().disabled).toBe(true);
    expect((inc() as HTMLButtonElement).disabled).toBe(true);
    expect((dec() as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(inc());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('fractional steps do not accumulate float dust', () => {
    render(<NumberInput aria-label="n" defaultValue={0} step={0.1} />);
    fireEvent.click(inc());
    fireEvent.click(inc());
    expect(input().value).toBe('0.2');
  });
});
