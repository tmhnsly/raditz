import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesA, FeaturesB, FeaturesC } from './Features';

const meta: Meta = { title: 'Sections/Features' };
export default meta;
type Story = StoryObj;

export const A_IconCards: Story = { name: 'A · 3-up icon cards', render: () => <FeaturesA /> };
export const B_BentoGrid: Story = { name: 'B · Bento grid', render: () => <FeaturesB /> };
export const C_AlternatingSpotlight: Story = { name: 'C · Alternating spotlight', render: () => <FeaturesC /> };
