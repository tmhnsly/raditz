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
      <SocialProofA
        logos={[
          { name: 'Northwind' },
          { name: 'ACME' },
          { name: 'LUMEN' },
          { name: 'Vertex' },
          { name: 'Hatch' },
        ]}
      />
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
      <TestimonialsA
        quotes={[
          {
            quote: '"We re-skinned our entire app for a rebrand in an afternoon. One token."',
            avatar: <span className="rdz-avatar sx-avatar-sm">MO</span>,
            name: 'Maya Okafor',
            role: 'Design Lead, Aurora',
          },
          {
            quote: '"The component coverage is unreal. We deleted our internal UI kit."',
            avatar: <span className="rdz-avatar sx-avatar-sm">JT</span>,
            name: 'Jon Tran',
            role: 'Eng Manager, Vertex',
          },
          {
            quote: '"Accessible by default saved us weeks of audit work."',
            avatar: <span className="rdz-avatar sx-avatar-sm">SL</span>,
            name: 'Sara Lin',
            role: 'PM, Lumen',
          },
        ]}
      />
      <PricingA
        heading="Simple, scalable pricing"
        sub="Start free. Upgrade when your team grows."
        tiers={[
          {
            name: 'Starter',
            blurb: 'For solo builders',
            price: '$0',
            period: '/mo',
            action: { label: 'Get started', href: '#', variant: 'outline' },
            features: ['1 project', 'Community support', 'Core components'],
          },
          {
            name: 'Team',
            blurb: 'For growing teams',
            price: '$24',
            period: '/seat/mo',
            action: { label: 'Start trial', href: '#', variant: 'primary' },
            features: ['Unlimited projects', 'Priority support', 'All components', 'Dark mode + themes'],
            popular: true,
          },
          {
            name: 'Enterprise',
            blurb: 'For organizations',
            price: 'Custom',
            action: { label: 'Contact sales', href: '#', variant: 'outline' },
            features: ['SSO & SAML', 'Dedicated support', 'Custom themes'],
          },
        ]}
      />
      <FaqA
        items={[
          {
            question: 'How do I install it?',
            answer: 'Link one stylesheet in your <head>. styles.css is an import manifest that pulls in scales, tokens and components.',
          },
          {
            question: 'Can I change the accent color?',
            answer: 'Repoint the accent token block — every component, state and shadow follows automatically.',
          },
          {
            question: 'Is dark mode included?',
            answer: 'Yes — it follows the OS by default with a toggle to override. class="dark" on the root flips every token; content over dark media uses the on-dark surface context.',
          },
        ]}
      />
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
