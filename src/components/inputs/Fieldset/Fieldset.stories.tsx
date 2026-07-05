import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { Field } from '../Field';
import { Input } from '../Input';
import { RadioGroup } from '../RadioGroup';

const meta = {
  title: 'Components/Inputs/Fieldset',
  component: Fieldset,
  parameters: {
    docs: { description: { component: 'Groups related controls under a native `<legend>`. `disabled` uses the browser fieldset cascade to disable everything inside.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Fieldset legend="Shipping address" hint="Where should we send it?" style={{ maxWidth: '24rem' }}>
      <Field label="Street"><Input name="street" placeholder="221B Baker Street" /></Field>
      <Field label="City"><Input name="city" placeholder="London" /></Field>
      <Field label="Postcode"><Input name="postcode" placeholder="NW1 6XE" /></Field>
    </Fieldset>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <Fieldset legend="Plan" style={{ maxWidth: '24rem' }}>
      <RadioGroup
        name="plan"
        defaultValue="pro"
        items={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ]}
      />
    </Fieldset>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset legend="Billing" hint="Locked while your trial is active." disabled style={{ maxWidth: '24rem' }}>
      <Field label="Card number"><Input name="card" placeholder="•••• •••• •••• ••••" /></Field>
      <Field label="Name on card"><Input name="name" placeholder="Ada Lovelace" /></Field>
    </Fieldset>
  ),
};
