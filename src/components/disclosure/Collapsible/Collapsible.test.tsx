import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Collapsible.stories';
import { Collapsible } from './Collapsible';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Collapsible', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Collapsible — behaviour', () => {
  it('toggles aria-expanded and panel hidden-ness on click', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible trigger="Details" onOpenChange={onOpenChange}>
        Hidden treasure
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Details' });
    const panel = screen.getByText('Hidden treasure');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('defaultOpen starts expanded (uncontrolled)', () => {
    render(
      <Collapsible trigger="Details" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(screen.getByRole('button', { name: 'Details' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Content').hidden).toBe(false);
  });

  it('controlled: reports onOpenChange but renders from the open prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible trigger="Details" open={false} onOpenChange={onOpenChange}>
        Content
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Details' });

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false'); // parent hasn't updated yet

    rerender(
      <Collapsible trigger="Details" open onOpenChange={onOpenChange}>
        Content
      </Collapsible>,
    );
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Content').hidden).toBe(false);
  });

  it('disabled: the trigger is disabled and the panel stays closed', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible trigger="Details" disabled>
        Content
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Details' }) as HTMLButtonElement;

    expect(trigger.disabled).toBe(true);
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
