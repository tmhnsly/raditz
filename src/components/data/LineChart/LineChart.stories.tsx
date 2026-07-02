import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';

const meta = {
  title: 'Components/Data/LineChart',
  component: LineChart,
  parameters: {
    docs: { description: { component: 'Responsive line/area chart (visx) with a value-mapped gradient stroke, labelled markers, reference-line annotations, and a crosshair tooltip.' } },
  },
  argTypes: {
    area: { control: 'boolean' },
    gradient: { control: 'boolean' },
    height: { control: 'number' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    area: true,
    gradient: false,
    height: 240,
    data: [12, 18, 15, 22, 28, 24, 33, 30, 38, 35, 42, 39].map((y, i) => ({ y, label: `W${i + 1}` })),
    formatY: (v: number) => `${v}k`,
  },
};

// ── Engagement / "episode drop-off" preset ──────────────────────────────────
const Y = [62, 70, 66, 74, 81, 78, 86, 83, 90, 88, 93, 95, 92, 84, 79, 71, 60, 48];
const TITLES = ['Pilot', 'The Gift', 'Crossroads', 'Fallout', 'Reunion', 'The Edge', 'Nightfall', 'Homecoming', 'Ashes', 'The Pact', 'Landslide', 'Zenith', 'Aftermath', 'Cold Open', 'Unraveled', 'The Drop', 'Embers', 'Finale'];
const episodes = Y.map((y, i) => ({
  y,
  label: `S${Math.floor(i / 4) + 1} · E${(i % 4) + 1}`,
  title: TITLES[i] ?? `Episode ${i + 1}`,
  rating: (y / 10).toFixed(1),
  status: y >= 85 ? 'Hooked' : y >= 70 ? 'Engaged' : 'Drop-off',
  thumb: `https://images.unsplash.com/photo-${['1506905925346-21bda4d32df4', '1441974231531-c6227db76b6e', '1470071459604-3b5ec3a7fe05', '1501785888041-af3ef285b470'][i % 4]}?auto=format&fit=crop&w=80&q=60`,
}));
const peak = Y.indexOf(Math.max(...Y));

export const Engagement: Story = {
  name: 'Engagement (episode drop-off)',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <LineChart
        data={episodes.map((e) => ({ y: e.y, label: e.label }))}
        area
        gradient
        height={260}
        markers={[{ index: peak, label: 'Peak' }]}
        references={[{ index: 15, label: 'Stop' }]}
        formatY={(v) => `${v}`}
        aria-label="Audience engagement by episode"
        renderTooltip={(_p, i) => {
          const e = episodes[i];
          return (
            <div className="rdz-chart__tip-row">
              <img className="rdz-chart__tip-thumb" src={e.thumb} alt="" />
              <div>
                <div className="rdz-chart__tip-eyebrow">{e.label}</div>
                <div className="rdz-chart__tip-title">{e.title}</div>
                <div className="rdz-chart__tip-meta">
                  <span className="rdz-chart__tip-star">★ {e.rating}</span>
                  <span className="rdz-chart__tip-tag">{e.status}</span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  ),
};
