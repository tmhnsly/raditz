import type { Meta, StoryObj } from '@storybook/react';
import { HowItWorksA, HowItWorksB, type HowItWorksItem } from './HowItWorks';
import { demoWide } from '../../demos/images';

const meta: Meta = { title: 'Sections/HowItWorks' };
export default meta;
type Story = StoryObj;

/** Demo steps for HowItWorks A: 3 numbered steps */
const threeSteps: HowItWorksItem[] = [
  { title: 'Install', description: 'Add the package and import the stylesheet once.' },
  { title: 'Compose', description: 'Assemble pages from sections and components.' },
  { title: 'Re-skin', description: 'One accent variable retones the whole product.' },
];

/** Demo steps for HowItWorks A: 4 steps with icon markers */
const iconSteps: HowItWorksItem[] = [
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <path d="M12 3v13m0 0-4-4m4 4 4-4M4 21h16" />
      </svg>
    ),
    title: 'Install',
    description: 'pnpm add raditz',
  },
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    title: 'Compose',
    description: 'Sections snap together into pages.',
  },
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
      </svg>
    ),
    title: 'Theme',
    description: 'Swap the accent, light and dark follow.',
  },
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
    title: 'Ship',
    description: 'Accessible by default, gated by axe.',
  },
];

/** Demo steps for HowItWorks B: vertical left-ruled list */
const verticalSteps: HowItWorksItem[] = [
  { title: 'Point it at your repo', description: 'The CLI reads your tokens and existing styles.' },
  { title: 'Pick your sections', description: 'Hero, features, pricing — content-driven props.' },
  { title: 'Go live', description: 'Static output, no client JS unless you opt in.' },
];

export const A_ThreeSteps: Story = {
  name: 'A · 3 steps',
  render: () => (
    <HowItWorksA eyebrow="How it works" heading="Three steps to shipped" items={threeSteps} />
  ),
};

export const A_FourStepsIcons: Story = {
  name: 'A · 4 steps, icons',
  render: () => (
    <HowItWorksA
      eyebrow="Workflow"
      heading="From install to shipped"
      align="start"
      items={iconSteps}
    />
  ),
};

export const B_WithMedia: Story = {
  name: 'B · Vertical, with media',
  render: () => (
    <HowItWorksB
      eyebrow="How it works"
      heading="Up and running in an afternoon"
      align="start"
      items={verticalSteps}
      media={<img src={demoWide} alt="Foggy forest ridge at dawn" />}
    />
  ),
};
