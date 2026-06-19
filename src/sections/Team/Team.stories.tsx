import type { Meta, StoryObj } from '@storybook/react';
import { TeamA } from './Team';

const meta: Meta = { title: 'Sections/Team' };
export default meta;
type Story = StoryObj;

export const A_MemberGrid: Story = { name: 'A · 4-up member grid', render: () => <TeamA /> };
