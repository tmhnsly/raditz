import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Legend } from './Legend';
import * as stories from './Legend.stories';

const composed = composeStories(stories);

describe('Legend (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Legend', () => {
  it('renders one list item per series with a label', () => {
    render(<Legend items={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('flows the swatch colour through the --rdz-legend-color custom property', () => {
    const { container } = render(<Legend items={[{ label: 'A', color: 'var(--danger)' }]} />);
    const swatch = container.querySelector('.rdz-legend__swatch') as HTMLElement;
    expect(swatch.style.getPropertyValue('--rdz-legend-color')).toBe('var(--danger)');
  });

  it('defaults the swatch shape to dot and honours an override', () => {
    const { container } = render(<Legend items={[{ label: 'A' }, { label: 'B', shape: 'square' }]} />);
    const swatches = container.querySelectorAll('.rdz-legend__swatch');
    expect(swatches[0].getAttribute('data-shape')).toBe('dot');
    expect(swatches[1].getAttribute('data-shape')).toBe('square');
  });

  it('forwards className and size to the root list', () => {
    const { container } = render(<Legend className="custom" size="sm" items={[{ label: 'A' }]} />);
    const root = container.querySelector('ul');
    expect(root?.classList.contains('rdz-legend')).toBe(true);
    expect(root?.classList.contains('custom')).toBe(true);
    expect(root?.getAttribute('data-size')).toBe('sm');
  });
});
