import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Typography/Kbd',
  component: Kbd,
  parameters: { docs: { description: { component: 'A keyboard key cap (⌘, Esc, ↵). Render one per key.' } } },
  args: { children: '⌘' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Combination: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>Shift</Kbd>
      <Kbd {...args}>P</Kbd>
    </div>
  ),
};
