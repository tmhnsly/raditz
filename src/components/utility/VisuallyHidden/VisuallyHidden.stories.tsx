import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Components/Utility/VisuallyHidden',
  component: VisuallyHidden,
  parameters: { docs: { description: { component: 'Hides content visually but keeps it for assistive tech.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <button type="button">
      <span aria-hidden="true">×</span>
      <VisuallyHidden {...args}>Close dialog</VisuallyHidden>
    </button>
  ),
};
