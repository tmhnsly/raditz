import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Popover.stories';
import { Popover } from './Popover';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Popover', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

// Let useDismiss's deferred (setTimeout 0) outside-pointerdown listener attach.
function flushTimers(): Promise<void> {
  return act(async () => {
    await new Promise((r) => setTimeout(r, 1));
  });
}

describe('Popover (behaviour)', () => {
  it('trigger click toggles the panel', () => {
    render(<Popover trigger={<button>Open</button>}>panel content</Popover>);
    expect(screen.queryByText('panel content')).toBeNull();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('panel content')).toBeTruthy();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.queryByText('panel content')).toBeNull();
  });

  it('outside pointerdown dismisses; the trigger itself is ignored', async () => {
    render(
      <div>
        <button>outside</button>
        <Popover trigger={<button>Open</button>} defaultOpen>panel content</Popover>
      </div>,
    );
    expect(screen.getByText('panel content')).toBeTruthy();
    await flushTimers();
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(screen.queryByText('panel content')).toBeNull();
  });

  it('Escape dismisses and reports through onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<Popover trigger={<button>Open</button>} defaultOpen onOpenChange={onOpenChange}>panel content</Popover>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('panel content')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('controlled: trigger click requests a change without opening by itself', () => {
    const onOpenChange = vi.fn();
    render(<Popover trigger={<button>Open</button>} open={false} onOpenChange={onOpenChange}>panel content</Popover>);
    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('panel content')).toBeNull();
  });
});
