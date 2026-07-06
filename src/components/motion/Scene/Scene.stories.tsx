import type { Meta, StoryObj } from '@storybook/react';
import { FiZap, FiTarget, FiUsers, FiStar, FiGlobe, FiGift, FiFeather, FiSun, FiHeart } from 'react-icons/fi';
import { Scene, type ScenePreset, type SceneBg, type SceneTone } from './Scene';

const meta = {
  title: 'Components/Motion/Scene',
  component: Scene,
  parameters: {
    replay: true,
    docs: { description: { component: 'Animated card-thumbnail primitives. Presets are one-prop recipes built from exported `Scene.X` layers — compose your own when the recipes don\'t fit. Semantic `tone` × `bg` theming rides the design tokens; badge chips only render when supplied.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--space-4)' };
const card: React.CSSProperties = { overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-edge)', background: 'var(--panel)' };
const body: React.CSSProperties = { padding: 'var(--space-4)' };
const ic = { size: 40 } as const;

function Tile({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      {children}
      <div style={body}>
        <strong>{title}</strong>
        {desc && <p className="muted" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--fs-body-s)' }}>{desc}</p>}
      </div>
    </div>
  );
}

const ICON_TILES: { preset: ScenePreset; icon: React.ReactNode; title: string; desc: string }[] = [
  { preset: 'flash', icon: <FiZap {...ic} />, title: 'Instant', desc: 'Actions land the moment you click.' },
  { preset: 'rings', icon: <FiTarget {...ic} />, title: 'Reach', desc: 'Publish to every device at once.' },
  { preset: 'halo', icon: <FiSun {...ic} />, title: 'Focus', desc: 'One place for the work that matters.' },
  { preset: 'spark', icon: <FiStar {...ic} />, title: 'Highlights', desc: 'Surface the moments worth sharing.' },
  { preset: 'stars', icon: <FiHeart {...ic} />, title: 'Favourites', desc: 'Pin what your team loves.' },
  { preset: 'orbit', icon: <FiGlobe {...ic} />, title: 'Integrations', desc: 'Every tool in your stack, connected.' },
  { preset: 'pop', icon: <FiGift {...ic} />, title: 'Releases', desc: 'Ship updates on your own schedule.' },
  { preset: 'beam', icon: <FiUsers {...ic} />, title: 'Spotlight', desc: 'Put your best work front and centre.' },
  { preset: 'drift', icon: <FiFeather {...ic} />, title: 'Calm by default', desc: 'Quiet motion for serious surfaces.' },
];

const PRODUCT_TILES: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'chat', title: 'Support', desc: 'Conversations, resolved in-thread.' },
  { preset: 'terminal', title: 'Developer-first', desc: 'A CLI that keeps up with you.' },
  { preset: 'window', title: 'Templates', desc: 'Start from a page, not a blank file.' },
  { preset: 'shield', title: 'Security', desc: 'Protected by default, verified always.' },
  { preset: 'card', title: 'Billing', desc: 'Payments without the paperwork.' },
  { preset: 'pins', title: 'Logistics', desc: 'Know where everything is, live.' },
];

const DATA_TILES: { preset: ScenePreset; title: string; desc: string }[] = [
  { preset: 'trend', title: 'Growth', desc: 'Watch the numbers move up.' },
  { preset: 'gauge', title: 'Performance', desc: 'Fast, and measurably so.' },
  { preset: 'bars', title: 'Analytics', desc: 'Trends and breakdowns at a glance.' },
  { preset: 'grid', title: 'Coverage', desc: 'Every surface, accounted for.' },
  { preset: 'constellation', title: 'Network', desc: 'See how everything links up.' },
  { preset: 'route', title: 'Automation', desc: 'Flows that run themselves.' },
  { preset: 'waves', title: 'Audio', desc: 'Sound, visualised.' },
  { preset: 'stack', title: 'Compose', desc: 'Build pages from ready-made parts.' },
];

export const IconTiles: Story = {
  render: () => (
    <div style={grid}>
      {ICON_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} icon={c.icon} /></Tile>
      ))}
    </div>
  ),
};

export const ProductScenes: Story = {
  render: () => (
    <div style={grid}>
      {PRODUCT_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} /></Tile>
      ))}
    </div>
  ),
};

export const DataScenes: Story = {
  render: () => (
    <div style={grid}>
      {DATA_TILES.map((c) => (
        <Tile key={c.preset} title={c.title} desc={c.desc}><Scene preset={c.preset} /></Tile>
      ))}
    </div>
  ),
};

/** The grid strategy: rotate a small tone palette across cards. */
export const Tones: Story = {
  render: () => {
    const rotation: SceneTone[] = ['accent', 'info', 'secondary', 'success', 'neutral'];
    const presets: ScenePreset[] = ['flash', 'chat', 'trend', 'orbit', 'shield'];
    return (
      <div style={grid}>
        {presets.map((p, i) => (
          <Tile key={p} title={String(rotation[i])} desc="tones[i % tones.length]">
            <Scene preset={p} tone={rotation[i]} icon={p === 'flash' || p === 'orbit' ? <FiZap {...ic} /> : undefined} />
          </Tile>
        ))}
      </div>
    );
  },
};

export const Backgrounds: Story = {
  render: () => (
    <div style={grid}>
      {(['gradient', 'solid', 'soft', 'none'] as SceneBg[]).map((bg) => (
        <Tile key={bg} title={bg}><Scene preset="flash" bg={bg} icon={<FiZap {...ic} />} /></Tile>
      ))}
    </div>
  ),
};

/** Layers compose freely — mix illustrations, decorations and chips. */
export const Composed: Story = {
  render: () => (
    <div style={grid}>
      <Tile title="Icon over waves" desc="Scene.Waves + Scene.Icon">
        <Scene tone="info"><Scene.Waves /><Scene.Icon motion="float"><FiGlobe {...ic} /></Scene.Icon></Scene>
      </Tile>
      <Tile title="Quiet spotlight" desc="Beam + soft halo">
        <Scene bg="soft"><Scene.Beam /><Scene.Halo strength="soft" /><Scene.Icon><FiSun {...ic} /></Scene.Icon></Scene>
      </Tile>
      <Tile title="Dense radar" desc="Rings ×5, fast">
        <Scene speed="fast"><Scene.Glow strength="soft" /><Scene.Rings count={5} /><Scene.Icon><FiTarget {...ic} /></Scene.Icon></Scene>
      </Tile>
    </div>
  ),
};

/** Chips are strictly opt-in — this is the only story that shows them. */
export const WithBadge: Story = {
  render: () => (
    <div style={grid}>
      <Tile title="Announcement"><Scene preset="pop" icon={<FiGift {...ic} />} badge="NEW" /></Tile>
      <Tile title="Live status"><Scene preset="rings" tone="danger" icon={<FiTarget {...ic} />} badge="LIVE" /></Tile>
      <Tile title="Composed chip">
        <Scene tone="success"><Scene.Trend /><Scene.Badge>+24%</Scene.Badge></Scene>
      </Tile>
    </div>
  ),
};

export const SquareRatio: Story = {
  name: 'Square ratio',
  render: () => (
    <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))' }}>
      <div style={card}><Scene preset="flash" ratio="1 / 1" icon={<FiZap {...ic} />} /></div>
      <div style={card}><Scene preset="gauge" ratio="1 / 1" /></div>
      <div style={card}><Scene preset="chat" ratio="1 / 1" /></div>
      <div style={card}><Scene preset="orbit" ratio="1 / 1" icon={<FiGlobe {...ic} />} /></div>
    </div>
  ),
};
