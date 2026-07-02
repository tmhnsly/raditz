// Smoke test for the fake-timer shim in vitest.setup.ts: @testing-library/react's
// asyncWrapper drains the microtask queue with a setTimeout(0) it only auto-
// advances via a `jest` global. Without the shim, EVERY awaited userEvent call
// under `vi.useFakeTimers()` hangs forever — a silent suite stall with no
// pointing failure. This test converts that hang into a named failure (the test
// times out here, by name) the moment the shim or RTL's behaviour regresses.
import { it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

afterEach(() => {
  vi.useRealTimers();
});

it('an awaited userEvent click resolves under vi.useFakeTimers()', async () => {
  vi.useFakeTimers();
  const onClick = vi.fn();
  render(
    <button type="button" onClick={onClick}>
      go
    </button>,
  );
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  await user.click(screen.getByRole('button', { name: 'go' }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
