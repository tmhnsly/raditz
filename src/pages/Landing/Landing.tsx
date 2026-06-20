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
      <FeaturesA />
      <StatsB />
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
