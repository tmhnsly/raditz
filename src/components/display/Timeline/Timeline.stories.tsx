import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const meta = {
  title: 'Components/Display/Timeline',
  component: Timeline,
  parameters: { docs: { description: { component: 'An ordered list of events on a continuous rule. Each item has a marker disc plus meta / title / description; `tone` colours the marker.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    items: [
      { meta: 'Jan 2026', title: 'Kick-off', description: 'Scoped the brief and locked the launch window.' },
      { meta: 'Feb 2026', title: 'Design system', description: 'Tokens, type scale and the first component pass.' },
      { meta: 'Apr 2026', title: 'Private beta', description: 'Fifty invited studios, weekly feedback loops.' },
      { meta: 'Jun 2026', title: 'Public launch' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        meta: '09:00',
        title: 'Doors open',
        description: 'Badge pickup and coffee in the foyer.',
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          </svg>
        ),
      },
      {
        meta: '10:00',
        title: 'Opening set',
        description: 'Back-to-back on the main floor.',
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ),
      },
      {
        meta: '14:00',
        title: 'Workshop',
        description: 'Hands-on mixing clinic, all levels.',
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
        ),
      },
    ],
  },
};

export const Tones: Story = {
  args: {
    items: [
      { meta: 'Shipped', title: 'Core components', description: 'Buttons, inputs, layout primitives.', tone: 'done' },
      { meta: 'Shipped', title: 'Dark theming', description: 'Token-driven schemes with an accent override.', tone: 'done' },
      { meta: 'In progress', title: 'Data visualisation', description: 'Charts and the DataTable polish pass.', tone: 'accent' },
      { meta: 'Planned', title: 'Horizontal timeline', description: 'A second orientation for roadmaps.' },
    ],
  },
};
