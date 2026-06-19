import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const box = { height: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' };

const meta = {
  title: 'Components/Layout/Grid',
  component: Grid,
  parameters: { docs: { description: { component: 'CSS grid — fixed columns or responsive auto-fill.' } } },
  argTypes: {
    columns: { control: 'number' },
    minItem: { control: 'text' },
    gap: { control: 'number' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const FixedColumns: Story = {
  args: { columns: 3, gap: 5 },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={box} />)}
    </Grid>
  ),
};

export const AutoFill: Story = {
  args: { minItem: '160px', gap: 5 },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={box} />)}
    </Grid>
  ),
};
