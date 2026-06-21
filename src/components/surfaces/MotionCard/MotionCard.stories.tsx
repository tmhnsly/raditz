import type { Meta, StoryObj } from '@storybook/react';
import { GiMoonOrbit } from 'react-icons/gi';
import { MotionCard, type MotionCardTone } from './MotionCard';
import { Icon } from '../../foundation/Icon/Icon';

const meta: Meta = { title: 'Components/Surfaces/MotionCard' };
export default meta;
type Story = StoryObj;

const TONES: MotionCardTone[] = ['accent', 'secondary', 'aurora', 'dusk', 'glass', 'mono'];

export const Tones: Story = {
  name: 'Brand-colored presets (clickable, reveal on scroll)',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {TONES.map((tone, i) => (
        <MotionCard
          key={tone}
          tone={tone}
          index={i}
          href="#"
          eyebrow={tone}
          title="Animated preset card"
          icon={tone === 'aurora' ? <GiMoonOrbit /> : <Icon name="star" />}
          iconAnim={tone === 'aurora' ? 'orbit' : 'float'}
        >
          Built from our gradient, accent and secondary tokens — hover for the arrow.
        </MotionCard>
      ))}
    </div>
  ),
};
