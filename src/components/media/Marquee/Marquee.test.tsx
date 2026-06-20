import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('duplicates its children for a seamless loop (one copy hidden from a11y)', () => {
    const { container, getAllByText } = render(
      <Marquee>
        <span>Northwind</span>
        <span>ACME</span>
      </Marquee>,
    );
    // two groups: the real one + an aria-hidden duplicate
    expect(container.querySelectorAll('.rdz-marquee__group')).toHaveLength(2);
    expect(container.querySelector('.rdz-marquee__group[aria-hidden="true"]')).not.toBeNull();
    // each item therefore appears twice
    expect(getAllByText('Northwind')).toHaveLength(2);
  });

  it('exposes duration/gap/direction as custom properties', () => {
    const { container } = render(<Marquee duration={10} direction="right">x</Marquee>);
    const el = container.querySelector('.rdz-marquee') as HTMLElement;
    expect(el.style.getPropertyValue('--rdz-marquee-duration')).toBe('10s');
    expect(el.style.getPropertyValue('--rdz-marquee-dir')).toBe('reverse');
  });
});
