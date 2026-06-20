import type { Meta, StoryObj } from '@storybook/react';
import { PricingPage } from './PricingPage';

const meta: Meta<typeof PricingPage> = {
  title: 'Pages/Pricing',
  component: PricingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full pricing page composed from Raditz sections: glass navbar, monthly/annual pricing toggle, feature comparison table, FAQ, CTA band and footer.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PricingPage>;

export const Default: Story = {};
