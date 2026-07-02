import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Accordion.stories';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Accordion', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const ITEMS: AccordionItem[] = [
  { value: 'a', title: 'Alpha', content: 'Alpha content' },
  { value: 'b', title: 'Beta', content: 'Beta content' },
  { value: 'c', title: 'Gamma', content: 'Gamma content' },
];

const trigger = (name: string): HTMLButtonElement =>
  screen.getByRole('button', { name }) as HTMLButtonElement;
const expanded = (name: string): boolean => trigger(name).getAttribute('aria-expanded') === 'true';

describe('Accordion — behaviour', () => {
  it('clicking a trigger opens its panel (aria-expanded + aria-controls wiring)', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} />);
    expect(expanded('Alpha')).toBe(false);

    await user.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe(true);

    const panel = document.getElementById(trigger('Alpha').getAttribute('aria-controls')!)!;
    expect(panel.textContent).toContain('Alpha content');
    expect(panel.getAttribute('role')).toBe('region');
  });

  it('single mode: opening one item closes the other', async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" items={ITEMS} defaultValue="a" />);
    expect(expanded('Alpha')).toBe(true);

    await user.click(trigger('Beta'));
    expect(expanded('Beta')).toBe(true);
    expect(expanded('Alpha')).toBe(false);
  });

  it('single + collapsible (default): clicking the open item closes it', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} defaultValue="a" />);

    await user.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe(false);
  });

  it('single + collapsible={false}: the open item cannot be closed by clicking it', async () => {
    const user = userEvent.setup();
    render(<Accordion collapsible={false} items={ITEMS} defaultValue="a" />);

    await user.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe(true);
  });

  it('multiple mode: items open and close independently', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Accordion type="multiple" items={ITEMS} onValueChange={onValueChange} />);

    await user.click(trigger('Alpha'));
    await user.click(trigger('Beta'));
    expect(expanded('Alpha')).toBe(true);
    expect(expanded('Beta')).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);

    await user.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe(false);
    expect(expanded('Beta')).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(['b']);
  });

  it('controlled: reports onValueChange but renders from the value prop', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Accordion items={ITEMS} value="a" onValueChange={onValueChange} />);

    await user.click(trigger('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(expanded('Beta')).toBe(false); // parent hasn't accepted it yet
    expect(expanded('Alpha')).toBe(true);

    rerender(<Accordion items={ITEMS} value="b" onValueChange={onValueChange} />);
    expect(expanded('Beta')).toBe(true);
    expect(expanded('Alpha')).toBe(false);
  });

  it('a disabled item cannot be toggled', async () => {
    const user = userEvent.setup();
    const items: AccordionItem[] = [...ITEMS.slice(0, 2), { value: 'c', title: 'Gamma', content: 'Gamma content', disabled: true }];
    render(<Accordion items={items} />);

    expect(trigger('Gamma').disabled).toBe(true);
    await user.click(trigger('Gamma'));
    expect(expanded('Gamma')).toBe(false);
  });
});
