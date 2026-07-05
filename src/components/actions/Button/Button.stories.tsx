import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: { docs: { description: { component: 'The primary action component. `variant` sets the visual weight, `size` the scale.' } } },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'soft', 'outline', 'ghost', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { children: 'Button' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="soft">Soft</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
};

// Glass needs something behind it to frost — shown over a gradient.
export const Glass: Story = {
  render: (args) => (
    <div style={{ padding: '2.5rem', borderRadius: 'var(--radius-card)', background: 'linear-gradient(120deg, var(--accent-surface), var(--accent-2-surface))', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="glass">Glass</Button>
      <Button {...args} variant="glass" size="lg">Live demo →</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const AsElement: Story = {
  name: 'render (compose as another element)',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Swap the element while keeping the button's styling — e.g. a router
          <Link>. Here a plain <a> stands in for one. */}
      <Button render={<a href="https://example.com" target="_blank" rel="noreferrer" />} icon="link">
        External link
      </Button>
      <Button variant="soft" render={<label htmlFor="file-x" />} icon="upload">
        Upload (a &lt;label&gt;)
      </Button>
      <input id="file-x" type="file" hidden />
    </div>
  ),
};
