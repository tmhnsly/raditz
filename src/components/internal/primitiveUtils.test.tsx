import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useControllableState, clamp, roundToStep } from './primitiveUtils';

/** Drives useControllableState through a button so we can assert what it renders
 * (data-state) and what it reports (onChange) in both controlled & uncontrolled modes. */
function Harness({
  value,
  defaultValue,
  onChange,
  next,
}: {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  next: number | ((prev: number) => number);
}) {
  const [state, setState] = useControllableState<number>({ value, defaultValue, onChange });
  return <button data-testid="b" data-state={state} onClick={() => setState(next)} />;
}

const stateOf = (el: HTMLElement) => Number(el.getAttribute('data-state'));

describe('useControllableState', () => {
  it('uncontrolled: starts at defaultValue, advances on set, reports via onChange', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<Harness defaultValue={1} next={2} onChange={onChange} />);
    const b = getByTestId('b');
    expect(stateOf(b)).toBe(1);
    fireEvent.click(b);
    expect(stateOf(b)).toBe(2); // owns its own state
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('controlled: the value prop wins — set does NOT move the displayed value, but onChange still fires', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<Harness value={5} next={9} onChange={onChange} />);
    const b = getByTestId('b');
    expect(stateOf(b)).toBe(5);
    fireEvent.click(b);
    expect(stateOf(b)).toBe(5); // parent owns it; unchanged until the prop changes
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it('functional updater resolves against the current value (uncontrolled)', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<Harness defaultValue={1} next={(p) => p + 1} onChange={onChange} />);
    const b = getByTestId('b');
    fireEvent.click(b);
    fireEvent.click(b);
    expect(stateOf(b)).toBe(3);
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it('functional updater resolves against the controlled value, leaving internal state untouched', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(<Harness value={10} next={(p) => p + 5} onChange={onChange} />);
    const b = getByTestId('b');
    fireEvent.click(b);
    expect(onChange).toHaveBeenCalledWith(15); // computed from the controlled 10
    expect(stateOf(b)).toBe(10);
  });

  it('does not throw when onChange is omitted', () => {
    const { getByTestId } = render(<Harness defaultValue={0} next={1} />);
    const b = getByTestId('b');
    expect(() => fireEvent.click(b)).not.toThrow();
    expect(stateOf(b)).toBe(1);
  });
});

describe('clamp', () => {
  it('bounds n into [min, max]', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('roundToStep', () => {
  it('snaps to the nearest step measured from min', () => {
    expect(roundToStep(7, 5, 0)).toBe(5);
    expect(roundToStep(8, 5, 0)).toBe(10);
    expect(roundToStep(12, 5, 2)).toBe(12); // 2,7,12,17 → 12 is on-grid
  });
  it('returns the value unchanged when step is 0', () => {
    expect(roundToStep(7.3, 0, 0)).toBe(7.3);
  });
});
