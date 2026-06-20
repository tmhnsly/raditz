import type { Meta, StoryObj } from '@storybook/react';
import { AnnouncementA, AnnouncementB } from './Announcement';

const meta: Meta = { title: 'Sections/Announcement bar' };
export default meta;
type Story = StoryObj;

export const A_AccentStrip: Story = {
  name: 'A · Accent strip + CTA',
  render: () => (
    <AnnouncementA
      text={
        <>
          <strong>Raditz 2.0 is here</strong>
          <span className="sx-ann__dim">— 64 components, theme builder, templates.</span>
        </>
      }
      action={{ label: 'Read more →', href: '#' }}
    />
  ),
};

export const B_CookieBanner: Story = {
  name: 'B · Cookie / consent banner',
  render: () => (
    <AnnouncementB
      text={
        <>
          We use cookies to improve your experience. By using Raditz you agree to our{' '}
          <a href="#" className="sx-ann__banner-link">cookie policy</a>.
        </>
      }
      action={{ label: 'Accept all' }}
    />
  ),
};
