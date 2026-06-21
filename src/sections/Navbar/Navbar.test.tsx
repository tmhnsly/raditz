import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Navbar.stories';
import { NavbarA, NavbarD } from './Navbar';

const composed = composeStories(stories);

describe('Navbar (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('NavbarA renders brand, links and actions in the bar', () => {
    render(
      <NavbarA
        brand={{ name: 'Raditz', logo: <span>R</span> }}
        links={[
          { label: 'Product', href: '/product' },
          { label: 'Pricing', href: '/pricing' },
        ]}
        actions={[
          { label: 'Sign in', href: '/login', variant: 'ghost' },
          { label: 'Get started', href: '/signup' },
        ]}
      />,
    );
    expect(screen.getByText('Raditz')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Product' }).getAttribute('href')).toBe('/product');
    expect(screen.getByRole('link', { name: 'Pricing' }).getAttribute('href')).toBe('/pricing');
    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/login');
    expect(screen.getByRole('link', { name: 'Get started' }).getAttribute('href')).toBe('/signup');
  });

  it('NavbarA falls back to a monogram (not the whole name) when no logo is given', () => {
    render(<NavbarA brand={{ name: 'Acme' }} />);
    // The wordmark shows the full name once...
    expect(screen.getByText('Acme')).toBeTruthy();
    // ...and the logo glyph shows only the first character — never the whole name twice.
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getAllByText('Acme')).toHaveLength(1);
  });

  it('NavbarA wraps the brand in a link when brand.href is set', () => {
    render(<NavbarA brand={{ name: 'Raditz', href: '/home' }} />);
    expect(screen.getByRole('link', { name: /Raditz/ }).getAttribute('href')).toBe('/home');
  });

  it('NavbarA renders links and actions in the opened NavSheet', () => {
    render(
      <NavbarA
        brand={{ name: 'Raditz' }}
        links={[{ label: 'Docs', href: '/docs' }]}
        actions={[{ label: 'Get started', href: '/signup' }]}
      />,
    );
    // Closed: the sheet (portaled overlay) is not mounted, so only the bar copy exists.
    expect(screen.getAllByRole('link', { name: 'Docs' })).toHaveLength(1);
    // Open the sheet via the burger.
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    // Now the link appears in both the bar and the sheet.
    expect(screen.getAllByRole('link', { name: 'Docs' }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole('link', { name: 'Get started' }).length).toBeGreaterThanOrEqual(2);
  });

  it('NavbarA children override the auto-rendered bar body', () => {
    render(
      <NavbarA brand={{ name: 'ignored' }} links={[{ label: 'ignored-link', href: '#' }]}>
        <div data-testid="custom">Custom bar</div>
      </NavbarA>,
    );
    expect(screen.getByTestId('custom')).toBeTruthy();
    expect(screen.queryByText('ignored')).toBeNull();
    expect(screen.queryByRole('link', { name: 'ignored-link' })).toBeNull();
  });

  it('NavbarD renders the supplied tabs with the first active by default', () => {
    render(
      <NavbarD
        tabs={[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
        ]}
      />,
    );
    const home = screen.getByRole('button', { name: /Home/ });
    const search = screen.getByRole('button', { name: /Search/ });
    expect(home.getAttribute('aria-current')).toBe('page');
    expect(search.getAttribute('aria-current')).toBeNull();
  });

  it('NavbarD (uncontrolled) updates the active tab on click', () => {
    render(
      <NavbarD
        tabs={[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Search/ }));
    expect(screen.getByRole('button', { name: /Search/ }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: /Home/ }).getAttribute('aria-current')).toBeNull();
  });

  it('NavbarD (controlled) reflects activeId and calls onTabChange without self-updating', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(
      <NavbarD
        activeId="home"
        onTabChange={onTabChange}
        tabs={[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Search/ }));
    expect(onTabChange).toHaveBeenCalledWith('search');
    // Controlled: active state does not move until the parent passes a new activeId.
    expect(screen.getByRole('button', { name: /Home/ }).getAttribute('aria-current')).toBe('page');
    rerender(
      <NavbarD
        activeId="search"
        onTabChange={onTabChange}
        tabs={[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: /Search/ }).getAttribute('aria-current')).toBe('page');
  });
});
