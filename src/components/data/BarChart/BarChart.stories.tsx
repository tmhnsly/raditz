import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta = {
  title: 'Components/Data/BarChart',
  component: BarChart,
  parameters: {
    docs: {
      description: {
        component: 'Compact categorical bar chart.',
      },
    },
  },
  argTypes: {
    horizontal: { control: 'boolean' },
    showValues: { control: 'boolean' },
    height: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    data: [
      { label: 'Mon', value: 32 },
      { label: 'Tue', value: 48 },
      { label: 'Wed', value: 21 },
      { label: 'Thu', value: 64 },
      { label: 'Fri', value: 55 },
    ],
  },
};
