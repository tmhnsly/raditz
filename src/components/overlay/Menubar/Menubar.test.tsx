import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Menubar.stories';
import { Menubar } from './Menubar';
import type { MenubarMenu } from './Menubar';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Menubar', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const menus = (onSelect?: () => void): MenubarMenu[] => [
  { label: 'File', items: [{ label: 'New', onSelect }, { label: 'Open' }] },
  { label: 'Edit', items: [{ label: 'Undo' }, { label: 'Redo' }] },
  { label: 'View', items: [{ label: 'Zoom in' }] },
];

const trigger = (label: string): HTMLElement =>
  screen.getAllByRole('menuitem').find((el) => el.textContent === label && el.tagName === 'BUTTON' && el.className.includes('rdz-menubar__trigger'))!;

describe('Menubar (behaviour)', () => {
  it('clicking a trigger opens its menu (aria-expanded + role=menu)', () => {
    render(<Menubar menus={menus()} />);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(trigger('File'));
    expect(trigger('File').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('arrow keys rove the open menu items; click selects and closes', () => {
    const onSelect = vi.fn();
    render(<Menubar menus={menus(onSelect)} />);
    fireEvent.click(trigger('File'));
    expect((document.activeElement as HTMLElement).textContent).toBe('New');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect((document.activeElement as HTMLElement).textContent).toBe('Open');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    fireEvent.click(screen.getByText('New'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    // Focus returns to the menu's trigger after selection.
    expect(document.activeElement).toBe(trigger('File'));
  });

  it('ArrowRight / ArrowLeft move between menus while one is open (with wrap)', () => {
    render(<Menubar menus={menus()} />);
    fireEvent.click(trigger('File'));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
    expect(trigger('File').getAttribute('aria-expanded')).toBe('false');
    expect(trigger('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Undo')).toBeTruthy();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' });
    expect(trigger('File').getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' });
    expect(trigger('View').getAttribute('aria-expanded')).toBe('true'); // wrapped
  });

  it('ArrowRight moves focus between triggers when no menu is open', () => {
    render(<Menubar menus={menus()} />);
    trigger('File').focus();
    fireEvent.keyDown(trigger('File'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(trigger('Edit'));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Escape closes the open menu and returns focus to its trigger', () => {
    render(<Menubar menus={menus()} />);
    fireEvent.click(trigger('Edit'));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger('Edit'));
  });

  it('controlled: open renders that menu; interactions report through onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<Menubar menus={menus()} open={1} onOpenChange={onOpenChange} />);
    expect(trigger('Edit').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Undo')).toBeTruthy();
    fireEvent.click(trigger('Edit'));
    expect(onOpenChange).toHaveBeenCalledWith(-1);
    expect(trigger('Edit').getAttribute('aria-expanded')).toBe('true'); // parent owns it
  });

  it('defaultOpen opens a menu uncontrolled', () => {
    render(<Menubar menus={menus()} defaultOpen={0} />);
    expect(trigger('File').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('New')).toBeTruthy();
  });
});
