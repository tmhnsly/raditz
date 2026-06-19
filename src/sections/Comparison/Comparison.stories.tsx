import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonA } from './Comparison';

const meta: Meta = { title: 'Sections/Feature comparison' };
export default meta;
type Story = StoryObj;

export const A_PlansFeatures: Story = { name: 'A · Plans × features, popular highlighted', render: () => <ComparisonA /> };
