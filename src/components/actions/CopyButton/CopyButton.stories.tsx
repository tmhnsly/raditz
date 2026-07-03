import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './CopyButton';
import { Code } from '../../typography/Code/Code';

const meta = {
  title: 'Components/Actions/CopyButton',
  component: CopyButton,
  parameters: { docs: { description: { component: 'Copy-to-clipboard button. Icon-only by default; pass `children` for a visible text label. Shows a check + `copiedLabel` for a moment after a successful copy.' } } },
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { value: 'pnpm add raditz' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => <CopyButton {...args} value="pnpm add raditz" variant="outline">Copy</CopyButton>,
};

// The canonical placement — beside a code block, copying its contents.
export const BesideCode: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
      <Code block>pnpm add raditz</Code>
      <CopyButton {...args} value="pnpm add raditz" label="Copy install command" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton {...args} value="pnpm add raditz" size="sm" label="Copy (small)" />
      <CopyButton {...args} value="pnpm add raditz" size="md" label="Copy (medium)" />
      <CopyButton {...args} value="pnpm add raditz" size="md" variant="outline">Copy</CopyButton>
    </div>
  ),
};
