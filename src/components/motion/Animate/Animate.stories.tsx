import type { Meta, StoryObj } from '@storybook/react';
import { FiStar, FiHeart, FiZap, FiBell, FiSun, FiRefreshCw, FiArrowUp, FiGift } from 'react-icons/fi';
import { Animate, type AnimatePreset } from './Animate';

const meta = {
  title: 'Components/Motion/Animate',
  component: Animate,
  parameters: {
    replay: true,
    docs: { description: { component: 'A modular animation wrapper — pick a preset, drop it around any element (icon, card, badge, heading). Loops idle; one-shots fire on hover/inview/mount.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cell: React.CSSProperties = { display: 'grid', placeItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid var(--surface-edge)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-mono-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(6.5rem, 1fr))', gap: '0.75rem' };
const icon = { size: 26, 'aria-hidden': true } as const;

const LOOPS: [AnimatePreset, React.ReactNode][] = [
  ['float', <FiArrowUp {...icon} />], ['float-x', <FiRefreshCw {...icon} />], ['pulse', <FiHeart {...icon} />],
  ['breathe', <FiSun {...icon} />], ['spin', <FiRefreshCw {...icon} />], ['orbit', <FiSun {...icon} />],
  ['wiggle', <FiBell {...icon} />], ['sway', <FiStar {...icon} />], ['bob', <FiGift {...icon} />],
  ['heartbeat', <FiHeart {...icon} />], ['glow', <FiZap {...icon} />], ['blink', <FiStar {...icon} />],
];
const ONESHOTS: AnimatePreset[] = ['pop', 'tada', 'jelly', 'shake', 'bounce', 'rubber'];

export const Loops: Story = {
  render: () => (
    <div style={grid}>
      {LOOPS.map(([preset, node]) => (
        <div key={preset} style={cell}>
          <Animate preset={preset}>{node}</Animate>
          {preset}
        </div>
      ))}
    </div>
  ),
};

export const OnHover: Story = {
  name: 'One-shots (hover to play)',
  render: () => (
    <div style={grid}>
      {ONESHOTS.map((preset) => (
        <div key={preset} style={cell}>
          <Animate preset={preset} trigger="hover"><FiZap {...icon} /></Animate>
          {preset}
        </div>
      ))}
    </div>
  ),
};

export const CardShimmer: Story = {
  render: () => (
    <Animate as="div" preset="shimmer" className="rdz-card" style={{ width: '18rem', padding: 'var(--space-5)' }}>
      <strong>Featured</strong>
      <p className="muted" style={{ marginTop: 'var(--space-2)' }}>A shimmer sweep on any surface — great for highlights and skeleton-to-content reveals.</p>
    </Animate>
  ),
};

export const Tuned: Story = {
  name: 'Speed + delay + repeat',
  render: () => (
    <div style={grid}>
      <div style={cell}><Animate preset="pulse" speed="fast"><FiHeart {...icon} /></Animate>fast</div>
      <div style={cell}><Animate preset="pulse" speed="slow"><FiHeart {...icon} /></Animate>slow</div>
      <div style={cell}><Animate preset="bounce" trigger="mount" repeat={3}><FiArrowUp {...icon} /></Animate>×3</div>
      <div style={cell}><Animate preset="spin" delay={600}><FiRefreshCw {...icon} /></Animate>delay</div>
    </div>
  ),
};
