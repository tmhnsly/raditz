import type { Meta, StoryObj } from '@storybook/react';
import { ScatterChart } from './ScatterChart';

const meta = {
  title: 'Components/Data/ScatterChart',
  component: ScatterChart,
  parameters: { docs: { description: { component: 'Responsive scatter / bubble plot (visx). `size` drives the bubble radius; hovering shows a tooltip.' } } },
  argTypes: { height: { control: 'number' } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const points = [
  { x: 12, y: 40, size: 3, label: 'Alpha' },
  { x: 22, y: 58, size: 6, label: 'Bravo' },
  { x: 30, y: 35, size: 2, label: 'Charlie' },
  { x: 38, y: 70, size: 9, label: 'Delta' },
  { x: 45, y: 52, size: 4, label: 'Echo' },
  { x: 52, y: 80, size: 7, label: 'Foxtrot' },
  { x: 60, y: 64, size: 5, label: 'Golf' },
  { x: 68, y: 90, size: 10, label: 'Hotel' },
  { x: 74, y: 48, size: 3, label: 'India' },
  { x: 82, y: 74, size: 6, label: 'Juliet' },
];

export const Default: Story = {
  args: {
    data: points,
    height: 280,
    formatX: (v: number) => `${v}`,
    formatY: (v: number) => `${v}%`,
  },
};
