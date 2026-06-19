import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Navigation/Tooltip',
  component: Tooltip,
  parameters: {
    docs: { description: { component: 'A hover/focus tooltip wrapping a focusable trigger.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}>
      <Tooltip label="Save your changes">
        <button type="button">Save</button>
      </Tooltip>
    </div>
  ),
};
