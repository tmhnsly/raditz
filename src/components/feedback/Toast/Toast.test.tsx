import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Toast.stories';
import { Toast } from './Toast';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Toast', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Toast — behaviour', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Toast.show(string) renders a polite status toast with that title', () => {
    vi.useFakeTimers();
    render(<Toast />);
    act(() => Toast.show('Saved'));

    const toast = screen.getByRole('status');
    expect(toast.textContent).toContain('Saved');
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });

  it("auto-dismisses after the viewport's default duration", () => {
    vi.useFakeTimers();
    render(<Toast duration={4000} />);
    act(() => Toast.show('Bye soon'));

    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByRole('status')).toBeTruthy();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('a per-toast duration overrides the viewport default', () => {
    vi.useFakeTimers();
    render(<Toast duration={4000} />);
    act(() => Toast.show({ title: 'Quick', duration: 1000 }));

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('duration: Infinity persists', () => {
    vi.useFakeTimers();
    render(<Toast duration={4000} />);
    act(() => Toast.show({ title: 'Sticky', duration: Infinity }));

    act(() => vi.advanceTimersByTime(600_000));
    expect(screen.getByRole('status').textContent).toContain('Sticky');
  });

  it('stacks multiple toasts and dismisses each on its own clock', () => {
    vi.useFakeTimers();
    render(<Toast duration={4000} />);
    act(() => Toast.show({ title: 'First', duration: 1000 }));
    act(() => Toast.show({ title: 'Second', duration: 3000 }));

    expect(screen.getAllByRole('status')).toHaveLength(2);

    act(() => vi.advanceTimersByTime(1000)); // first expires
    const remaining = screen.getAllByRole('status');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].textContent).toContain('Second');

    act(() => vi.advanceTimersByTime(2000)); // second expires
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('the action button fires its callback and dismisses the toast', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    const onClick = vi.fn();
    render(<Toast />);
    act(() => Toast.show({ title: 'Deleted', action: { label: 'Undo', onClick }, duration: Infinity }));

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('the close button dismisses the toast', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    render(<Toast />);
    act(() => Toast.show({ title: 'Closable', duration: Infinity }));

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).toBeNull();
  });
});
