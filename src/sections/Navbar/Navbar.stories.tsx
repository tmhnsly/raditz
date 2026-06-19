import type { Meta, StoryObj } from '@storybook/react';
import { NavbarA, NavbarB, NavbarC } from './Navbar';

const meta: Meta = { title: 'Sections/Navbar' };
export default meta;
type Story = StoryObj;

export const A_LogoLinksCTAs: Story = { name: 'A · Logo + links + CTAs', render: () => <NavbarA /> };
export const B_GlassCentered: Story = { name: 'B · Glass, centered links', render: () => <NavbarB /> };
export const C_MobileDropdown: Story = {
  name: 'C · Mobile — links collapse into a dropdown menu',
  render: () => <NavbarC />,
};
