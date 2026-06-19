import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';

const meta = {
  title: 'Components/Surfaces/Callout',
  component: Callout,
  parameters: { docs: { description: { component: 'A bordered, tinted inline notice.' } } },
  argTypes: {
    color: { control: 'select', options: ['accent', 'info', 'success', 'warning', 'danger'] },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    color: 'info',
    title: 'Heads up',
    children: 'This is an inline notice with a tinted surface and accent border.',
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 480 }}>
      <Callout color="accent" title="Accent">Accent tone callout.</Callout>
      <Callout color="info" title="Info">Info tone callout.</Callout>
      <Callout color="success" title="Success">Success tone callout.</Callout>
      <Callout color="warning" title="Warning">Warning tone callout.</Callout>
      <Callout color="danger" title="Danger">Danger tone callout.</Callout>
    </div>
  ),
};
