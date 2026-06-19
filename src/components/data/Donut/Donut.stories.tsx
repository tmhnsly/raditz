import type { Meta, StoryObj } from '@storybook/react';
import { Donut } from './Donut';

const meta = {
  title: 'Components/Data/Donut',
  component: Donut,
  parameters: {
    docs: {
      description: {
        component: 'Ring chart for a percentage or multiple segments.',
      },
    },
  },
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    size: { control: 'text' },
    thickness: { control: 'number' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 68,
    max: 100,
    label: '68%',
  },
};
