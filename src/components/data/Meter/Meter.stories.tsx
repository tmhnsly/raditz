import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from './Meter';

const meta = {
  title: 'Components/Data/Meter',
  component: Meter,
  parameters: {
    docs: { description: { component: 'A scalar measurement within a range (disk usage, score, load) — distinct from Progress (task completion). Thresholds shift the fill colour.' } },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['sm', 'md'] },
    tone: { control: 'select', options: ['accent', 'neutral', 'info', 'success', 'warning', 'danger'] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  args: { value: 64, label: 'Storage', showValue: true },
  render: (args) => <div style={{ width: '20rem' }}><Meter {...args} /></div>,
};

export const Thresholds: Story = {
  render: () => (
    <div style={{ width: '20rem', display: 'grid', gap: 'var(--space-5)' }}>
      {[38, 76, 94].map((v) => (
        <Meter
          key={v}
          value={v}
          label="Disk usage"
          showValue={(val) => `${val}%`}
          segments={[
            { to: 70, tone: 'success' },
            { to: 90, tone: 'warning' },
            { to: 100, tone: 'danger' },
          ]}
        />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ width: '18rem', display: 'grid', gap: 'var(--space-4)' }}>
      {(['accent', 'info', 'success', 'warning', 'danger', 'neutral'] as const).map((t) => (
        <Meter key={t} value={62} tone={t} label={t} size="sm" />
      ))}
    </div>
  ),
};

export const CustomRange: Story = {
  args: { value: 3.8, min: 0, max: 5, label: 'Rating', showValue: (v: number, max: number) => `${v} / ${max}` },
  render: (args) => <div style={{ width: '18rem' }}><Meter {...args} /></div>,
};
