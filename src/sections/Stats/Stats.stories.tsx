import type { Meta, StoryObj } from '@storybook/react';
import { StatsA, StatsB } from './Stats';

const meta: Meta = { title: 'Sections/Stats' };
export default meta;
type Story = StoryObj;

export const A_FourAcross: Story = { name: 'A · 4 across', render: () => <StatsA /> };
export const B_AccentBand: Story = { name: 'B · Accent band', render: () => <StatsB /> };
