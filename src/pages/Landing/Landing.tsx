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
      <HeroB />
      <SocialProofA />
      <FeaturesA />
      <StatsB />
      <TestimonialsA />
      <PricingA />
      <FaqA />
      <CtaA />
      <FooterA />
    </div>
  );
}
