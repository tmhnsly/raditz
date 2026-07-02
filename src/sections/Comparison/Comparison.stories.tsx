import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonA } from './Comparison';
import { Button } from '../../components/actions/Button';

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
      <Button key="start" variant="outline" size="sm">Start</Button>,
      <Button key="team" variant="primary" size="sm">Choose Team</Button>,
      <Button key="contact" variant="outline" size="sm">Contact</Button>,
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
