import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta = {
  title: 'Components/Utility/Label',
  component: Label,
  parameters: { docs: { description: { component: 'Form label, optionally marked required.' } } },
  argTypes: {
    required: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { htmlFor: 'email', required: true, children: 'Email address' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 280 }}>
      <Label {...args} />
      <input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};
