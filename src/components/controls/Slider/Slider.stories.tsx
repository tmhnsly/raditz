import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Controls/Slider',
  component: Slider,
  parameters: { docs: { description: { component: 'Single-thumb range input. Drag the track/thumb or use arrow / Home / End keys. Emits numbers in `[min, max]` snapped to `step`.' } } },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    ticks: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { min: 0, max: 100, step: 1 },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(40);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const WithTicks: Story = {
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} step={25} ticks value={value} onValueChange={setValue} />
      </div>
    );
  },
};
