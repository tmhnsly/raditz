import type { Meta, StoryObj } from '@storybook/react';
import { CtaA, CtaB } from './Cta';

const meta: Meta = { title: 'Sections/CTA band' };
export default meta;
type Story = StoryObj;

export const A_Centered: Story = { name: 'A · Centered', render: () => <CtaA /> };
export const B_Split: Story = { name: 'B · Split, accent surface', render: () => <CtaB /> };
