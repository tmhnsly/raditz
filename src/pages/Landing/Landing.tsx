import { NavbarA } from '../../sections/Navbar';
import { HeroB } from '../../sections/Hero';
import { SocialProofA } from '../../sections/SocialProof';
import { FeaturesA } from '../../sections/Features';
import { StatsB } from '../../sections/Stats';
import { TestimonialsA } from '../../sections/Testimonials';
import { PricingA } from '../../sections/Pricing';
import { FaqA } from '../../sections/Faq';
import { CtaA } from '../../sections/Cta';
import { FooterA } from '../../sections/Footer';

/**
 * Landing — a full marketing page composed entirely from Raditz sections.
 * Swap any variant (e.g. HeroB → HeroA) to recompose the page; everything
 * re-skins and re-themes from the same tokens.
 */
export function Landing() {
  return (
    <div className="rdz-page">
      <NavbarA />
      <HeroB
        eyebrow="Design system"
        title="Ship a polished UI on day one"
        lede="Accessible components, semantic tokens, dark mode and motion — all consistent, all themeable."
        actions={[
          { label: 'Start building', href: '#' },
          { label: 'Live demo →', href: '#', variant: 'glass' },
        ]}
        media={<div className="ph sx-hero__media">product shot</div>}
      />
      <SocialProofA />
      <FeaturesA
        eyebrow="Why Raditz"
        heading="Everything wired together"
        items={[
          { title: '12-step color', description: 'Radix scales aliased to semantic tokens, light & dark.' },
          { title: '53 components', description: 'The full Radix primitive surface, styled and accessible.' },
          { title: 'Re-skin instantly', description: 'One accent variable retones the entire product.' },
        ]}
      />
      <StatsB
        stats={[
          { value: '99.9%', label: 'uptime' },
          { value: '40ms', label: 'p95 latency' },
          { value: '12k+', label: 'teams' },
        ]}
      />
      <TestimonialsA />
      <PricingA />
      <FaqA />
      <CtaA
        title="Ready to build something consistent?"
        actions={[
          { label: 'Get started free', href: '#' },
          { label: 'Talk to us', href: '#', variant: 'outline' },
        ]}
      />
      <FooterA />
    </div>
  );
}
