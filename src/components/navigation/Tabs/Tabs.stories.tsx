import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    docs: { description: { component: 'A tab switcher — segmented control or underline bar.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('overview');
    return (
      <div style={{ padding: 24 }}>
        <Tabs
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity' },
            { value: 'settings', label: 'Settings' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};
