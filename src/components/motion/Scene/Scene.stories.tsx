import type { Meta, StoryObj } from '@storybook/react';
import { Scene, type ScenePreset, type SceneBg } from './Scene';

const meta = {
  title: 'Components/Motion/Scene',
  component: Scene,
  parameters: {
    replay: true,
    docs: { description: { component: 'Modular animated illustrations that fill a card’s thumbnail area — pick a preset, no bespoke SVG. Scenes scale to the canvas, tint with the accent, and pause under reduced motion.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const CARDS: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'pulse', title: 'Realtime', desc: 'Live updates the moment they happen.' },
  { preset: 'orbit', title: 'Integrations', desc: 'Connect every tool in your stack.' },
  { preset: 'bars', title: 'Analytics', desc: 'Trends and breakdowns at a glance.' },
  { preset: 'grid', title: 'Coverage', desc: 'Every surface, accounted for.' },
  { preset: 'constellation', title: 'Network', desc: 'See how everything links up.' },
  { preset: 'route', title: 'Automation', desc: 'Flows that run themselves.' },
  { preset: 'burst', title: 'Achievements', desc: 'Celebrate every milestone.' },
  { preset: 'stack', title: 'Compose', desc: 'Build pages from ready-made parts.' },
  { preset: 'waves', title: 'Audio', desc: 'Sound, visualised.' },
  { preset: 'rings', title: 'Reach', desc: 'Broadcast further, every time.' },
];

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--space-4)' };
const card: React.CSSProperties = { overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-edge)', background: 'var(--panel)' };
const body: React.CSSProperties = { padding: 'var(--space-4)' };

export const FeatureCards: Story = {
  render: () => (
    <div style={grid}>
      {CARDS.map((c) => (
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
            <Scene preset="orbit" bg={bg} />
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
      <div style={card}><Scene preset="pulse" bg="soft" tone="var(--danger)" /><div style={body}><strong>danger tone</strong></div></div>
      <div style={card}><Scene preset="bars" bg="soft" tone="var(--warning)" /><div style={body}><strong>warning tone</strong></div></div>
      <div style={card}><Scene preset="constellation" bg="soft" tone="var(--accent-2, var(--accent))" /><div style={body}><strong>secondary tone</strong></div></div>
    </div>
  ),
};

export const Square: Story = {
  name: 'Square ratio',
  render: () => (
    <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))' }}>
      {(['pulse', 'orbit', 'burst', 'rings'] as ScenePreset[]).map((p) => (
        <div key={p} style={card}><Scene preset={p} ratio="1 / 1" /></div>
      ))}
    </div>
  ),
};
