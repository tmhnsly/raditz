import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesTabbed } from './FeaturesTabbed';

const meta: Meta<typeof FeaturesTabbed> = { title: 'Sections/FeaturesTabbed', component: FeaturesTabbed };
export default meta;
type Story = StoryObj<typeof FeaturesTabbed>;

export const Default: Story = {
  args: {
    eyebrow: 'Studio hire & coaching',
    heading: 'Three ways to use the studio',
    aside: 'Open Monday–Thursday, 10am–8pm. All bookings subject to our terms.',
    items: [
      {
        label: 'Private Hire',
        lead: (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '.25rem' }}>
            <li><strong>£30</strong> / 1 hour</li>
            <li><strong>£50</strong> / 2 hours <em>(Recommended)</em></li>
            <li><strong>£70</strong> / 3 hours</li>
          </ul>
        ),
        description: 'Access to the full studio for up to two guests on our flagship Pioneer setup, tuned to the room.',
        features: ['4× CDJ-3000', 'DJM-A9 / V10', 'Martin Audio system', 'RMX-1000', 'Studio lighting', 'Hands-on support'],
        action: { label: 'Book this session', href: '#' },
      },
      {
        label: '1-to-1 Coaching',
        lead: (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '.25rem' }}>
            <li><strong>£70</strong> / 1 hour</li>
            <li><strong>£130</strong> / 2 hours <em>(Recommended)</em></li>
          </ul>
        ),
        description: 'Private lessons with an experienced tutor, built around your goals.',
        features: ['4× CDJ-3000', 'DJM-A9 / V10', 'Tutor with 10+ years', 'Tailored to you'],
        action: { label: 'Book this session', href: '#' },
      },
      {
        label: 'Content Production',
        description: 'Multi-camera recording with professional audio and lighting.',
        features: ['Multi-camera setup', 'High-res audio', 'Raw files in 24h', 'Optional edit & grade'],
        action: { label: 'Book this session', href: '#' },
      },
    ],
  },
};
