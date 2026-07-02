import type { Meta, StoryObj } from '@storybook/react';
import { PricingA, PricingB, type PricingTier } from './Pricing';

const meta: Meta = { title: 'Sections/Pricing' };
export default meta;
type Story = StoryObj;

const tiersA: PricingTier[] = [
  {
    name: 'Starter',
    blurb: 'For solo builders',
    price: '$0',
    period: '/mo',
    action: { label: 'Get started', href: '#', variant: 'outline' },
    features: ['1 project', 'Community support', 'Core components'],
  },
  {
    name: 'Team',
    blurb: 'For growing teams',
    price: '$24',
    period: '/seat/mo',
    action: { label: 'Start trial', href: '#', variant: 'primary' },
    features: ['Unlimited projects', 'Priority support', 'All components', 'Dark mode + themes'],
    popular: true,
    badge: 'Popular',
  },
  {
    name: 'Enterprise',
    blurb: 'For organizations',
    price: 'Custom',
    action: { label: 'Contact sales', href: '#', variant: 'outline' },
    features: ['SSO & SAML', 'Dedicated support', 'Custom themes'],
  },
];

const tiersB: PricingTier[] = [
  {
    name: 'Pro',
    price: '$24',
    priceYearly: '$19',
    period: '/mo',
    action: { label: 'Choose Pro', href: '#', variant: 'primary' },
  },
  {
    name: 'Business',
    price: '$60',
    priceYearly: '$48',
    period: '/mo',
    action: { label: 'Choose Business', href: '#', variant: 'outline' },
  },
];

export const A_ThreeTiers: Story = {
  name: 'A · 3 tiers, popular highlighted',
  render: () => (
    <PricingA
      heading="Simple, scalable pricing"
      sub="Start free. Upgrade when your team grows."
      tiers={tiersA}
    />
  ),
};

export const B_MonthlyAnnualToggle: Story = {
  name: 'B · Monthly / annual toggle',
  render: () => (
    <PricingB
      heading="Pay monthly or save yearly"
      tiers={tiersB}
    />
  ),
};
