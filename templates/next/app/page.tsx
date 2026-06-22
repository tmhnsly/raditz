import { NavbarA, HeroA, FeaturesA, FooterA } from 'raditz';

// A real page is composed from Raditz sections. The .rdz-page wrapper in
// app/layout.tsx flattens the preview frame so these stack edge-to-edge with a
// sticky nav. Discover more sections in node_modules/raditz/catalog/llms.txt.
export default function Home() {
  return (
    <>
      <NavbarA
        brand={{ name: 'Your brand', href: '/' }}
        links={[
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#' },
        ]}
        actions={[{ label: 'Get started', href: '#' }]}
      />
      <HeroA
        eyebrow="Built with Raditz"
        title="Ship a polished UI on day one"
        lede="Replace these sections with your own — every component re-themes from one accent token in app/theme.css."
        actions={[{ label: 'Get started', href: '#' }]}
      />
      <div id="features">
        <FeaturesA
          eyebrow="Why Raditz"
          heading="Everything wired together"
          items={[
            { title: 'Themeable', description: 'One accent token retones the entire product, light and dark.' },
            { title: 'Accessible', description: 'The full Radix primitive surface, styled and keyboard-ready.' },
            { title: 'Content-driven', description: 'Feed sections data; swap variants to recompose the page.' },
          ]}
        />
      </div>
      <FooterA
        brand={{ name: 'Your brand', blurb: 'Built with the Raditz design system.' }}
        copyright="© Your brand"
      />
    </>
  );
}
