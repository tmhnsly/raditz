import type { Meta, StoryObj } from '@storybook/react';
import { SectionBackground } from './SectionBackground';

const meta = {
  title: 'Components/Layout/SectionBackground',
  component: SectionBackground,
  parameters: {
    docs: { description: { component: 'Optional decorative section backdrop — neutral level, templated gradient, or image/video, with optional parallax. Gives glass panels something to sit over. Default is plain for fast wireframing.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

function GlassPanel({ label }: { label: string }) {
  return (
    <div style={{ padding: '4.5rem 2rem', display: 'grid', placeItems: 'center' }}>
      <div
        style={{
          padding: '2rem 2.5rem',
          textAlign: 'center',
          maxWidth: 380,
          borderRadius: 'var(--radius-card)',
          background: 'var(--glass)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          border: '1px solid var(--surface-edge)',
          boxShadow: 'var(--shadow-3)',
        }}
      >
        <strong style={{ fontSize: '1.25rem' }}>{label}</strong>
        <p className="muted" style={{ marginTop: '0.5rem', fontSize: 'var(--fs-body-s)' }}>A glass panel sitting over the section background.</p>
      </div>
    </div>
  );
}

export const GradientAccent: Story = {
  render: () => <SectionBackground background="gradient-accent"><GlassPanel label="gradient-accent" /></SectionBackground>,
};
export const Aurora: Story = {
  render: () => <SectionBackground background="gradient-aurora"><GlassPanel label="gradient-aurora" /></SectionBackground>,
};
export const Dusk: Story = {
  render: () => <SectionBackground background="gradient-dusk"><GlassPanel label="gradient-dusk" /></SectionBackground>,
};
export const Mesh: Story = {
  render: () => <SectionBackground background="gradient-mesh"><GlassPanel label="gradient-mesh" /></SectionBackground>,
};
export const SurfaceLevels: Story = {
  render: () => (
    <div>
      <SectionBackground background="surface"><GlassPanel label="surface (neutral 1)" /></SectionBackground>
      <SectionBackground background="surface-2"><GlassPanel label="surface-2 (neutral 2)" /></SectionBackground>
    </div>
  ),
};

/** Parallax shifts the backdrop layer on scroll (gentle; respects reduced-motion). */
export const Parallax: Story = {
  render: () => <SectionBackground background="gradient-aurora" parallax><GlassPanel label="gradient-aurora + parallax" /></SectionBackground>,
};

export const Image: Story = {
  render: () => (
    <SectionBackground image="https://picsum.photos/1200/600" parallax>
      <GlassPanel label="image backdrop" />
    </SectionBackground>
  ),
};

export const Video: Story = {
  render: () => (
    <SectionBackground video="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4">
      <GlassPanel label="video backdrop" />
    </SectionBackground>
  ),
};
