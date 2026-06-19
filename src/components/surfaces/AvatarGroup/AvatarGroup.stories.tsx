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
      { initials: 'TH', name: 'Tom Hinsley', role: 'Design engineer', href: '#' },
      { initials: 'AB', name: 'Ada Byron', role: 'Engineering', href: '#' },
      { initials: 'CD', name: 'Carl Daly', role: 'Product', href: '#' },
      { initials: 'EF', name: 'Erin Frost', role: 'Research', href: '#' },
      { initials: 'GH', name: 'Greg Hale', role: 'Marketing', href: '#' },
      { initials: 'IJ', name: 'Iris Jones', role: 'Support', href: '#' },
    ],
  },
};
