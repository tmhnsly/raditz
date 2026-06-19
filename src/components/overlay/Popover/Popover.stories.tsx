import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../../controls/Button';

const meta = {
  title: 'Components/Overlay/Popover',
  component: Popover,
  parameters: {
    docs: { description: { component: 'Floating content anchored to a trigger.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover
      side="bottom"
      align="center"
      trigger={<Button>Open popover</Button>}
    >
      <div style={{ padding: '0.5rem 0.25rem', maxWidth: '16rem' }}>
        <strong>Popover title</strong>
        <p>Floating content anchored to the trigger button. Click outside or press Escape to close.</p>
      </div>
    </Popover>
  ),
};
