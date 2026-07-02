import type { Meta, StoryObj } from '@storybook/react';
import { StatsA, StatsB, type StatItem } from './Stats';

const meta: Meta = { title: 'Sections/Stats' };
export default meta;
type Story = StoryObj;

/** Demo stats for Stats A: 4-across */
const fourStats: StatItem[] = [
  { value: '53', label: 'components' },
  { value: '188', label: 'design tokens' },
  { value: '12', label: 'color steps' },
  { value: '1', label: 'line to re-skin' },
];

/** Demo stats for Stats B: accent band, 3 cells */
const bandStats: StatItem[] = [
  { value: '99.9%', label: 'uptime' },
  { value: '40ms', label: 'p95 latency' },
  { value: '12k+', label: 'teams' },
];

export const A_FourAcross: Story = {
  name: 'A · 4 across',
  render: () => <StatsA stats={fourStats} />,
};

export const A_CenteredHeading: Story = {
  name: 'A · Centered heading',
  render: () => <StatsA stats={fourStats} heading="The system in numbers" align="center" />,
};

export const B_AccentBand: Story = {
  name: 'B · Accent band',
  render: () => <StatsB stats={bandStats} />,
};
