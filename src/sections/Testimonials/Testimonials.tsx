import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, TestimonialFigure, type SectionBaseProps } from '../../lib/SectionShell';

/** A single testimonial entry — shared with TestimonialCarousel. */
export interface Testimonial {
  /** The quote text. */
  quote: ReactNode;
  /** Attributee name. */
  name?: ReactNode;
  /** Attributee role / company. */
  role?: ReactNode;
  /** Avatar node (e.g. `<span className="rdz-avatar">MO</span>`). */
  avatar?: ReactNode;
}

export interface TestimonialsProps extends SectionBaseProps {
  /** Testimonial entries (required). */
  quotes: Testimonial[];
  /** Optional section heading. */
  heading?: ReactNode;
}

/** Testimonials A — three-column quote cards. */
export function TestimonialsA({ quotes, heading, background = 'gradient-dusk', children, ...props }: TestimonialsProps) {
  return (
    <SectionShell wrap="sx-g3 sx-gap-4" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} />
          {quotes.map((q, i) => (
            <div key={i} className="rdz-card col sx-tst__card">
              <p className="sx-tst__quote">{q.quote}</p>
              <TestimonialFigure person={q} className="sx-tst__person" />
            </div>
          ))}
        </>
      )}
    </SectionShell>
  );
}

/** Testimonials B — single large pull-quote with centered attribution. */
export function TestimonialsB({ quotes, heading, background = 'gradient-dusk', children, ...props }: TestimonialsProps) {
  const q = quotes[0];
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          {heading && <span className="eyebrow2">{heading}</span>}
          {q && (
            <>
              <p className="sx-tst__big-quote">{q.quote}</p>
              <TestimonialFigure person={q} className="sx-tst__person-center" metaClassName="sx-tst__person-meta" />
            </>
          )}
        </>
      )}
    </SectionShell>
  );
}
