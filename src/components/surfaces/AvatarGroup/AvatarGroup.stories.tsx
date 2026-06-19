import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';

const meta = {
  title: 'Components/Surfaces/AvatarGroup',
  component: AvatarGroup,
  parameters: { docs: { description: { component: 'Overlapping avatars with a +N overflow chip.' } } },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    max: { control: 'number' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    max: 4,
    size: 'md',
    items: [
      { initials: 'TH' },
      { initials: 'AB' },
      { initials: 'CD' },
      { initials: 'EF' },
      { initials: 'GH' },
      { initials: 'IJ' },
    ],
  },
};
