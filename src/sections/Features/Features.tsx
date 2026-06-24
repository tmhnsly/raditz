import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Reveal, RevealGroup } from '../../components/motion/Reveal';

export interface FeaturesItem {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
}

export interface FeaturesProps extends SectionBaseProps {
  /** Feature cards (required). */
  items: FeaturesItem[];
  /** Small label above the heading. */
  eyebrow?: ReactNode;
  /** Section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'start' */
  align?: 'start' | 'center';
  /** Reveal the cards on scroll-in (opt-in entrance animation). @default false */
  animate?: boolean;
}

/** Features A — 3-up icon card grid. */
export function FeaturesA({ items, eyebrow, heading, align, animate = false, background = 'none', children, ...props }: FeaturesProps) {
  // One card-content definition; wrap each in <Reveal> only when animating, so the
  // non-animated path stays byte-for-byte what it was (SSR-pure, no observers).
  const cards = items.map((item, i) => {
    const inner = (
      <>
        {item.icon && <span className="feat-ico">{item.icon}</span>}
        <strong>{item.title}</strong>
        {item.description && <span className="muted sx-body-s">{item.description}</span>}
      </>
    );
    return animate ? (
      <Reveal key={i} className="rdz-card col sx-gap-3">{inner}</Reveal>
    ) : (
      <div key={i} className="rdz-card col sx-gap-3">{inner}</div>
    );
  });
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props} animate={false}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-feat__head" />
          {animate ? (
            <RevealGroup className="sx-g3 sx-gap-5">{cards}</RevealGroup>
          ) : (
            <div className="sx-g3 sx-gap-5">{cards}</div>
          )}
        </>
      )}
    </SectionShell>
  );
}

/** Features B — bento: first item as lead card, remaining as cells + wide. */
export function FeaturesB({ items, eyebrow, heading, align, background = 'gradient-mesh', children, ...props }: FeaturesProps) {
  const [lead, ...rest] = items;
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props} animate={false}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-feat__head" />
          <div className="sx-bento sx-feat__bento">
            {lead && (
              <div className="rdz-card col sx-feat__bento-lead">
                {lead.icon && <span className="feat-ico">{lead.icon}</span>}
                <strong className="sx-feat__bento-title">{lead.title}</strong>
                {lead.description && <span className="muted sx-fs-body-s">{lead.description}</span>}
              </div>
            )}
            {rest.map((item, i) => {
              const isLast = i === rest.length - 1;
              const cls = isLast ? 'rdz-card col sx-feat__bento-wide' : 'rdz-card col sx-feat__bento-cell';
              return (
                <div key={i} className={cls}>
                  {item.icon && <span className="feat-ico">{item.icon}</span>}
                  <strong>{item.title}</strong>
                  {item.description && <span className={isLast ? 'muted sx-fs-body-s' : 'muted sx-fs-caption'}>{item.description}</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionShell>
  );
}

/** Features C — alternating media spotlights. */
export function FeaturesC({ items, eyebrow, heading, align, background = 'surface-2', children, ...props }: FeaturesProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props} animate={false}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-feat__head" />
          <div className="col sx-gap-7">
            {items.map((item, i) => {
              const isEven = i % 2 === 0;
              const copy = (
                <div className="col sx-gap-3">
                  {item.icon && <span className="eyebrow2">{item.icon}</span>}
                  <h3 className="h-section">{item.title}</h3>
                  {item.description && <p className="muted sx-lh-body">{item.description}</p>}
                </div>
              );
              return (
                <div key={i} className="sx-split sx-feat__spotlight">
                  {isEven ? (
                    <>{copy}{item.media}</>
                  ) : (
                    <>{item.media}{copy}</>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionShell>
  );
}
