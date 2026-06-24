import type { Meta, StoryObj } from '@storybook/react';
import { AccessibleIcon } from './AccessibleIcon';

const meta = {
  title: 'Components/Display/AccessibleIcon',
  component: AccessibleIcon,
  parameters: { docs: { description: { component: 'Pairs a decorative icon with a screen-reader label.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: 'Settings',
    children: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1v3M10 16v3M1 10h3M16 10h3" />
      </svg>
    ),
  },
};
