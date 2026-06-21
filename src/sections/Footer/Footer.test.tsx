import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Footer.stories';
import { FooterA, FooterB } from './Footer';

const composed = composeStories(stories);

describe('Footer (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('FooterA renders brand name and column headings', () => {
    const { getByText } = render(
      <FooterA
        brand={{ name: 'Raditz', blurb: 'A great lib.' }}
        columns={[{ heading: 'Product', links: [{ label: 'Components' }] }]}
      />
    );
    getByText('Raditz');
    getByText('Product');
    getByText('Components');
    getByText('A great lib.');
  });

  it('FooterA renders a monogram glyph (not a hardcoded letter) when brand has no logo', () => {
    const { getByText, queryByText } = render(<FooterA brand={{ name: 'Acme' }} />);
    // Full name as the wordmark...
    getByText('Acme');
    // ...plus a monogram from the name — not the old hardcoded "S".
    getByText('A');
    expect(queryByText('S')).toBeNull();
  });

  it('FooterA renders nothing extra when brand and columns are absent', () => {
    const { container } = render(<FooterA />);
    expect(container).toBeTruthy();
  });

  it('FooterB renders a brand monogram from brand.name when provided', () => {
    const { getByText, queryByText } = render(
      <FooterB brand={{ name: 'Acme' }} copyright="© 2026 Acme" />
    );
    getByText('© 2026 Acme');
    getByText('A');
    expect(queryByText('S')).toBeNull();
  });

  it('FooterB renders no brand glyph when brand is absent', () => {
    const { queryByText } = render(<FooterB copyright="© 2026 Raditz" />);
    // The old hardcoded "S" glyph must be gone.
    expect(queryByText('S')).toBeNull();
  });

  it('FooterB renders copyright and nav links', () => {
    const { getByText } = render(
      <FooterB
        copyright="© 2026 Raditz"
        columns={[{ heading: 'Legal', links: [{ label: 'Privacy' }, { label: 'Terms' }] }]}
      />
    );
    getByText('© 2026 Raditz');
    getByText('Privacy');
    getByText('Terms');
  });

  it('FooterB renders nothing extra when copyright and columns are absent', () => {
    const { container } = render(<FooterB />);
    expect(container).toBeTruthy();
  });

  it('children override body in FooterA', () => {
    const { getByText, queryByText } = render(
      <FooterA brand={{ name: 'Raditz' }}>
        <span>Custom body</span>
      </FooterA>
    );
    getByText('Custom body');
    expect(queryByText('Raditz')).toBeNull();
  });

  it('children override body in FooterB', () => {
    const { getByText, queryByText } = render(
      <FooterB copyright="© 2026 Raditz">
        <span>Custom bar</span>
      </FooterB>
    );
    getByText('Custom bar');
    expect(queryByText('© 2026 Raditz')).toBeNull();
  });
});
