import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Tabs, type TabItem } from './Tabs';
import * as stories from './Tabs.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Tabs (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const items: TabItem[] = [
  { value: 'one', label: 'One', panelId: 'panel-one' },
  { value: 'two', label: 'Two', panelId: 'panel-two' },
  { value: 'three', label: 'Three', panelId: 'panel-three' },
];

const tab = (name: string): HTMLElement => screen.getByRole('tab', { name });
const selected = (name: string): boolean => tab(name).getAttribute('aria-selected') === 'true';

/** Consumer-style wiring: Tabs bar + one visible panel labelled by its tab. */
function WithPanels(): ReactElement {
  const [value, setValue] = useState('one');
  const active = items.find((it) => it.value === value)!;
  return (
    <>
      <Tabs tabs={items} value={value} onValueChange={setValue} />
      <div role="tabpanel" id={active.panelId} aria-labelledby={`${active.panelId}-tab`}>
        {active.value} panel
      </div>
    </>
  );
}

describe('Tabs (behaviour)', () => {
  it('clicking a tab moves aria-selected and swaps the visible panel', () => {
    render(<WithPanels />);
    expect(selected('One')).toBe(true);
    expect(screen.getByRole('tabpanel').textContent).toContain('one panel');

    fireEvent.click(tab('Two'));
    expect(selected('Two')).toBe(true);
    expect(selected('One')).toBe(false);
    const panel = screen.getByRole('tabpanel');
    expect(panel.textContent).toContain('two panel');
    // aria-controls / aria-labelledby wiring
    expect(tab('Two').getAttribute('aria-controls')).toBe('panel-two');
    expect(panel.getAttribute('aria-labelledby')).toBe(tab('Two').id);
  });

  it('arrow keys rove focus AND selection (automatic activation), with wrap', () => {
    render(<Tabs tabs={items} defaultValue="one" />);
    tab('One').focus();

    fireEvent.keyDown(tab('One'), { key: 'ArrowRight' });
    expect(selected('Two')).toBe(true);
    expect(document.activeElement).toBe(tab('Two'));

    fireEvent.keyDown(tab('Two'), { key: 'ArrowLeft' });
    expect(selected('One')).toBe(true);
    expect(document.activeElement).toBe(tab('One'));

    // wraps past the start
    fireEvent.keyDown(tab('One'), { key: 'ArrowLeft' });
    expect(selected('Three')).toBe(true);
    expect(document.activeElement).toBe(tab('Three'));
  });

  it('Home/End jump to the first/last tab', () => {
    render(<Tabs tabs={items} defaultValue="two" />);
    fireEvent.keyDown(tab('Two'), { key: 'End' });
    expect(selected('Three')).toBe(true);
    expect(document.activeElement).toBe(tab('Three'));

    fireEvent.keyDown(tab('Three'), { key: 'Home' });
    expect(selected('One')).toBe(true);
    expect(document.activeElement).toBe(tab('One'));
  });

  it('keeps a roving tabIndex: only the selected tab is a tab stop', () => {
    render(<Tabs tabs={items} defaultValue="two" />);
    expect(tab('Two').tabIndex).toBe(0);
    expect(tab('One').tabIndex).toBe(-1);
    expect(tab('Three').tabIndex).toBe(-1);

    fireEvent.click(tab('Three'));
    expect(tab('Three').tabIndex).toBe(0);
    expect(tab('Two').tabIndex).toBe(-1);
  });

  it('controlled: fires onValueChange but does not move selection itself', () => {
    const onValueChange = vi.fn();
    render(<Tabs tabs={items} value="one" onValueChange={onValueChange} />);
    fireEvent.click(tab('Two'));
    expect(onValueChange).toHaveBeenCalledWith('two');
    expect(selected('One')).toBe(true); // parent owns the value
  });

  it('uncontrolled: defaultValue selects initially, clicks update', () => {
    render(<Tabs tabs={items} defaultValue="two" />);
    expect(selected('Two')).toBe(true);
    fireEvent.click(tab('Three'));
    expect(selected('Three')).toBe(true);
  });

  it('passes through id/data-* and merges className on the root', () => {
    render(<Tabs tabs={items} id="my-tabs" data-testid="tabs-root" className="extra" />);
    const root = screen.getByTestId('tabs-root');
    expect(root.id).toBe('my-tabs');
    expect(root.getAttribute('role')).toBe('tablist');
    expect(root.classList.contains('rdz-tabs')).toBe(true);
    expect(root.classList.contains('extra')).toBe(true);
  });
});
