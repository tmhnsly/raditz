import type { Meta, StoryObj } from '@storybook/react';
import { Eyebrow } from './Eyebrow';

const meta = {
  title: 'Components/Typography/Eyebrow',
  component: Eyebrow,
  parameters: { docs: { description: { component: 'The mono, upper-tracked label that sits above headings. Optional accent dot.' } } },
  argTypes: {
    withDot: { control: 'boolean' },
  },
  args: { children: 'Introducing' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithDot: Story = {
  args: { withDot: true },
};
