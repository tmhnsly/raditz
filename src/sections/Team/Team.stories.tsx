import type { Meta, StoryObj } from '@storybook/react';
import { TeamA } from './Team';

const meta: Meta = { title: 'Sections/Team' };
export default meta;
type Story = StoryObj;

const demoMembers = [
  { name: 'Maya Okafor', role: 'Design Lead', avatar: 'MO' },
  { name: 'Jon Tran', role: 'Eng Manager', avatar: 'JT' },
  { name: 'Sara Lin', role: 'Product', avatar: 'SL' },
  { name: 'Ada Reyes', role: 'Engineering', avatar: 'AR' },
];

export const A_MemberGrid: Story = {
  name: 'A · 4-up member grid',
  render: () => (
    <TeamA
      heading="Meet the team"
      members={demoMembers}
    />
  ),
};
