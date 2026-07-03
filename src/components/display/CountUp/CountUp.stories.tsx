import type { Meta, StoryObj } from '@storybook/react';
import { CountUp } from './CountUp';

const meta: Meta<typeof CountUp> = { title: 'Components/Display/CountUp', component: CountUp };
export default meta;
type Story = StoryObj<typeof CountUp>;

export const Values: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem, 4vw, 2.5rem)', fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 700 }}>
      <CountUp value="10k+" />
      <CountUp value="$2.5M" />
      <CountUp value="99.9%" />
      <CountUp value={4200} />
    </div>
  ),
};
