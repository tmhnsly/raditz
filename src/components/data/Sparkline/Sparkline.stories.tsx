import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from './Sparkline';

const meta = {
  title: 'Components/Data/Sparkline',
  component: Sparkline,
  parameters: {
    docs: {
      description: {
        component: 'Tiny inline trend line (pure SVG, token-colored).',
      },
    },
  },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    strokeWidth: { control: 'number' },
    area: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    data: [4, 8, 5, 12, 9, 15, 11, 18, 14, 22],
  },
};
