import type { Meta, StoryObj } from '@storybook/react';
import { NavbarA, NavbarB, NavbarC, NavbarD } from './Navbar';

const meta: Meta = { title: 'Sections/Navbar' };
export default meta;
type Story = StoryObj;

/** A monospace glyph used as the demo brand logo. */
const glyph = (char: string) => <span className="sx-nav__logo-glyph">{char}</span>;

/** Demo tab icons (re-themeable inline SVGs). */
const TabIcon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const A_LogoLinksCTAs: Story = {
  name: 'A · Logo + links + CTAs',
  render: () => (
    <NavbarA
      brand={{ name: 'Raditz', logo: glyph('R') }}
      links={[
        { label: 'Product', href: '#' },
        { label: 'Solutions', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Docs', href: '#' },
      ]}
      actions={[
        { label: 'Sign in', href: '#', variant: 'ghost' },
        { label: 'Get started', href: '#', variant: 'primary' },
      ]}
    />
  ),
};

export const B_GlassCentered: Story = {
  name: 'B · Glass, centered links',
  render: () => (
    <NavbarB
      brand={{ name: 'Raditz', logo: glyph('R') }}
      links={[
        { label: 'Features', href: '#' },
        { label: 'Customers', href: '#' },
        { label: 'Pricing', href: '#' },
      ]}
      actions={[{ label: 'Start free', href: '#', variant: 'primary' }]}
    />
  ),
};

export const C_MobileDropdown: Story = {
  name: 'C · Mobile — links collapse into a dropdown menu',
  render: () => (
    <NavbarC
      brand={{ name: 'Raditz', logo: glyph('R') }}
      links={[
        { label: 'Product', href: '#' },
        { label: 'Solutions', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Docs', href: '#' },
      ]}
      actions={[
        { label: 'Sign in', href: '#', variant: 'ghost' },
        { label: 'Get started', href: '#', variant: 'primary' },
      ]}
    />
  ),
};

export const D_BottomTabBar: Story = {
  name: 'D · Bottom tab bar (iOS-style)',
  render: () => (
    <NavbarD
      tabs={[
        { id: 'home', label: 'Home', icon: <TabIcon><path d="M3 11.5 12 4l9 7.5M5 10v9h5v-5h4v5h5v-9" /></TabIcon> },
        { id: 'search', label: 'Search', icon: <TabIcon><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></TabIcon> },
        { id: 'create', label: 'Create', icon: <TabIcon><circle cx="12" cy="12" r="9" /><path d="M12 8.5v7M8.5 12h7" /></TabIcon> },
        { id: 'activity', label: 'Activity', icon: <TabIcon><path d="M3 12h4l2.5 7 5-14L17 12h4" /></TabIcon> },
        { id: 'profile', label: 'Profile', icon: <TabIcon><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></TabIcon> },
      ]}
    />
  ),
};
