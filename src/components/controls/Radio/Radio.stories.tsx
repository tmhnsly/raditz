import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Controls/Radio',
  component: Radio,
  parameters: { docs: { description: { component: 'A single radio control. Give every radio in a group the same `name`.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Radio name="example" aria-label="Example option" defaultChecked />,
};

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('a');
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
          <Radio name="group" value="a" checked={value === 'a'} onChange={() => setValue('a')} /> Option A
        </label>
        <label style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
          <Radio name="group" value="b" checked={value === 'b'} onChange={() => setValue('b')} /> Option B
        </label>
      </div>
    );
  },
};
