import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'Components/Display/Chip',
  component: Chip,
  parameters: { docs: { description: { component: 'A compact pill-shaped token — selected filters, tags, people. `onDismiss` adds a labelled ×, `onClick` makes the body a button.' } } },
  argTypes: {
    variant: { control: 'select', options: ['soft', 'outline', 'solid'] },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Chip' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip {...args} variant="soft">Soft</Chip>
      <Chip {...args} variant="outline">Outline</Chip>
      <Chip {...args} variant="solid">Solid</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip {...args} size="sm">Small</Chip>
      <Chip {...args} size="md">Medium</Chip>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip {...args} icon={<Icon name="user" />}>Assignee</Chip>
      <Chip {...args} icon={<Icon name="star" />} variant="outline">Starred</Chip>
      <Chip {...args} icon={<Icon name="check" />} variant="solid">Done</Chip>
    </div>
  ),
};

export const DismissibleRow: Story = {
  render: () => {
    const [tags, setTags] = useState(['Design', 'Engineering', 'Research', 'Ops']);
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map((t) => (
          <Chip key={t} dismissLabel={`Remove ${t}`} onDismiss={() => setTags(tags.filter((x) => x !== t))}>
            {t}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Clickable: Story = {
  render: () => {
    const options = ['All', 'Open', 'Closed'];
    const [selected, setSelected] = useState('All');
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <Chip key={opt} variant={selected === opt ? 'solid' : 'soft'} onClick={() => setSelected(opt)}>
            {opt}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip {...args} disabled onDismiss={() => {}}>Dismissible</Chip>
      <Chip {...args} disabled onClick={() => {}}>Clickable</Chip>
    </div>
  ),
};
