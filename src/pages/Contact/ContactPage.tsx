import { NavbarA } from '../../sections/Navbar';
import { ContactA } from '../../sections/Contact';
import { FooterA } from '../../sections/Footer';

/**
 * Contact — a full contact page: the glass Navbar over the Contact section
 * (details beside a message form) and the Footer. The section owns the layout
 * and form; this page just frames it with navigation and re-themes with tokens.
 */
export function ContactPage() {
  return (
    <div className="rdz-page">
      <NavbarA
        brand={{ name: 'Raditz', logo: <span className="sx-nav__logo-glyph">R</span> }}
        links={[
          { label: 'Product', href: '#' },
          { label: 'Pricing', href: '#' },
          { label: 'Docs', href: '#' },
        ]}
        actions={[{ label: 'Get started', href: '#', variant: 'primary' }]}
      />

      <ContactA
        eyebrow="Get in touch"
        heading="Let's talk"
        lede="Questions, partnerships, or a demo — send a note and we'll reply within a business day."
        details={[
          { label: 'Email', value: 'hello@raditz.dev', href: 'mailto:hello@raditz.dev' },
          { label: 'Phone', value: '+44 20 7946 0000', href: 'tel:+442079460000' },
          { label: 'Studio', value: 'Farnham, Surrey' },
        ]}
        aside="Open Monday–Thursday, 10am–8pm."
        onSubmit={() => {}}
      />

      <FooterA
        brand={{ name: 'Raditz', blurb: 'A modular design foundation built on Radix that re-themes from a single accent.' }}
        columns={[
          { heading: 'Product', links: [{ label: 'Components' }, { label: 'Tokens' }, { label: 'Templates' }] },
          { heading: 'Company', links: [{ label: 'About' }, { label: 'Contact' }] },
        ]}
      />
    </div>
  );
}
