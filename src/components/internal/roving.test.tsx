import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useRoving } from './keyboard';
import type { Orientation } from './keyboard';

function Harness({ count, orientation, loop, onSelect }: { count: number; orientation?: Orientation; loop?: boolean; onSelect?: (i: number) => void }) {
  const { active, onKeyDown } = useRoving({ count, orientation, loop, onSelect });
  return <div data-testid="r" tabIndex={0} onKeyDown={onKeyDown} data-active={active} />;
}

const activeOf = (el: HTMLElement) => Number(el.getAttribute('data-active'));

describe('useRoving', () => {
  it('ArrowDown advances; ArrowUp from 0 wraps to last when looping', () => {
    const { getByTestId } = render(<Harness count={3} />);
    const r = getByTestId('r');
    expect(activeOf(r)).toBe(0);
    fireEvent.keyDown(r, { key: 'ArrowDown' });
    expect(activeOf(r)).toBe(1);
    fireEvent.keyDown(r, { key: 'ArrowDown' });
    fireEvent.keyDown(r, { key: 'ArrowDown' }); // wraps 2 -> 0
    expect(activeOf(r)).toBe(0);
    fireEvent.keyDown(r, { key: 'ArrowUp' }); // wraps 0 -> 2
    expect(activeOf(r)).toBe(2);
  });

  it('clamps at the ends when loop is false', () => {
    const { getByTestId } = render(<Harness count={3} loop={false} />);
    const r = getByTestId('r');
    fireEvent.keyDown(r, { key: 'ArrowUp' });
    expect(activeOf(r)).toBe(0); // stays
    fireEvent.keyDown(r, { key: 'End' });
    expect(activeOf(r)).toBe(2);
    fireEvent.keyDown(r, { key: 'ArrowDown' });
    expect(activeOf(r)).toBe(2); // stays
    fireEvent.keyDown(r, { key: 'Home' });
    expect(activeOf(r)).toBe(0);
  });

  it('horizontal orientation responds to Left/Right, not Up/Down', () => {
    const { getByTestId } = render(<Harness count={3} orientation="horizontal" />);
    const r = getByTestId('r');
    fireEvent.keyDown(r, { key: 'ArrowDown' });
    expect(activeOf(r)).toBe(0); // ignored
    fireEvent.keyDown(r, { key: 'ArrowRight' });
    expect(activeOf(r)).toBe(1);
  });

  it('Enter/Space fire onSelect with the active index', () => {
    const onSelect = vi.fn();
    const { getByTestId } = render(<Harness count={3} onSelect={onSelect} />);
    const r = getByTestId('r');
    fireEvent.keyDown(r, { key: 'ArrowDown' });
    fireEvent.keyDown(r, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
