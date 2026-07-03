import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumberInput } from './NumberInput';
import { Field } from '../Field';

const meta = {
  title: 'Components/Inputs/NumberInput',
  component: NumberInput,
  parameters: {
    docs: { description: { component: 'Stepped numeric field — − / input / + in one frame, clamped to [min, max].' } },
  },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return <NumberInput aria-label="Quantity" value={value} onValueChange={setValue} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <NumberInput aria-label="Small" size="sm" defaultValue={2} />
      <NumberInput aria-label="Medium" size="md" defaultValue={2} />
      <NumberInput aria-label="Large" size="lg" defaultValue={2} />
    </div>
  ),
};

export const Bounded: Story = {
  name: 'Min / max / step',
  render: () => {
    const [value, setValue] = useState(1);
    return <NumberInput aria-label="Guests" min={1} max={8} step={1} value={value} onValueChange={setValue} />;
  },
};

export const FractionalStep: Story = {
  render: () => {
    const [value, setValue] = useState(0.5);
    return <NumberInput aria-label="Rate" min={0} max={5} step={0.25} value={value} onValueChange={setValue} />;
  },
};

export const InField: Story = {
  name: 'In a Field',
  render: () => (
    <Field label="Attempts" hint="Log an attempt before grading.">
      <NumberInput defaultValue={0} min={0} max={99} />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => <NumberInput aria-label="Locked" defaultValue={5} disabled />,
};
