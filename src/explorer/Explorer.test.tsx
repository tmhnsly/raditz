/// <reference types="vite/client" />
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import Explorer from './Explorer';

describe('Explorer', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the overview with the four top-level groups in the navigation tree', () => {
    render(<Explorer />);
    const tree = screen.getByRole('tree', { name: /showcase navigation/i });
    for (const group of ['Pages', 'Sections', 'Foundations', 'Components']) {
      expect(within(tree).getByText(group)).toBeTruthy();
    }
  });

  it('renders the whole system on one page; nav links deep-link via the hash', () => {
    render(<Explorer />);
    const tree = screen.getByRole('tree', { name: /showcase navigation/i });

    // Everything is on one page, so the Button section is already present.
    expect(screen.getByRole('heading', { name: 'Button' })).toBeTruthy();

    // Drill in: Components → Controls → Button (file-browser: click folders to open).
    fireEvent.click(within(tree).getByText('Components').closest('[role="treeitem"]')!);
    fireEvent.click(within(tree).getByText('Controls').closest('[role="treeitem"]')!);
    fireEvent.click(within(tree).getByText('Button').closest('[role="treeitem"]')!);

    // The link updates the hash (for deep-linking + scroll), not what's rendered.
    expect(window.location.hash).toBe('#/components/controls/button');
  });
});
