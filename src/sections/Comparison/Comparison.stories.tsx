import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonA } from './Comparison';

const meta: Meta = { title: 'Sections/Feature comparison' };
export default meta;
type Story = StoryObj;

const demoColumns = [
  { name: 'Starter' },
  { name: 'Team', highlight: true },
  { name: 'Enterprise' },
];

const demoRows = [
  { feature: 'Projects', values: ['1', 'Unlimited', 'Unlimited'] },
  { feature: 'Components', values: ['Core', 'All 64', 'All 64'] },
  { feature: 'Dark mode & themes', values: [false, true, true] },
  { feature: 'SSO & SAML', values: [false, false, true] },
  { feature: 'Support', values: ['Community', 'Priority', 'Dedicated'] },
  {
    feature: '',
    values: [
      <button key="start" className="rdz-btn rdz-btn--outline rdz-btn--sm">Start</button>,
      <button key="team" className="rdz-btn rdz-btn--primary rdz-btn--sm">Choose Team</button>,
      <button key="contact" className="rdz-btn rdz-btn--outline rdz-btn--sm">Contact</button>,
    ],
  },
];

export const A_PlansFeatures: Story = {
  name: 'A · Plans × features, popular highlighted',
  render: () => (
    <ComparisonA
      columns={demoColumns}
      rows={demoRows}
    />
  ),
};
