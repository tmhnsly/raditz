import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

const meta = {
  title: 'Components/Utility/AspectRatio',
  component: AspectRatio,
  parameters: { docs: { description: { component: 'Constrains content to a fixed aspect ratio.' } } },
  argTypes: {
    ratio: { control: 'number' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <AspectRatio {...args}>
        <div style={{ width: '100%', height: '100%', background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};
