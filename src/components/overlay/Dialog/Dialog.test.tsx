import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Dialog.stories';
import { Dialog } from './Dialog';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Dialog', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Dialog (behaviour)', () => {
  it('renders only while open (controlled)', () => {
    const { rerender } = render(<Dialog open={false} title="Hi">body</Dialog>);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<Dialog open title="Hi">body</Dialog>);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('dialog').textContent).toContain('body');
  });

  it('defaultOpen works uncontrolled: open at mount, close button closes it', () => {
    render(<Dialog defaultOpen title="Hi">body</Dialog>);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape requests close via onOpenChange(false) without closing a controlled dialog', () => {
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} title="Hi">body</Dialog>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Controlled: still open until the parent flips `open`.
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('Escape closes an uncontrolled dialog (and reports through onOpenChange)', () => {
    const onOpenChange = vi.fn();
    render(<Dialog defaultOpen onOpenChange={onOpenChange} title="Hi">body</Dialog>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('moves focus into the panel on open (focus trap) and marks it modal', () => {
    render(
      <Dialog defaultOpen title="Hi" footer={<button>OK</button>}>body</Dialog>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.contains(document.activeElement)).toBe(true);
  });

  it('labels the panel from title and description', () => {
    render(<Dialog defaultOpen title="My title" description="My desc">body</Dialog>);
    const panel = screen.getByRole('dialog');
    const labelledby = panel.getAttribute('aria-labelledby');
    const describedby = panel.getAttribute('aria-describedby');
    expect(document.getElementById(labelledby!)?.textContent).toBe('My title');
    expect(document.getElementById(describedby!)?.textContent).toBe('My desc');
  });
});
