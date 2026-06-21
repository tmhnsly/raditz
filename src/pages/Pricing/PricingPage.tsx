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
      <NavbarB
        brand={{ name: 'Raditz', logo: <span className="sx-nav__logo-glyph-md">R</span> }}
        links={[
          { label: 'Features', href: '#' },
          { label: 'Customers', href: '#' },
          { label: 'Pricing', href: '#' },
        ]}
        actions={[{ label: 'Start free', href: '#', variant: 'primary' }]}
      />
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
      <ComparisonA
        columns={[
          { name: 'Starter' },
          { name: 'Team', highlight: true },
          { name: 'Enterprise' },
        ]}
        rows={[
          { feature: 'Projects', values: ['1', 'Unlimited', 'Unlimited'] },
          { feature: 'Components', values: ['Core', 'All 64', 'All 64'] },
          { feature: 'Dark mode & themes', values: [false, true, true] },
          { feature: 'SSO & SAML', values: [false, false, true] },
          { feature: 'Support', values: ['Community', 'Priority', 'Dedicated'] },
        ]}
      />
      <FaqB
        items={[
          { question: "What's the license?", answer: 'MIT — use it in commercial products freely.' },
          { question: 'Does it need a build step?', answer: 'No. It works from a CDN link, or self-host for production.' },
          { question: 'Which frameworks?', answer: 'Components are React; tokens and classes are framework-agnostic.' },
          { question: 'Can I extend it?', answer: 'Yes — add tokens and components; everything composes.' },
        ]}
      />
      <CtaB
        title="Start shipping today"
        sub="No credit card required."
        emailCapture={{ placeholder: 'you@studio.com', action: { label: 'Request access' } }}
      />
      <FooterB />
    </div>
  );
}
