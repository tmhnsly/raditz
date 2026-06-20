import { NavbarB } from '../../sections/Navbar';
import { PricingB } from '../../sections/Pricing';
import { ComparisonA } from '../../sections/Comparison';
import { FaqB } from '../../sections/Faq';
import { CtaB } from '../../sections/Cta';
import { FooterB } from '../../sections/Footer';

/**
 * Pricing — a full pricing page composed from Raditz sections: a glass nav,
 * the monthly/annual pricing toggle, a plan comparison table, FAQ, CTA band and
 * a minimal footer. Re-themes from the same tokens.
 */
export function PricingPage() {
  return (
    <div className="rdz-page">
      <NavbarB />
      <PricingB
        heading="Pay monthly or save yearly"
        tiers={[
          {
            name: 'Pro',
            price: '$24',
            priceYearly: '$19',
            period: '/mo',
            action: { label: 'Choose Pro', href: '#', variant: 'primary' },
          },
          {
            name: 'Business',
            price: '$60',
            priceYearly: '$48',
            period: '/mo',
            action: { label: 'Choose Business', href: '#', variant: 'outline' },
          },
        ]}
      />
      <ComparisonA />
      <FaqB />
      <CtaB
        title="Start shipping today"
        sub="No credit card required."
        emailCapture={{ placeholder: 'you@studio.com', action: { label: 'Request access' } }}
      />
      <FooterB />
    </div>
  );
}
