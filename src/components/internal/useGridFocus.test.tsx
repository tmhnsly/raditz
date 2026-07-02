import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useGridFocus } from './useGridFocus';

// The pickers' "freeze boundary" is asserted here, once: handled arrows both
// move DOM focus AND preventDefault (fireEvent returns false when the event was
// cancelled), so they can never scroll the page. The pickers keep smoke tests.

function GridHarness({ open, selected = true }: { open: boolean; selected?: boolean }) {
  const { ref, onKeyDown } = useGridFocus<HTMLDivElement>({
    open,
    initialFocus: ['.cell.is-selected', '.cell:not(:disabled)'],
    strategy: { kind: 'grid', itemSelector: 'button:not(:disabled)' },
  });
  return (
    <div ref={ref} onKeyDown={onKeyDown} data-testid="grid">
      {Array.from({ length: 6 }, (_, i) => (
        <button key={i} type="button" className={`cell${selected && i === 3 ? ' is-selected' : ''}`}>{i}</button>
      ))}
    </div>
  );
}

function ColumnsHarness({ open }: { open: boolean }) {
  const { ref, onKeyDown } = useGridFocus<HTMLDivElement>({
    open,
    initialFocus: ['.opt.is-selected', '.opt'],
    strategy: { kind: 'columns', columnSelector: '.col', itemSelector: '.opt' },
  });
  return (
    <div ref={ref} onKeyDown={onKeyDown}>
      <div className="col">
        <button type="button" className="opt">a0</button>
        <button type="button" className="opt is-selected">a1</button>
        <button type="button" className="opt">a2</button>
      </div>
      <div className="col">
        <button type="button" className="opt">b0</button>
        <button type="button" className="opt">b1</button>
      </div>
    </div>
  );
}

const buttons = (): HTMLButtonElement[] => Array.from(document.querySelectorAll('button'));
const focused = (): Element | null => document.activeElement;

afterEach(() => vi.restoreAllMocks());

describe('useGridFocus (grid strategy)', () => {
  it('focuses the first initialFocus match on open, trying selectors in order', () => {
    const { rerender, unmount } = render(<GridHarness open={false} />);
    expect(focused()).not.toBe(buttons()[3]);
    rerender(<GridHarness open />);
    expect(focused()).toBe(buttons()[3]); // .is-selected wins
    unmount();
    render(<GridHarness open selected={false} />);
    expect(focused()).toBe(buttons()[0]); // falls through to the next selector
  });

  it('ArrowRight/Left move by one and preventDefault (freeze boundary), clamped at the ends', () => {
    render(<GridHarness open selected={false} />);
    const b = buttons();
    const cancelled = !fireEvent.keyDown(b[0], { key: 'ArrowRight' });
    expect(cancelled).toBe(true);
    expect(focused()).toBe(b[1]);
    fireEvent.keyDown(b[1], { key: 'ArrowLeft' });
    fireEvent.keyDown(b[0], { key: 'ArrowLeft' });
    expect(focused()).toBe(b[0]); // clamped
    fireEvent.keyDown(b[0], { key: 'End' });
    expect(focused()).toBe(b[5]);
    fireEvent.keyDown(b[5], { key: 'Home' });
    expect(focused()).toBe(b[0]);
  });

  it('ArrowDown/Up jump a whole row using the real grid-template-columns track count', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ gridTemplateColumns: '32px 32px 32px' } as CSSStyleDeclaration);
    render(<GridHarness open selected={false} />);
    const b = buttons();
    const cancelled = !fireEvent.keyDown(b[1], { key: 'ArrowDown' });
    expect(cancelled).toBe(true);
    expect(focused()).toBe(b[4]); // +3 = one row
    fireEvent.keyDown(b[4], { key: 'ArrowUp' });
    expect(focused()).toBe(b[1]);
    fireEvent.keyDown(b[1], { key: 'ArrowUp' });
    expect(focused()).toBe(b[0]); // clamped to the first item
  });

  it('leaves unrelated keys alone', () => {
    render(<GridHarness open />);
    const notCancelled = fireEvent.keyDown(buttons()[3], { key: 'a' });
    expect(notCancelled).toBe(true);
  });
});

describe('useGridFocus (columns strategy)', () => {
  it('focuses the selected option on open', () => {
    render(<ColumnsHarness open />);
    expect(focused()?.textContent).toBe('a1');
  });

  it('ArrowDown/Up rove within the column with preventDefault, clamped', () => {
    render(<ColumnsHarness open />);
    const [a0, a1, a2] = buttons();
    const cancelled = !fireEvent.keyDown(a1, { key: 'ArrowDown' });
    expect(cancelled).toBe(true);
    expect(focused()).toBe(a2);
    fireEvent.keyDown(a2, { key: 'ArrowDown' });
    expect(focused()).toBe(a2); // clamped within the column
    fireEvent.keyDown(a2, { key: 'Home' });
    expect(focused()).toBe(a0);
  });

  it('ArrowRight/Left hop to the sibling column\'s first option', () => {
    render(<ColumnsHarness open />);
    const b = buttons();
    const cancelled = !fireEvent.keyDown(b[1], { key: 'ArrowRight' });
    expect(cancelled).toBe(true);
    expect(focused()?.textContent).toBe('b0');
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' });
    expect(focused()?.textContent).toBe('a0');
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowLeft' });
    expect(focused()?.textContent).toBe('a0'); // clamped at the first column
  });
});
