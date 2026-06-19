import { NavbarB } from '../../sections/Navbar';
import { PricingB } from '../../sections/Pricing';
import { ComparisonA } from '../../sections/Comparison';
import { FaqB } from '../../sections/Faq';
import { CtaB } from '../../sections/Cta';
import { FooterB } from '../../sections/Footer';

/**
 * Pricing — a full pricing page composed from SuperRadix sections: a glass nav,
 * the monthly/annual pricing toggle, a plan comparison table, FAQ, CTA band and
 * a minimal footer. Re-themes from the same tokens.
 */
export function PricingPage() {
  return (
    <div className="srx-page">
      <NavbarB />
      <PricingB />
      <ComparisonA />
      <FaqB />
      <CtaB />
      <FooterB />
    </div>
  );
}
