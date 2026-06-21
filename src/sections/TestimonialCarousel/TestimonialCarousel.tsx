import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';
import { Carousel } from '../../components/media/Carousel';
import type { Testimonial } from '../Testimonials/Testimonials';
// Testimonial is re-exported from Testimonials (reaches the barrel there); a
// second `export type` here makes react-docgen emit a bogus <Testimonial /> entry.

export interface TestimonialCarouselProps extends SectionBaseProps {
  /** Testimonial entries (required). */
  quotes: Testimonial[];
  /** Optional section heading. */
  heading?: ReactNode;
}

/** TestimonialCarousel A — scroll-snap carousel of quote cards. */
export function TestimonialCarouselA({ quotes, heading, background = 'none', children, ...props }: TestimonialCarouselProps) {
  return (
    <SectionShell background={background} {...props}>
      {children ?? (
        <>
          {heading && <h2 className="h-section">{heading}</h2>}
          <Carousel perView={1.15} arrows dots bleed>
            {quotes.map((q, i) => (
              <figure key={i} className="tcar__card">
                <blockquote className="sx-lh-body">{q.quote}</blockquote>
                <figcaption className="row sx-tcar__fig">
                  {q.avatar}
                  <div className="col">
                    {q.name && <strong className="sx-fs-body-s">{q.name}</strong>}
                    {q.role && <span className="muted sx-fs-caption">{q.role}</span>}
                  </div>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </>
      )}
    </SectionShell>
  );
}
