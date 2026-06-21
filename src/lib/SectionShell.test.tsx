import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionActionButton, SectionHeader } from './SectionShell';

describe('SectionActionButton', () => {
  it('forwards every SectionAction field (href, onClick, icon, variant, size)', () => {
    const onClick = vi.fn();
    render(<SectionActionButton action={{ label: 'Go', href: '/x', onClick, icon: 'arrow-right', variant: 'soft', size: 'lg' }} />);
    const el = screen.getByText('Go').closest('a, button')!;
    expect(el.getAttribute('href')).toBe('/x');
    fireEvent.click(el); expect(onClick).toHaveBeenCalled();
  });
  it('applies defaultVariant only when the action omits variant', () => {
    const { rerender } = render(<SectionActionButton action={{ label: 'A' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.className).toContain('rdz-btn--outline');
    rerender(<SectionActionButton action={{ label: 'A', variant: 'primary' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.className).toContain('rdz-btn--primary');
  });
});

describe('SectionHeader', () => {
  it('renders null when empty, eyebrow+heading when given', () => {
    const { container, rerender } = render(<SectionHeader />);
    expect(container.firstChild).toBeNull();
    rerender(<SectionHeader eyebrow="Why" heading="Wired" />);
    expect(screen.getByText('Why')).toBeTruthy();
    expect(screen.getByText('Wired')).toBeTruthy();
  });
});
