import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionActionButton, SectionHeader, SectionShell } from './SectionShell';

describe('SectionShell choreography', () => {
  it('wraps content in the .s-choreo cascade by default, and not when animate={false}', () => {
    const { container, rerender } = render(<SectionShell><p>body</p></SectionShell>);
    expect(container.querySelector('.s-wrap.s-choreo')).toBeTruthy();
    rerender(<SectionShell animate={false}><p>body</p></SectionShell>);
    expect(container.querySelector('.s-wrap.s-choreo')).toBeNull();
    expect(container.querySelector('.s-wrap')).toBeTruthy();
  });
});

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
