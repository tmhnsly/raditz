import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './AlertDialog.stories';
import { AlertDialog } from './AlertDialog';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('AlertDialog', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('AlertDialog (behaviour)', () => {
  it('renders only while open (controlled)', () => {
    const { rerender } = render(<AlertDialog open={false} title="Sure?" />);
    expect(screen.queryByRole('alertdialog')).toBeNull();
    rerender(<AlertDialog open title="Sure?" />);
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('defaultOpen works uncontrolled', () => {
    render(<AlertDialog defaultOpen title="Sure?" />);
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('confirm fires onAction and then closes', () => {
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(<AlertDialog defaultOpen title="Sure?" onAction={onAction} onOpenChange={onOpenChange} actionText="Delete" />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('cancel closes without firing onAction', () => {
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(<AlertDialog defaultOpen title="Sure?" onAction={onAction} onOpenChange={onOpenChange} cancelText="Keep" />);
    fireEvent.click(screen.getByText('Keep'));
    expect(onAction).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('does NOT dismiss on scrim click (its documented contract)', () => {
    const onOpenChange = vi.fn();
    render(<AlertDialog defaultOpen title="Sure?" onOpenChange={onOpenChange} />);
    const scrim = document.querySelector('.rdz-overlay__scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as Element);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('Escape cancels (closes when uncontrolled)', () => {
    const onOpenChange = vi.fn();
    render(<AlertDialog defaultOpen title="Sure?" onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('moves focus into the panel on open (focus trap)', () => {
    render(<AlertDialog defaultOpen title="Sure?" />);
    const panel = screen.getByRole('alertdialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.contains(document.activeElement)).toBe(true);
  });
});
