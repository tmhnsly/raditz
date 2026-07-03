import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './CopyButton.stories';
import { CopyButton } from './CopyButton';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('CopyButton', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('CopyButton — behaviour', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);

  // Installed AFTER userEvent.setup() — setup() stubs navigator.clipboard
  // itself, and would silently shadow a mock installed before it.
  const mockClipboard = (value: { writeText: typeof writeText } | undefined) => {
    Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
  };

  beforeEach(() => {
    writeText.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('writes `value` to the clipboard on click', async () => {
    const user = userEvent.setup();
    mockClipboard({ writeText });
    render(<CopyButton value="pnpm add raditz" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('pnpm add raditz');
  });

  it('shows the copied state, announces it politely, then reverts after the delay', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    mockClipboard({ writeText });
    render(<CopyButton value="hello" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    const btn = screen.getByRole('button', { name: 'Copied' });
    expect(btn.getAttribute('data-copied')).not.toBeNull();
    expect(btn.querySelector('[aria-live="polite"]')?.textContent).toBe('Copied');

    // Just before the revert point the confirmation still shows…
    act(() => vi.advanceTimersByTime(1599));
    expect(btn.getAttribute('data-copied')).not.toBeNull();

    // …and at it, the button reverts to its idle label.
    act(() => vi.advanceTimersByTime(1));
    expect(btn.getAttribute('data-copied')).toBeNull();
    expect(screen.getByRole('button', { name: 'Copy' })).toBe(btn);
  });

  it('honours custom label / copiedLabel and renders children beside the icon', async () => {
    const user = userEvent.setup();
    mockClipboard({ writeText });
    render(<CopyButton value="x" label="Copy link" copiedLabel="Link copied">Copy link</CopyButton>);

    const btn = screen.getByRole('button', { name: 'Copy link' });
    expect(btn.getAttribute('title')).toBe('Copy link');

    await user.click(btn);
    expect(screen.getByRole('button', { name: 'Link copied' })).toBe(btn);
  });

  it('falls back to a textarea + execCommand when the Clipboard API is missing', async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand as typeof document.execCommand;

    const user = userEvent.setup();
    mockClipboard(undefined);
    render(<CopyButton value="fallback" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
  });

  it('clears the revert timer on unmount (no state updates after unmount)', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    mockClipboard({ writeText });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = render(<CopyButton value="bye" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    unmount();
    act(() => vi.advanceTimersByTime(5000));

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
