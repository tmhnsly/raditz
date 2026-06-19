import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NavBar } from './NavBar';

const meta = {
  title: 'Components/Navigation/NavBar',
  component: NavBar,
  parameters: {
    docs: { description: { component: 'Route nav with an indicator that flows between items on change.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

const items = [
  { key: 'home', label: 'Home' },
  { key: 'projects', label: 'Projects' },
  { key: 'team', label: 'Team' },
  { key: 'settings', label: 'Settings' },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <div style={{ padding: 24 }}>
        <NavBar items={items} active={active} onChange={setActive} />
      </div>
    );
  },
};
