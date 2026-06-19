import type { Meta, StoryObj } from '@storybook/react';
import { Popout } from './Popout';

const meta = {
  title: 'Components/Layout/Popout',
  component: Popout,
  parameters: { docs: { description: { component: 'Full-bleed background, container-aligned content (the "popout" section).' } } },
  argTypes: {
    size: { control: 'select', options: ['default', 'narrow', 'wide', 'prose'] },
    bg: { control: 'text' },
    pad: { control: 'number' },
    bordered: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'default', bordered: true },
  render: (args) => (
    <div style={{ maxWidth: 480, marginInline: 'auto', overflow: 'hidden' }}>
      <div style={{ height: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' }} />
      <Popout {...args}>
        <div style={{ height: 60, background: 'var(--accent)', borderRadius: 'var(--radius-md)' }} />
      </Popout>
      <div style={{ height: 60, marginTop: '0.75rem', background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' }} />
    </div>
  ),
};
