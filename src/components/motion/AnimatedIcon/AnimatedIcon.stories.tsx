import type { Meta, StoryObj } from '@storybook/react';
import { GiMoonOrbit } from 'react-icons/gi';
import { AnimatedIcon, type IconAnim } from './AnimatedIcon';
import { Icon } from '../../display/Icon/Icon';

const meta: Meta = { title: 'Components/Motion/AnimatedIcon' };
export default meta;
type Story = StoryObj;

// Pair AnimatedIcon with react-icons (GiMoonOrbit) and the Raditz <Icon/> set.
const DEMOS: Array<{ anim: IconAnim; label: string; glyph: React.ReactNode }> = [
  { anim: 'orbit', label: 'orbit · GiMoonOrbit', glyph: <GiMoonOrbit size="2.4em" /> },
  { anim: 'float', label: 'float', glyph: <Icon name="star" size="2.4em" /> },
  { anim: 'pulse', label: 'pulse', glyph: <Icon name="heart" size="2.4em" /> },
  { anim: 'spin', label: 'spin', glyph: <Icon name="settings" size="2.4em" /> },
  { anim: 'wiggle', label: 'wiggle', glyph: <Icon name="bell" size="2.4em" /> },
  { anim: 'draw', label: 'draw (stroked)', glyph: <Icon name="check" size="2.4em" /> },
];

export const Gallery: Story = {
  name: 'Starter set (react-icons + Raditz Icon)',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {DEMOS.map(({ anim, label, glyph }) => (
        <div key={anim} className="rdz-card col sx-gap-3" style={{ padding: 'var(--space-5)', alignItems: 'center', textAlign: 'center' }}>
          <AnimatedIcon anim={anim} style={{ color: 'var(--accent-ink)' }}>{glyph}</AnimatedIcon>
          <span className="muted sx-fs-body-s">{label}</span>
        </div>
      ))}
    </div>
  ),
};
