import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './BottomSheet.stories';
import { BottomSheet, shouldCloseFromDrag } from './BottomSheet';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('BottomSheet', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('shouldCloseFromDrag', () => {
  it('closes once the drag passes 25% of the sheet height', () => {
    expect(shouldCloseFromDrag(126, 500)).toBe(true);
    expect(shouldCloseFromDrag(400, 500)).toBe(true);
  });

  it('settles back at or under the 25% threshold', () => {
    expect(shouldCloseFromDrag(125, 500)).toBe(false); // exactly 25% is not past it
    expect(shouldCloseFromDrag(10, 500)).toBe(false);
    expect(shouldCloseFromDrag(0, 500)).toBe(false);
  });

  it('never closes for a zero or unmeasured height', () => {
    expect(shouldCloseFromDrag(100, 0)).toBe(false);
    expect(shouldCloseFromDrag(100, -1)).toBe(false);
  });
});

describe('BottomSheet (behaviour)', () => {
  it('renders only while open (controlled)', () => {
    const { rerender } = render(<BottomSheet open={false} title="Sheet">content</BottomSheet>);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<BottomSheet open title="Sheet">content</BottomSheet>);
    expect(screen.getByRole('dialog').textContent).toContain('content');
  });

  it('defaultOpen works uncontrolled: open at mount, close button closes it', () => {
    render(<BottomSheet defaultOpen title="Sheet">content</BottomSheet>);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape requests close via onOpenChange(false) without closing a controlled sheet', () => {
    const onOpenChange = vi.fn();
    render(<BottomSheet open onOpenChange={onOpenChange} title="Sheet">content</BottomSheet>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('Escape closes an uncontrolled sheet', () => {
    render(<BottomSheet defaultOpen title="Sheet">content</BottomSheet>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('scrim click closes an uncontrolled sheet', () => {
    render(<BottomSheet defaultOpen title="Sheet">content</BottomSheet>);
    const scrim = document.querySelector('.rdz-overlay__scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as Element);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('wires aria-labelledby / aria-describedby to the rendered title and description', () => {
    render(
      <BottomSheet defaultOpen title="Sheet title" description="Sheet description">
        content
      </BottomSheet>,
    );
    const panel = screen.getByRole('dialog');
    const labelledby = panel.getAttribute('aria-labelledby');
    const describedby = panel.getAttribute('aria-describedby');
    expect(labelledby).toBeTruthy();
    expect(describedby).toBeTruthy();
    expect(document.getElementById(labelledby as string)?.textContent).toBe('Sheet title');
    expect(document.getElementById(describedby as string)?.textContent).toBe('Sheet description');
  });

  it('omits aria refs and floats a solo close button when title-less', () => {
    render(<BottomSheet defaultOpen>content</BottomSheet>);
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('aria-labelledby')).toBeNull();
    expect(panel.getAttribute('aria-describedby')).toBeNull();
    expect(panel.querySelector('.rdz-sheet__close--solo')).not.toBeNull();
  });

  it('carries the height variant on the panel as data-height (resolved default and explicit)', () => {
    const { rerender } = render(<BottomSheet open title="Sheet">content</BottomSheet>);
    expect(screen.getByRole('dialog').getAttribute('data-height')).toBe('auto');
    rerender(<BottomSheet open height="tall" title="Sheet">content</BottomSheet>);
    expect(screen.getByRole('dialog').getAttribute('data-height')).toBe('tall');
  });

  it('moves focus into the panel on open (focus trap) and marks it modal', () => {
    render(<BottomSheet defaultOpen title="Sheet"><button>inside</button></BottomSheet>);
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.contains(document.activeElement)).toBe(true);
  });

  it('renders the grab handle and footer', () => {
    render(<BottomSheet defaultOpen title="Sheet" footer={<button>Done</button>}>content</BottomSheet>);
    const panel = screen.getByRole('dialog');
    expect(panel.querySelector('.rdz-sheet__grab')).not.toBeNull();
    expect(panel.querySelector('.rdz-sheet__footer')?.textContent).toContain('Done');
  });
});
