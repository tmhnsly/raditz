import { describe, it, expect, vi } from 'vitest';
import { useRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Overlay } from './Overlay';

// Let useDismiss's deferred (setTimeout 0) pointerdown listener attach.
function flushTimers(): Promise<void> {
  return act(async () => {
    await new Promise((r) => setTimeout(r, 1));
  });
}

describe('Overlay — the test surface for every overlay behavior', () => {
  it('renders children only while open', () => {
    const { queryByText, rerender } = render(
      <Overlay open={false} onDismiss={() => {}} position={{ kind: 'centered' }}>hi</Overlay>,
    );
    expect(queryByText('hi')).toBeNull();
    rerender(<Overlay open onDismiss={() => {}} position={{ kind: 'centered' }}>hi</Overlay>);
    expect(queryByText('hi')).not.toBeNull();
  });

  it('dismisses on Escape by default', () => {
    const onDismiss = vi.fn();
    render(<Overlay open onDismiss={onDismiss} position={{ kind: 'centered' }}>x</Overlay>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on Escape when dismissOnEscape is false', () => {
    const onDismiss = vi.fn();
    render(
      <Overlay open onDismiss={onDismiss} dismissOnEscape={false} position={{ kind: 'centered' }}>x</Overlay>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('renders a scrim for modal topologies and dismisses on scrim click', () => {
    const onDismiss = vi.fn();
    render(
      <Overlay open onDismiss={onDismiss} position={{ kind: 'centered' }}>x</Overlay>,
    );
    const scrim = document.querySelector('.rdz-overlay__scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as Element);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('keeps a scrim but blocks outside-dismiss when dismissOnOutside is false (AlertDialog)', () => {
    const onDismiss = vi.fn();
    render(
      <Overlay open onDismiss={onDismiss} dismissOnOutside={false} position={{ kind: 'centered' }}>x</Overlay>,
    );
    const scrim = document.querySelector('.rdz-overlay__scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as Element);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('locks body scroll while open for modal topologies and restores on close', () => {
    const { unmount } = render(
      <Overlay open onDismiss={() => {}} position={{ kind: 'centered' }}>x</Overlay>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('does not lock scroll for anchored topologies', () => {
    function Harness() {
      const anchor = useRef<HTMLButtonElement>(null);
      return (
        <div>
          <button ref={anchor}>t</button>
          <Overlay open onDismiss={() => {}} position={{ kind: 'anchored', anchor }}>x</Overlay>
        </div>
      );
    }
    render(<Harness />);
    expect(document.body.style.overflow).toBe('');
  });

  it('traps focus: moves focus to the first focusable on open and restores on close', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const { unmount } = render(
      <Overlay open onDismiss={() => {}} focus="trap" position={{ kind: 'centered' }}>
        <button>inside</button>
      </Overlay>,
    );
    expect((document.activeElement as HTMLElement).textContent).toBe('inside');
    unmount();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('sets aria-modal only when focus is trapped', () => {
    const trapped = render(
      <Overlay open onDismiss={() => {}} focus="trap" role="dialog" position={{ kind: 'centered' }}>x</Overlay>,
    );
    expect(trapped.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    trapped.unmount();

    function Harness() {
      const anchor = useRef<HTMLButtonElement>(null);
      return (
        <div>
          <button ref={anchor}>t</button>
          <Overlay open onDismiss={() => {}} focus="none" role="dialog" position={{ kind: 'anchored', anchor }}>x</Overlay>
        </div>
      );
    }
    const nonModal = render(<Harness />);
    expect(nonModal.getByRole('dialog').getAttribute('aria-modal')).toBeNull();
  });

  it('focuses initialFocus on open when focus is "auto"', () => {
    function Harness() {
      const input = useRef<HTMLInputElement>(null);
      return (
        <Overlay open onDismiss={() => {}} focus="auto" initialFocus={input} position={{ kind: 'centered' }}>
          <button>first</button>
          <input ref={input} aria-label="search" />
        </Overlay>
      );
    }
    render(<Harness />);
    expect((document.activeElement as HTMLElement).getAttribute('aria-label')).toBe('search');
  });

  it('anchored: dismisses on outside pointerdown but ignores the trigger', async () => {
    const onDismiss = vi.fn();
    function Harness() {
      const anchor = useRef<HTMLButtonElement>(null);
      return (
        <div>
          <button ref={anchor} data-testid="trigger">t</button>
          <Overlay open onDismiss={onDismiss} ignore={anchor} position={{ kind: 'anchored', anchor }}>
            content
          </Overlay>
          <button data-testid="outside">o</button>
        </div>
      );
    }
    const { getByTestId } = render(<Harness />);
    await flushTimers();
    fireEvent.pointerDown(getByTestId('trigger'));
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.pointerDown(getByTestId('outside'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
