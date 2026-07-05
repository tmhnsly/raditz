import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { Input } from '../Input';
import * as stories from './Fieldset.stories';

const composed = composeStories(stories);

describe('Fieldset (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Fieldset', () => {
  it('names the group with a real <legend> and renders the hint', () => {
    const { container } = render(<Fieldset legend="Address" hint="Where to ship"><Input aria-label="x" /></Fieldset>);
    const group = screen.getByRole('group', { name: 'Address' });
    expect(group.tagName).toBe('FIELDSET');
    const legend = container.querySelector('legend');
    expect(legend?.parentElement?.tagName).toBe('FIELDSET'); // direct child — required to label
    expect(screen.getByText('Where to ship')).toBeTruthy();
  });

  it('carries the disabled attribute (the browser cascades it to inner controls)', () => {
    // The actual control-disabling is the native `<fieldset disabled>` cascade —
    // a browser behaviour jsdom doesn't model, so assert the source of truth.
    const { container } = render(<Fieldset legend="Billing" disabled><Input aria-label="card" /></Fieldset>);
    expect((container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(true);
  });

  it('forwards className/rest to the fieldset', () => {
    const { container } = render(<Fieldset className="c" id="f"><Input aria-label="x" /></Fieldset>);
    const fs = container.querySelector('fieldset') as HTMLElement;
    expect(fs.classList.contains('rdz-fieldset')).toBe(true);
    expect(fs.classList.contains('c')).toBe(true);
    expect(fs.id).toBe('f');
  });
});
