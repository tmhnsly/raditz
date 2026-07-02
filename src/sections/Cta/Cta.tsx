'use client';
import type { ReactNode } from 'react';
import { SectionShell, SectionActions, SectionActionButton, SectionHeader, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';
import { Input } from '../../components/inputs/Input';

export interface CtaProps extends SectionBaseProps {
  /** Headline (required). */
  title: ReactNode;
  /** Sub-text / tagline under the title. */
  sub?: ReactNode;
  /** Call-to-action buttons. */
  actions?: SectionAction[];
  /** Inline email-capture form (CtaB). */
  emailCapture?: { placeholder?: string; action: SectionAction };
  /** CtaA alignment: 'center' or 'start' (left). @default 'center' */
  align?: 'start' | 'center';
}

/** CTA A — centered column with dual CTA. */
export function CtaA({ title, sub, actions, align = 'center', background = 'gradient-dusk', children, ...props }: CtaProps) {
  const centered = align === 'center';
  return (
    <SectionShell wrap={centered ? 'col sx-center sx-gap-5' : 'col sx-gap-5'} background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={title} headingClassName="sx-cta__title" />
          {sub && <p className="muted sx-cta__sub">{sub}</p>}
          <SectionActions actions={actions} size="lg" className={centered ? 'row sx-row-center' : 'row'} />
        </>
      )}
    </SectionShell>
  );
}

/** CTA B — split layout with email capture. */
export function CtaB({ title, sub, emailCapture, background = 'none', children, ...props }: CtaProps) {
  return (
    <SectionShell padClassName="sx-cta__band" wrap="sx-cta__split" background={background} {...props}>
      {children ?? (
        <>
          <div className="col sx-cta__copy">
            <SectionHeader heading={title} headingClassName="sx-cta__title-ink" />
            {sub && <p className="muted sx-cta__sub">{sub}</p>}
          </div>
          {emailCapture && (
            <div className="row">
              <Input type="email" className="sx-cta__input" placeholder={emailCapture.placeholder} aria-label="Email address" />
              <SectionActionButton action={emailCapture.action} size="lg" />
            </div>
          )}
        </>
      )}
    </SectionShell>
  );
}
