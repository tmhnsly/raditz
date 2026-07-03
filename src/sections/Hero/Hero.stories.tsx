import type { Meta, StoryObj } from '@storybook/react';
import { HeroA, HeroB, HeroC } from './Hero';

const meta: Meta = { title: 'Sections/Hero', parameters: { replay: true } };
export default meta;
type Story = StoryObj;

export const A_CenteredDualCTA: Story = {
  name: 'A · Centered, dual CTA',
  render: () => (
    <HeroA
      eyebrow="New · v2 components"
      title="The design foundation that re-skins in one line"
      lede="Radix Colors and a token system wired into 53 components. Change one accent and the whole product follows."
      actions={[
        { label: 'Get started', href: '#' },
        { label: 'Read the docs', href: '#', variant: 'outline' },
      ]}
    />
  ),
};

export const B_SplitCopyMedia: Story = {
  name: 'B · Split — copy + media',
  render: () => (
    <HeroB
      eyebrow="Design system"
      title="Ship a polished UI on day one"
      lede="Accessible components, semantic tokens, dark mode and motion — all consistent, all themeable."
      actions={[
        { label: 'Start building', href: '#' },
        { label: 'Live demo →', href: '#', variant: 'glass' },
      ]}
      media={<div className="ph sx-hero__media">product shot</div>}
    />
  ),
};

export const C_AccentFullBleed: Story = {
  name: 'C · Accent full-bleed',
  render: () => (
    <HeroC
      title="One accent token. Infinite themes."
      lede="Cyan, iris, jade — flip a variable and every surface, state and shadow recolors in place."
      actions={[{ label: 'Try the switcher', href: '#' }]}
    />
  ),
};
