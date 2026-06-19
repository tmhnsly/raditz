import type { Meta, StoryObj } from '@storybook/react';
import { Code } from './Code';

const meta = {
  title: 'Components/Typography/Code',
  component: Code,
  parameters: { docs: { description: { component: 'Monospace code — inline by default; pass `block` for a dark code block.' } } },
  argTypes: {
    block: { control: 'boolean' },
  },
  args: { children: 'const x = 42;' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Inline: Story = {};

export const Block: Story = {
  args: {
    block: true,
    children: 'function greet(name) {\n  return `Hello, ${name}`;\n}',
  },
};
