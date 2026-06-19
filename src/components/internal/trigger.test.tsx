import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useTrigger } from './trigger';

function Harness({ open, defaultOpen, onOpenChange }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void }) {
  const t = useTrigger<HTMLButtonElement>({ open, defaultOpen, onOpenChange });
  return (
    <>
      <button ref={t.anchorRef} data-testid="trigger" data-open={t.open} onClick={t.toggle}>x</button>
      <button data-testid="close" onClick={t.close}>close</button>
    </>
  );
}
const isOpen = (el: HTMLElement) => el.getAttribute('data-open') === 'true';

describe('useTrigger', () => {
  it('uncontrolled: toggles from defaultOpen and close() forces shut', () => {
    const { getByTestId } = render(<Harness defaultOpen={false} />);
    const trig = getByTestId('trigger');
    expect(isOpen(trig)).toBe(false);
    fireEvent.click(trig);
    expect(isOpen(trig)).toBe(true);
    fireEvent.click(trig);
    expect(isOpen(trig)).toBe(false);
    fireEvent.click(trig);
    fireEvent.click(getByTestId('close'));
    expect(isOpen(trig)).toBe(false);
  });

  it('defaults to closed when no defaultOpen is given', () => {
    const { getByTestId } = render(<Harness />);
    expect(isOpen(getByTestId('trigger'))).toBe(false);
  });

  it('controlled: the open prop wins; toggle reports the next state without self-updating', () => {
    const onOpenChange = vi.fn();
    const { getByTestId } = render(<Harness open onOpenChange={onOpenChange} />);
    const trig = getByTestId('trigger');
    expect(isOpen(trig)).toBe(true);
    fireEvent.click(trig);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(isOpen(trig)).toBe(true); // stays open until the parent changes the prop
  });
});
