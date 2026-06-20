import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { ICONS } from './icons';

const meta = {
  title: 'Components/Foundation/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'Renders a named icon from the Raditz registry. Inherits color via currentColor and sizes to 1em by default.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.keys(ICONS).map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
          }}
        >
          <Icon name={name as IconName} size="1.5rem" />
          <span style={{ fontSize: '0.75rem' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
