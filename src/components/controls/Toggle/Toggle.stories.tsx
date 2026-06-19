import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Controls/Toggle',
  component: Toggle,
  parameters: { docs: { description: { component: 'Two-state on/off button. Controlled with `pressed` or uncontrolled with `defaultPressed`; `onPressedChange` fires on change.' } } },
  argTypes: {
    variant: { control: 'select', options: ['soft', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Bold' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(false);
    return <Toggle {...args} pressed={pressed} onPressedChange={setPressed} />;
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Toggle {...args} variant="soft" defaultPressed>Soft</Toggle>
      <Toggle {...args} variant="outline" defaultPressed>Outline</Toggle>
    </div>
  ),
};
