import type { Meta, StoryObj } from '@storybook/react';
import { FooterA, FooterB } from './Footer';

const meta: Meta = { title: 'Sections/Footer' };
export default meta;
type Story = StoryObj;

export const A_MultiColumn: Story = { name: 'A · Multi-column', render: () => <FooterA /> };
export const B_MinimalBar: Story = { name: 'B · Minimal bar', render: () => <FooterB /> };
