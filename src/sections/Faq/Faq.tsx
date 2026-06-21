import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';
import { Accordion } from '../../components/disclosure/Accordion';

export interface FaqProps extends SectionBaseProps {
  /** FAQ items (required). */
  items: { question: ReactNode; answer: ReactNode }[];
  /** Optional section heading rendered above the content. */
  heading?: ReactNode;
}

/** Faq A — accordion-style disclosure. */
export function FaqA({ items, heading, background = 'surface-2', children, ...props }: FaqProps) {
  return (
    <SectionShell wrap="sx-faq__wrap" background={background} {...props}>
      {children ?? (
        <>
          {heading && <h2 className="h-section">{heading}</h2>}
          <Accordion
            id="faqAcc"
            type="single"
            collapsible
            defaultValue="0"
            items={items.map((item, i) => ({
              value: String(i),
              title: item.question,
              content: item.answer,
            }))}
          />
        </>
      )}
    </SectionShell>
  );
}

/** Faq B — plain two-column grid of Q&A pairs. */
export function FaqB({ items, heading, background = 'none', children, ...props }: FaqProps) {
  return (
    <SectionShell wrap="sx-faq2 sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          {heading && <h2 className="h-section">{heading}</h2>}
          {items.map((item, i) => (
            <div key={i} className="col sx-faq__item">
              <strong>{item.question}</strong>
              <span className="muted sx-body-s">{item.answer}</span>
            </div>
          ))}
        </>
      )}
    </SectionShell>
  );
}
