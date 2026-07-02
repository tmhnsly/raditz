import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, TestimonialFigure, type SectionBaseProps } from '../../lib/SectionShell';
import { Carousel } from '../../components/media/Carousel';
import type { Testimonial } from '../Testimonials/Testimonials';
// Testimonial is re-exported from Testimonials (reaches the barrel there); a
// second `export type` here makes react-docgen emit a bogus <Testimonial /> entry.

export interface TestimonialCarouselProps extends SectionBaseProps {
  /** Testimonial entries (required). */
  quotes: Testimonial[];
  /** Optional section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'start' */
  align?: 'start' | 'center';
}

/** TestimonialCarousel A — scroll-snap carousel of quote cards. */
export function TestimonialCarouselA({ quotes, heading, align, background = 'none', children, ...props }: TestimonialCarouselProps) {
  return (
    <SectionShell background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} align={align} />
          <Carousel perView={1.15} arrows dots bleed>
            {quotes.map((q, i) => (
              <figure key={i} className="tcar__card">
                <blockquote className="sx-lh-body">{q.quote}</blockquote>
                <TestimonialFigure person={q} as="figcaption" className="sx-tcar__fig" />
              </figure>
            ))}
          </Carousel>
        </>
      )}
    </SectionShell>
  );
}
