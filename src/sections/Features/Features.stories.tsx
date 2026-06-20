import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesA, FeaturesB, FeaturesC, type FeaturesItem } from './Features';

const meta: Meta = { title: 'Sections/Features' };
export default meta;
type Story = StoryObj;

/** Demo items for Features A: 3-up icon cards */
const iconCardItems: FeaturesItem[] = [
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
      </svg>
    ),
    title: '12-step color',
    description: 'Radix scales aliased to semantic tokens, light & dark.',
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
    title: '53 components',
    description: 'The full Radix primitive surface, styled and accessible.',
  },
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
    title: 'Re-skin instantly',
    description: 'One accent variable retones the entire product.',
  },
];

/** Demo items for Features B: bento grid (lead + cells + wide) */
const bentoItems: FeaturesItem[] = [
  {
    icon: (
      <svg className="ico" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
      </svg>
    ),
    title: 'Token-driven theming',
    description: 'Colors, type, spacing, radius, motion — all variables.',
  },
  {
    title: 'Dark mode',
    description: 'class="dark"',
  },
  {
    title: 'A11y',
    description: 'Keyboard + ARIA',
  },
  {
    title: 'Eight radius rules',
    description: 'Concentric corners, size-proportional, formal↔friendly.',
  },
];

/** Demo items for Features C: alternating spotlights */
const spotlightItems: FeaturesItem[] = [
  {
    icon: 'Composable',
    title: 'Build pages from sections',
    description:
      'Drop in heroes, pricing, testimonials and footers — all sharing one type scale and palette.',
    media: <div className="ph sx-feat__media">A</div>,
  },
  {
    icon: 'Consistent',
    title: 'Themed end to end',
    description:
      'Every section reads from the same tokens, so a re-skin is global and instant.',
    media: <div className="ph ph--neutral sx-feat__media">B</div>,
  },
];

export const A_IconCards: Story = {
  name: 'A · 3-up icon cards',
  render: () => (
    <FeaturesA
      eyebrow="Why Raditz"
      heading="Everything wired together"
      items={iconCardItems}
    />
  ),
};

export const B_BentoGrid: Story = {
  name: 'B · Bento grid',
  render: () => <FeaturesB items={bentoItems} />,
};

export const C_AlternatingSpotlight: Story = {
  name: 'C · Alternating spotlight',
  render: () => <FeaturesC items={spotlightItems} />,
};
