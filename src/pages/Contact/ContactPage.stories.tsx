import type { Meta, StoryObj } from '@storybook/react';
import { ContactPage } from './ContactPage';

const meta: Meta<typeof ContactPage> = {
  title: 'Pages/Contact',
  component: ContactPage,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'A full contact page — glass Navbar, the Contact section (details + message form), and the Footer.' } },
  },
};
export default meta;
type Story = StoryObj<typeof ContactPage>;

export const Default: Story = {};
