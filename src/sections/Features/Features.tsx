import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';

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
}

/** Features A — 3-up icon card grid. */
export function FeaturesA({ items, eyebrow, heading, background = 'none', children, ...props }: FeaturesProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} className="col sx-feat__head" />
          <div className="sx-g3 sx-gap-5">
            {items.map((item, i) => (
              <div key={i} className="rdz-card col sx-gap-3">
                {item.icon && <span className="feat-ico">{item.icon}</span>}
                <strong>{item.title}</strong>
                {item.description && <span className="muted sx-body-s">{item.description}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}

/** Features B — bento: first item as lead card, remaining as cells + wide. */
export function FeaturesB({ items, eyebrow, heading, background = 'gradient-mesh', children, ...props }: FeaturesProps) {
  const [lead, ...rest] = items;
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} className="col sx-feat__head" />
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
export function FeaturesC({ items, eyebrow, heading, background = 'surface-2', children, ...props }: FeaturesProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} className="col sx-feat__head" />
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
