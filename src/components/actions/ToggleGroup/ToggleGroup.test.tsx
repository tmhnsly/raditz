import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './ToggleGroup.stories';
import { ToggleGroup } from './ToggleGroup';
import type { ToggleGroupItem } from './ToggleGroup';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('ToggleGroup', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const ITEMS: ToggleGroupItem[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

describe('ToggleGroup — single (radio semantics)', () => {
  it('renders a radiogroup and selecting one deselects the other', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ToggleGroup type="single" items={ITEMS} defaultValue="left" onValueChange={onValueChange} />);

    expect(screen.getByRole('radiogroup')).toBeTruthy();
    const left = screen.getByRole('radio', { name: 'Left' });
    const center = screen.getByRole('radio', { name: 'Center' });
    expect(left.getAttribute('aria-checked')).toBe('true');

    await user.click(center);
    expect(onValueChange).toHaveBeenLastCalledWith('center');
    expect(center.getAttribute('aria-checked')).toBe('true');
    expect(left.getAttribute('aria-checked')).toBe('false');
  });

  it('clicking the selected item deselects it (toggle-able radio)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ToggleGroup type="single" items={ITEMS} defaultValue="left" onValueChange={onValueChange} />);
    const left = screen.getByRole('radio', { name: 'Left' });

    await user.click(left);
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(left.getAttribute('aria-checked')).toBe('false');
  });

  it('only the active item is in the tab order; arrows rove focus + selection and loop', async () => {
    const user = userEvent.setup();
    render(<ToggleGroup type="single" items={ITEMS} defaultValue="center" />);
    const [left, center, right] = ['Left', 'Center', 'Right'].map((n) => screen.getByRole('radio', { name: n }));

    expect(center.tabIndex).toBe(0);
    expect(left.tabIndex).toBe(-1);
    expect(right.tabIndex).toBe(-1);

    await user.tab();
    expect(document.activeElement).toBe(center);

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(right);
    expect(right.getAttribute('aria-checked')).toBe('true');

    await user.keyboard('{ArrowRight}'); // loops past the end
    expect(document.activeElement).toBe(left);
    expect(left.getAttribute('aria-checked')).toBe('true');

    await user.keyboard('{ArrowLeft}'); // and back
    expect(document.activeElement).toBe(right);
    expect(right.getAttribute('aria-checked')).toBe('true');
  });
});

describe('ToggleGroup — multiple', () => {
  it('items toggle independently with aria-pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ToggleGroup type="multiple" items={ITEMS} onValueChange={onValueChange} />);

    expect(screen.getByRole('group')).toBeTruthy();
    expect(screen.queryByRole('radio')).toBeNull();
    const left = screen.getByRole('button', { name: 'Left' });
    const right = screen.getByRole('button', { name: 'Right' });
    expect(left.getAttribute('aria-pressed')).toBe('false');

    await user.click(left);
    await user.click(right);
    expect(left.getAttribute('aria-pressed')).toBe('true');
    expect(right.getAttribute('aria-pressed')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith(['left', 'right']);

    await user.click(left);
    expect(left.getAttribute('aria-pressed')).toBe('false');
    expect(right.getAttribute('aria-pressed')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith(['right']);
  });
});

describe('ToggleGroup — disabled', () => {
  it('a group-level disabled disables every item; clicks change nothing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ToggleGroup type="single" items={ITEMS} disabled onValueChange={onValueChange} />);

    const radios = screen.getAllByRole('radio') as HTMLButtonElement[];
    radios.forEach((r) => expect(r.disabled).toBe(true));
    await user.click(radios[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('a disabled item is skipped for selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const items: ToggleGroupItem[] = [ITEMS[0], { value: 'center', label: 'Center', disabled: true }, ITEMS[2]];
    render(<ToggleGroup type="single" items={items} defaultValue="left" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: 'Center' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Left' }).getAttribute('aria-checked')).toBe('true');
  });
});
