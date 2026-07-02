import { describe, it, expect, vi } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionActionButton, SectionHeader, SectionShell, TestimonialFigure } from './SectionShell';
import { TestimonialsA } from '../sections/Testimonials/Testimonials';
import { TestimonialCarouselA } from '../sections/TestimonialCarousel/TestimonialCarousel';
import { FeaturesA } from '../sections/Features/Features';
import { FaqA, FaqB } from '../sections/Faq/Faq';
import { BlogA, BlogB } from '../sections/Blog/Blog';
import { ComparisonA } from '../sections/Comparison/Comparison';
import { PricingA, PricingB } from '../sections/Pricing/Pricing';
import { NotFoundA } from '../sections/NotFound/NotFound';
import { CtaA, CtaB } from '../sections/Cta/Cta';

describe('SectionShell choreography', () => {
  it('wraps content in the .s-choreo cascade by default, and not when animate={false}', () => {
    const { container, rerender } = render(<SectionShell><p>body</p></SectionShell>);
    expect(container.querySelector('.s-wrap.s-choreo')).toBeTruthy();
    rerender(<SectionShell animate={false}><p>body</p></SectionShell>);
    expect(container.querySelector('.s-wrap.s-choreo')).toBeNull();
    expect(container.querySelector('.s-wrap')).toBeTruthy();
  });
});

describe('SectionShell root passthrough', () => {
  it('forwards className, id and data-* to the root Frame', () => {
    const { container } = render(
      <SectionShell className="consumer-cls" id="pricing" data-testid="shell-root" frameClassName="nav-frame">
        <p>body</p>
      </SectionShell>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('frame')).toBe(true); // still the Frame root
    expect(root.classList.contains('nav-frame')).toBe(true); // shell's own class kept
    expect(root.classList.contains('consumer-cls')).toBe(true); // consumer class merged
    expect(root.id).toBe('pricing');
    expect(root.getAttribute('data-testid')).toBe('shell-root');
  });

  it('a section variant (FaqA) carries className/id/data-* end-to-end to its root', () => {
    const { container } = render(
      <FaqA items={[{ question: 'q', answer: 'a' }]} heading="H" className="anchor-cls" id="faq" data-testid="faq-root" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('frame')).toBe(true);
    expect(root.classList.contains('anchor-cls')).toBe(true);
    expect(root.id).toBe('faq');
    expect(root.getAttribute('data-testid')).toBe('faq-root');
    // The section still renders its content inside the shell.
    expect(screen.getByText('q')).toBeTruthy();
  });
});

