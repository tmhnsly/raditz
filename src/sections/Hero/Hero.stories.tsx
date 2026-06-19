import type { Meta, StoryObj } from '@storybook/react';
import { HeroA, HeroB, HeroC } from './Hero';

const meta: Meta = { title: 'Sections/Hero' };
export default meta;
type Story = StoryObj;

export const A_CenteredDualCTA: Story = { name: 'A · Centered, dual CTA', render: () => <HeroA /> };
export const B_SplitCopyMedia: Story = { name: 'B · Split — copy + media', render: () => <HeroB /> };
export const C_AccentFullBleed: Story = { name: 'C · Accent full-bleed', render: () => <HeroC /> };
