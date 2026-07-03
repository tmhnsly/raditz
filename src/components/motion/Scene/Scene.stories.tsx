import type { Meta, StoryObj } from '@storybook/react';
import { FiZap, FiAward, FiTarget, FiUsers, FiStar, FiGlobe, FiGift, FiActivity } from 'react-icons/fi';
import { Scene, type ScenePreset, type SceneBg } from './Scene';

const meta = {
  title: 'Components/Motion/Scene',
  component: Scene,
  parameters: {
    replay: true,
    docs: { description: { component: 'Animated card-thumbnail illustrations. Most presets frame a hero `icon` with tasteful furniture (glow/rings/sparks/stars/orbit + an optional `badge` chip) so any icon becomes a tile; the rest (bars/waves/grid/constellation/route/stack) are self-contained. No bespoke SVG.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--space-4)' };
const card: React.CSSProperties = { overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-edge)', background: 'var(--panel)' };
const body: React.CSSProperties = { padding: 'var(--space-4)' };
const ic = { size: 40 } as const;

const ICON_CARDS: { preset: ScenePreset; icon: React.ReactNode; badge?: React.ReactNode; title: string; desc: string }[] = [
  { preset: 'flash', icon: <FiZap {...ic} />, badge: '4 PTS', title: 'Flash it', desc: 'First-try sends earn max points.' },
  { preset: 'stars', icon: <FiAward {...ic} />, title: 'Achievements', desc: 'Badges for streaks and podiums.' },
  { preset: 'rings', icon: <FiTarget {...ic} />, badge: 'LIVE', title: 'Reach', desc: 'Broadcast to everyone, instantly.' },
  { preset: 'halo', icon: <FiUsers {...ic} />, title: 'Crew', desc: 'Climb together, hold the board.' },
  { preset: 'spark', icon: <FiStar {...ic} />, badge: '+1 PT', title: 'Hit the zone', desc: 'Reach the bonus hold for a point.' },
  { preset: 'orbit', icon: <FiGlobe {...ic} />, title: 'Integrations', desc: 'Every tool in your stack, connected.' },
  { preset: 'pop', icon: <FiGift {...ic} />, badge: 'NEW', title: 'Rewards', desc: 'Unlock perks as you progress.' },
];

const SCENE_CARDS: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'bars', title: 'Analytics', desc: 'Trends and breakdowns at a glance.' },
  { preset: 'waves', title: 'Audio', desc: 'Sound, visualised.' },
  { preset: 'grid', title: 'Coverage', desc: 'Every surface, accounted for.' },
  { preset: 'constellation', title: 'Network', desc: 'See how everything links up.' },
  { preset: 'route', title: 'Automation', desc: 'Flows that run themselves.' },
  { preset: 'stack', title: 'Compose', desc: 'Build pages from ready-made parts.' },
];

export const IconTiles: Story = {
  render: () => (
    <div style={grid}>
      {ICON_CARDS.map((c) => (
        <div key={c.preset} style={card}>
          <Scene preset={c.preset} icon={c.icon} badge={c.badge} />
          <div style={body}>
            <strong>{c.title}</strong>
            <p className="muted" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--fs-body-s)' }}>{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Illustrations: Story = {
  render: () => (
    <div style={grid}>
      {SCENE_CARDS.map((c) => (
        <div key={c.preset} style={card}>
          <Scene preset={c.preset} />
          <div style={body}>
            <strong>{c.title}</strong>
            <p className="muted" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--fs-body-s)' }}>{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Backgrounds: Story = {
  render: () => {
    const bgs: SceneBg[] = ['gradient', 'accent', 'secondary', 'soft', 'none'];
    return (
      <div style={grid}>
        {bgs.map((bg) => (
          <div key={bg} style={card}>
            <Scene preset="flash" bg={bg} icon={<FiZap {...ic} />} />
            <div style={body}><strong>{bg}</strong></div>
          </div>
        ))}
      </div>
    );
  },
};

export const Tinted: Story = {
  render: () => (
    <div style={grid}>
      <div style={card}><Scene preset="stars" bg="soft" tone="var(--warning)" icon={<FiAward {...ic} />} /><div style={body}><strong>warning</strong></div></div>
      <div style={card}><Scene preset="rings" bg="soft" tone="var(--danger)" icon={<FiActivity {...ic} />} badge="!" /><div style={body}><strong>danger</strong></div></div>
      <div style={card}><Scene preset="bars" bg="soft" tone="var(--accent-2, var(--accent))" /><div style={body}><strong>secondary</strong></div></div>
    </div>
  ),
};

export const Square: Story = {
  name: 'Square ratio',
  render: () => (
    <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))' }}>
      <div style={card}><Scene preset="flash" ratio="1 / 1" icon={<FiZap {...ic} />} /></div>
      <div style={card}><Scene preset="orbit" ratio="1 / 1" icon={<FiGlobe {...ic} />} /></div>
      <div style={card}><Scene preset="waves" ratio="1 / 1" /></div>
      <div style={card}><Scene preset="rings" ratio="1 / 1" icon={<FiTarget {...ic} />} /></div>
    </div>
  ),
};
