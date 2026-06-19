import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Controls/Checkbox',
  component: Checkbox,
  parameters: { docs: { description: { component: 'A checkbox with the accent fill + animated check. Controlled or uncontrolled like a native input.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Checkbox aria-label="Accept terms" checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Checkbox defaultChecked={false} />
      <Checkbox defaultChecked />
      <Checkbox defaultChecked disabled />
    </div>
  ),
};
