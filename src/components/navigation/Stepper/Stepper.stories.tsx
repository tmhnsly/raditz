import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta = {
  title: 'Components/Navigation/Stepper',
  component: Stepper,
  parameters: {
    docs: { description: { component: 'Progress indicator for multi-step flows.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Stepper
        current={1}
        steps={[
          { label: 'Account', description: 'Create your account' },
          { label: 'Profile', description: 'Add your details' },
          { label: 'Billing', description: 'Set up payment' },
          { label: 'Done', description: 'Review and finish' },
        ]}
      />
    </div>
  ),
};