describe('SectionActionButton', () => {
  it('forwards every SectionAction field (href, onClick, icon, variant, size)', () => {
    const onClick = vi.fn();
    render(<SectionActionButton action={{ label: 'Go', href: '/x', onClick, icon: 'arrow-right', variant: 'soft', size: 'lg' }} />);
    const el = screen.getByText('Go').closest('a, button')!;
    expect(el.getAttribute('href')).toBe('/x');
    fireEvent.click(el); expect(onClick).toHaveBeenCalled();
  });
  it('applies defaultVariant only when the action omits variant', () => {
    const { rerender } = render(<SectionActionButton action={{ label: 'A' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.getAttribute('data-variant')).toBe('outline');
    rerender(<SectionActionButton action={{ label: 'A', variant: 'primary' }} defaultVariant="outline" />);
    expect(screen.getByText('A').closest('a, button')!.getAttribute('data-variant')).toBe('primary');
  });
});

describe('SectionHeader', () => {
  it('renders null when empty, eyebrow+heading when given', () => {
    const { container, rerender } = render(<SectionHeader />);
    expect(container.firstChild).toBeNull();
    rerender(<SectionHeader eyebrow="Why" heading="Wired" />);
    expect(screen.getByText('Why')).toBeTruthy();
    expect(screen.getByText('Wired')).toBeTruthy();
  });
  it('defaults the heading to h2 (the shared section level); `as` overrides', () => {
    const { rerender } = render(<SectionHeader heading="Level" />);
    expect(screen.getByText('Level').tagName).toBe('H2');
    rerender(<SectionHeader heading="Level" as="h3" />);
    expect(screen.getByText('Level').tagName).toBe('H3');
  });
  it('appends headingClassName to the heading tag alongside h-section', () => {
    render(<SectionHeader heading="Inked" headingClassName="sx-cta__title-ink" />);
    const h = screen.getByText('Inked');
    expect(h.className).toContain('h-section');
    expect(h.className).toContain('sx-cta__title-ink');
  });
});

describe('TestimonialFigure', () => {
  it('renders avatar + name + role with the wrapper/meta classes', () => {
    const { container } = render(
      <TestimonialFigure
        person={{ name: 'Ada', role: 'Engineer', avatar: <span>AV</span> }}
        className="sx-tst__person-center"
        metaClassName="sx-tst__person-meta"
      />,
    );
    expect(container.querySelector('.row.sx-tst__person-center')).toBeTruthy();
    expect(container.querySelector('.col.sx-tst__person-meta')).toBeTruthy();
    expect(screen.getByText('Ada').tagName).toBe('STRONG');
    expect(screen.getByText('Engineer')).toBeTruthy();
    expect(screen.getByText('AV')).toBeTruthy();
  });
  it('guards absent name/role individually', () => {
    const { container, rerender } = render(<TestimonialFigure person={{ name: 'Solo' }} />);
    expect(screen.getByText('Solo')).toBeTruthy();
    expect(container.querySelector('.muted')).toBeNull();
    rerender(<TestimonialFigure person={{ role: 'CTO' }} />);
    expect(container.querySelector('strong')).toBeNull();
    expect(screen.getByText('CTO')).toBeTruthy();
    rerender(<TestimonialFigure person={{}} />);
    expect(container.querySelector('strong, .muted')).toBeNull();
  });
  it('renders as <figcaption> when a figure caller asks for it', () => {
    const { container } = render(
      <TestimonialFigure person={{ name: 'Fig' }} as="figcaption" className="sx-tcar__fig" />,
    );
    expect(container.querySelector('figcaption.row.sx-tcar__fig')).toBeTruthy();
  });
});

describe('section heading level coherence', () => {
  // Sibling sections composed on one page must emit the same heading level for
  // the same role — they all route through SectionHeader's default (h2).
  const sections: [string, ReactElement][] = [
    ['TestimonialsA', <TestimonialsA quotes={[{ quote: 'q' }]} heading="H" />],
    ['TestimonialCarouselA', <TestimonialCarouselA quotes={[{ quote: 'q' }]} heading="H" />],
    ['FeaturesA', <FeaturesA items={[{ title: 't' }]} heading="H" />],
    ['FaqA', <FaqA items={[{ question: 'q', answer: 'a' }]} heading="H" />],
    ['FaqB', <FaqB items={[{ question: 'q', answer: 'a' }]} heading="H" />],
    ['BlogA', <BlogA posts={[{ title: 't' }]} heading="H" />],
    ['BlogB', <BlogB posts={[{ title: 't' }]} heading="H" />],
    ['ComparisonA', <ComparisonA columns={[{ name: 'c' }]} rows={[{ feature: 'f', values: [true] }]} heading="H" />],
    ['PricingA', <PricingA tiers={[{ name: 'n', price: '$' }]} heading="H" />],
    ['PricingB', <PricingB tiers={[{ name: 'n', price: '$' }]} heading="H" />],
    ['NotFoundA', <NotFoundA />],
    ['CtaA', <CtaA title="H" />],
    ['CtaB', <CtaB title="H" />],
  ];
  it.each(sections)('%s renders its section heading as h2', (_name, el) => {
    const { container, unmount } = render(el);
    const headings = container.querySelectorAll('.h-section');
    expect(headings.length).toBeGreaterThan(0);
    for (const h of headings) expect(h.tagName).toBe('H2');
    unmount();
  });
});
