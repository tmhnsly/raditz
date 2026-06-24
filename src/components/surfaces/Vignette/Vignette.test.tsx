import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Vignette } from './Vignette';

describe('Vignette', () => {
  it('renders the scene in the chosen background treatment', () => {
    const { container } = render(<Vignette bg="secondary" scene={<svg data-testid="scene" />} />);
    expect(container.querySelector('.rdz-vignette--secondary')).toBeTruthy();
    expect(container.querySelector('[data-testid="scene"]')).toBeTruthy();
  });
});
