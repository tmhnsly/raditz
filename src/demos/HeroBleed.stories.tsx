import type { Meta, StoryObj } from '@storybook/react';
import { HeroBleed } from '../lib/HeroBleed';

const meta = {
  title: 'Demos/Hero bleed',
  parameters: {
    docs: { description: { component: 'A hero whose background bleeds to the top of the viewport behind a transparent, floating nav — one continuous wash instead of nav + hero having separate, seamed backgrounds. The bleed mechanism is decoupled from the hero content, so any hero design can be dropped in.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

/** A transparent site nav (no background of its own) — floats over the bleed. */
function FloatingNav() {
  return (
    <div className="nav-bar">
      <div className="row sx-nav__brand-row">
        <span className="feat-ico sx-nav__logo"><span className="sx-nav__logo-glyph">S</span></span>
        <strong className="sx-nav__brand">Raditz</strong>
      </div>
      <nav className="nav-bar__links"><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
      <div className="nav-bar__cta"><button className="rdz-btn" data-variant="primary" data-size="md">Get started</button></div>
    </div>
  );
}

export const Aurora: Story = {
  render: () => (
    <HeroBleed background="gradient-aurora" parallax nav={<FloatingNav />} wrap="col sx-center sx-gap-5">
      <span className="eyebrow2">Design system</span>
      <h1 className="h-display">Ship a polished UI on day one</h1>
      <p className="lede" style={{ maxWidth: '42ch' }}>One accent token retones the entire product — accessible, themeable, dependency-free.</p>
      <div className="row sx-row-center">
        <button className="rdz-btn" data-variant="primary" data-size="lg">Start building</button>
        <button className="rdz-btn" data-variant="glass" data-size="lg">Live demo</button>
      </div>
    </HeroBleed>
  ),
};

export const Dusk: Story = {
  render: () => (
    <HeroBleed background="gradient-dusk" nav={<FloatingNav />} wrap="col sx-center sx-gap-5">
      <h1 className="h-display">Same shell, any hero</h1>
      <p className="lede" style={{ maxWidth: '42ch' }}>The bleed + floating nav are decoupled from the content — drop in a different hero layout and keep the effect.</p>
    </HeroBleed>
  ),
};

// Photo + video share the same content/layout (only the media source differs),
// and the same URLs as the SectionBackground demos for consistency. Media auto-
// enables a scrim + light text so the hero stays legible.
const mediaHero = (
  <>
    <span className="eyebrow2">On any backdrop</span>
    <h1 className="h-display">Bleed a photo or video behind the nav</h1>
    <p className="lede" style={{ maxWidth: '42ch' }}>The backdrop is scrimmed and the text goes light automatically, so the hero stays readable over busy media.</p>
    <div className="row sx-row-center">
      <button className="rdz-btn" data-variant="primary" data-size="lg">Start building</button>
      <button className="rdz-btn" data-variant="glass" data-size="lg">Live demo</button>
    </div>
  </>
);

export const Image: Story = {
  render: () => (
    <HeroBleed image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=75" parallax nav={<FloatingNav />} wrap="col sx-center sx-gap-5">
      {mediaHero}
    </HeroBleed>
  ),
};

export const Video: Story = {
  render: () => (
    <HeroBleed video="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" nav={<FloatingNav />} wrap="col sx-center sx-gap-5">
      {mediaHero}
    </HeroBleed>
  ),
};
