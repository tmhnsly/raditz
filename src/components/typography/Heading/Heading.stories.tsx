import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Typography/Heading',
  component: Heading,
  parameters: { docs: { description: { component: 'Section / page heading in the display typeface. `level` picks the tag and size; `size` overrides the visual size.' } } },
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4] },
    size: { control: 'select', options: [1, 2, 3, 4, 'display', 'display-2xl'] },
  },
  args: { children: 'The quick brown fox' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Scale: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Heading {...args} size="display-2xl">Display 2XL</Heading>
      <Heading {...args} size="display">Display</Heading>
      <Heading {...args} level={1}>Heading 1</Heading>
      <Heading {...args} level={2}>Heading 2</Heading>
      <Heading {...args} level={3}>Heading 3</Heading>
      <Heading {...args} level={4}>Heading 4</Heading>
    </div>
  ),
};
