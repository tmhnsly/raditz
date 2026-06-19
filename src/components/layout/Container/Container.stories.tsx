import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const box = { height: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' };

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  parameters: { docs: { description: { component: 'Centers content and applies responsive gutters.' } } },
  argTypes: {
    size: { control: 'select', options: ['default', 'narrow', 'wide', 'prose'] },
    bleed: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'default' },
  render: (args) => (
    <Container {...args}>
      <div style={box} />
    </Container>
  ),
};
