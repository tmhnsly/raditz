import { useState } from 'react';
import { SectionShell } from '../../lib/SectionShell';
import { Switch } from '../../components/controls/Switch';
import { FooterA } from '../../sections/Footer';

// Placeholder imagery (swap for brand photography). Royalty-free Unsplash landscapes.
const HERO_IMG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=75';
const BAND_IMG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=75';

/**
 * Showcase — a full-bleed, scroll-through page for exercising the section
 * backgrounds: a photo hero that bleeds behind the content, gradient bands, and a
 * mid-page photo band. The floating switch flips every backdrop between `static`
 * and `parallax` so you can compare the scroll behaviour live.
 */
export function Showcase() {
  const [parallax, setParallax] = useState(true);
  return (
    <div className="rdz-page rdz-showcase">
      <div className="rdz-showcase__toggle">
        <label className="rdz-showcase__toggle-row">
          <span>Parallax</span>
          <Switch checked={parallax} onChange={(e) => setParallax(e.target.checked)} aria-label="Toggle parallax backgrounds" />
        </label>
      </div>

      {/* Full-bleed photo hero */}
      <SectionShell image={HERO_IMG} scrim parallax={parallax} wrap="col rdz-showcase__hero">
        <span className="eyebrow2">Showcase</span>
        <h1 className="h-display">Backdrops that move with you</h1>
        <p className="lede rdz-showcase__lede">A photo hero bleed, layered gradient bands and scroll-linked parallax — all token-driven, all theme-aware. Flip the switch to compare static and dynamic.</p>
        <div className="row rdz-showcase__cta">
          <button className="rdz-btn rdz-btn--primary">Get started</button>
          <button className="rdz-btn rdz-btn--outline">View components</button>
        </div>
      </SectionShell>

      {/* Gradient band — feature trio */}
      <SectionShell background="gradient-aurora" parallax={parallax} wrap="col rdz-showcase__band">
        <span className="eyebrow2">Composable</span>
        <h2 className="h-section">One token system, every surface</h2>
        <div className="rdz-auto-grid rdz-showcase__grid">
          {[
            ['Re-themeable', 'Repoint the accent and the whole page follows — gradients included.'],
            ['Responsive', 'Container queries, not breakpoints, so sections adapt at any width.'],
            ['Accessible', 'Scrims scope content to on-dark tokens so text stays legible over media.'],
          ].map(([t, d]) => (
            <div className="rdz-card col rdz-showcase__card" key={t}>
              <strong>{t}</strong>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Neutral content band */}
      <SectionShell background="surface-2" wrap="col rdz-showcase__band">
        <h2 className="h-section">Static where it counts</h2>
        <p className="lede">Not every surface needs to move. Neutral bands stay still to give the eye a rest between the dynamic ones — the rhythm is the point.</p>
      </SectionShell>

      {/* Mid-page photo band */}
      <SectionShell image={BAND_IMG} scrim parallax={parallax} wrap="col rdz-showcase__quote">
        <h2 className="h-display">“The backdrop should feel like depth, never decoration.”</h2>
      </SectionShell>

      {/* Gradient CTA */}
      <SectionShell background="gradient-mesh" parallax={parallax} scrim wrap="col rdz-showcase__band">
        <h2 className="h-section">Build the whole page from sections</h2>
        <p className="lede rdz-showcase__lede">Every band here is a SectionShell with a background choice. Compose, re-theme, ship.</p>
        <div className="row rdz-showcase__cta"><button className="rdz-btn rdz-btn--primary">Start building</button></div>
      </SectionShell>

      <FooterA
        brand={{ name: 'Raditz', blurb: 'A modular design foundation built on Radix that re-themes from a single accent.' }}
        columns={[
          { heading: 'Product', links: [{ label: 'Components' }, { label: 'Tokens' }, { label: 'Templates' }] },
          { heading: 'Resources', links: [{ label: 'Docs' }, { label: 'Changelog' }, { label: 'GitHub', href: 'https://github.com' }] },
          { heading: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Contact' }] },
        ]}
      />
    </div>
  );
}
