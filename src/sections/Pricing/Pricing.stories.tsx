import type { Meta, StoryObj } from '@storybook/react';
import { PricingA, PricingB } from './Pricing';

const meta: Meta = { title: 'Sections/Pricing' };
export default meta;
type Story = StoryObj;

export const A_ThreeTiers: Story = { name: 'A · 3 tiers, popular highlighted', render: () => <PricingA /> };
export const B_MonthlyAnnualToggle: Story = { name: 'B · Monthly / annual toggle', render: () => <PricingB /> };
