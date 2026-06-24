import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  parameters: { docs: { description: { component: 'An on/off toggle. Controlled via `checked` + `onChange`, or uncontrolled with `defaultChecked`.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} aria-label="Toggle setting" />;
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Switch defaultChecked={false} aria-label="Off" />
      <Switch defaultChecked aria-label="On" />
      <Switch defaultChecked disabled aria-label="Disabled" />
    </div>
  ),
};
