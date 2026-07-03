import type { Meta, StoryObj } from '@storybook/react';
import { Legend } from './Legend';
import { LineChart } from '../LineChart';
import { Donut } from '../Donut';

const meta = {
  title: 'Components/Data/Legend',
  component: Legend,
  parameters: {
    docs: { description: { component: 'Keys a chart’s series to their colours — a wrap-friendly swatch + label row.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Shapes: Story = {
  render: () => (
    <Legend
      items={[
        { label: 'Sessions', color: 'var(--accent)', shape: 'line' },
        { label: 'Signups', color: 'var(--secondary, var(--accent))', shape: 'dot' },
        { label: 'Churn', color: 'var(--danger)', shape: 'square' },
      ]}
    />
  ),
};

export const UnderLineChart: Story = {
  name: 'Under a LineChart',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '32rem' }}>
      <LineChart data={[8, 12, 9, 15, 14, 20, 18].map((y, i) => ({ y, label: `W${i + 1}` }))} area gradient />
      <Legend items={[{ label: 'Weekly active', color: 'var(--accent)', shape: 'line' }]} />
    </div>
  ),
};

export const BesideDonut: Story = {
  name: 'Beside a Donut',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
      <Donut
        size="7rem"
        segments={[
          { value: 60, color: 'var(--accent)' },
          { value: 30, color: 'var(--warning)' },
          { value: 10, color: 'var(--danger)' },
        ]}
      />
      <Legend
        size="sm"
        items={[
          { label: 'Direct', color: 'var(--accent)', shape: 'square' },
          { label: 'Referral', color: 'var(--warning)', shape: 'square' },
          { label: 'Other', color: 'var(--danger)', shape: 'square' },
        ]}
      />
    </div>
  ),
};
