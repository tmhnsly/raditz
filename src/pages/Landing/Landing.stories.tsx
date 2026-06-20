import type { Meta, StoryObj } from '@storybook/react';
import { Landing } from './Landing';

const meta: Meta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete marketing landing page composed entirely from Raditz sections (Navbar, Hero, Social proof, Features, Stats, Testimonials, Pricing, FAQ, CTA, Footer). Toggle the Theme toolbar to re-theme the whole page.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Landing>;

export const Default: Story = {};
