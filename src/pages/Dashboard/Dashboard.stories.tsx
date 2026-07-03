import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full analytics dashboard composed from Raditz: AppShell (sidebar + search + breadcrumbs) around a KPI row (Card + CountUp + Sparkline), a primary LineChart with a Legend and period Tabs, a channel Donut, a top-pages BarChart, and a customers DataTable. The Theme toolbar re-themes everything, charts included.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {};
