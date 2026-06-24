import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/surfaces/Card';
import { Field } from '../components/inputs/Field';
import { Input } from '../components/inputs/Input';
import { Checkbox } from '../components/inputs/Checkbox';
import { Button } from '../components/actions/Button';

// Demos / design ideas: ad-hoc compositions that show several components working
// TOGETHER in real context (the showroom), as opposed to inspecting one component
// in isolation (that's Storybook's job). Drop new files in src/demos/ titled
// "Demos/<name>" and they appear automatically in the showcase.
const meta: Meta = {
  title: 'Demos/Sign-up card',
  parameters: {
    docs: {
      description: {
        component:
          'A self-contained sign-up card composed from Card, Field, Input, Checkbox and Button — a quick in-context test of how the form pieces sit together and re-theme.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 380, padding: 'var(--space-6)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <span className="rdz-eyebrow">
            <span className="rdz-eyebrow__dot" />
            Get started
          </span>
          <h3 style={{ fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)' }}>Create your account</h3>
        </div>

        <Field label="Full name" htmlFor="demo-name">
          <Input id="demo-name" placeholder="Ada Lovelace" />
        </Field>

        <Field label="Email" htmlFor="demo-email" hint="We’ll never share it.">
          <Input id="demo-email" type="email" placeholder="ada@example.com" />
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Checkbox id="demo-terms" defaultChecked />
          <label htmlFor="demo-terms" style={{ fontSize: 'var(--fs-body-s)', color: 'var(--text-soft)' }}>
            I agree to the terms of service
          </label>
        </div>

        <Button variant="primary" size="lg">
          Create account
        </Button>
      </div>
    </Card>
  ),
};
