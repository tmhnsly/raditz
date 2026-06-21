import type { Meta, StoryObj } from '@storybook/react';
import { FooterA, FooterB } from './Footer';

const meta: Meta = { title: 'Sections/Footer' };
export default meta;
type Story = StoryObj;

const brand = {
  name: 'Raditz',
  blurb: 'A modular design foundation built on Radix that re-themes from a single accent.',
};

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Components' },
      { label: 'Tokens' },
      { label: 'Templates' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs' },
      { label: 'Changelog' },
      { label: 'GitHub', href: 'https://github.com' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About' },
      { label: 'Careers' },
      { label: 'Contact' },
    ],
  },
];

const barLinks = [
  { heading: 'Legal', links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Status' }] },
];

export const A_MultiColumn: Story = {
  name: 'A · Multi-column',
  render: () => <FooterA brand={brand} columns={columns} />,
};

export const B_MinimalBar: Story = {
  name: 'B · Minimal bar',
  render: () => <FooterB copyright="© 2026 Raditz" columns={barLinks} />,
};
