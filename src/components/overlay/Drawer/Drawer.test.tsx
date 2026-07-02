import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Drawer.stories';
import { Drawer } from './Drawer';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Drawer', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Drawer (behaviour)', () => {
  it('renders only while open (controlled)', () => {
    const { rerender } = render(<Drawer open={false} title="Panel">content</Drawer>);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<Drawer open title="Panel">content</Drawer>);
    expect(screen.getByRole('dialog').textContent).toContain('content');
  });

  it('defaultOpen works uncontrolled: open at mount, close button closes it', () => {
    render(<Drawer defaultOpen title="Panel">content</Drawer>);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape requests close via onOpenChange(false) without closing a controlled drawer', () => {
    const onOpenChange = vi.fn();
    render(<Drawer open onOpenChange={onOpenChange} title="Panel">content</Drawer>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('Escape closes an uncontrolled drawer', () => {
    render(<Drawer defaultOpen title="Panel">content</Drawer>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('scrim click closes an uncontrolled drawer', () => {
    render(<Drawer defaultOpen title="Panel">content</Drawer>);
    const scrim = document.querySelector('.rdz-overlay__scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim as Element);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('carries the side on the panel as data-side (resolved default and explicit)', () => {
    const { rerender } = render(<Drawer open title="Panel">content</Drawer>);
    expect(screen.getByRole('dialog').getAttribute('data-side')).toBe('right');
    rerender(<Drawer open side="bottom" title="Panel">content</Drawer>);
    expect(screen.getByRole('dialog').getAttribute('data-side')).toBe('bottom');
  });

  it('moves focus into the panel on open (focus trap) and marks it modal', () => {
    render(<Drawer defaultOpen title="Panel"><button>inside</button></Drawer>);
    const panel = screen.getByRole('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.contains(document.activeElement)).toBe(true);
  });
});
