import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Reveal, RevealGroup } from '../../components/motion/Reveal';

export interface FeaturesItem {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
}

/** Private: renders one feature card — the icon + title + description body that
 * every card variant repeats (FeaturesA card, FeaturesB bento lead/cell/wide).
 * `reveal` swaps the wrapper for a {@link Reveal} (same classes, same DOM shape)
 * for FeaturesA's opt-in entrance. Descriptions are muted body-small by default;
 * `descSize="caption"` is the deliberate step down for the compact bento cells.
 * (FeaturesC's media spotlight is a different shape and stays bespoke.) */
function FeatureCard({
  item,
  className,
  titleClassName,
  descSize = 'body',
  reveal = false,
}: {
  item: FeaturesItem;
  className: string;
  titleClassName?: string;
  descSize?: 'body' | 'caption';
  reveal?: boolean;
}) {
  const body = (
    <>
      {item.icon && <span className="feat-ico">{item.icon}</span>}
      <strong className={titleClassName}>{item.title}</strong>
      {item.description && (
        <span className={descSize === 'caption' ? 'muted sx-fs-caption' : 'muted sx-body-s'}>{item.description}</span>
      )}
    </>
  );
  return reveal ? <Reveal className={className}>{body}</Reveal> : <div className={className}>{body}</div>;
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
  // One card definition; FeatureCard swaps its wrapper for <Reveal> only when
  // animating, so the non-animated path stays byte-for-byte what it was
  // (SSR-pure, no observers).
  const cards = items.map((item, i) => (
    <FeatureCard key={i} item={item} className="rdz-card col sx-gap-3" reveal={animate} />
  ));
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
              <FeatureCard item={lead} className="rdz-card col sx-feat__bento-lead" titleClassName="sx-feat__bento-title" />
            )}
            {rest.map((item, i) => {
              const isLast = i === rest.length - 1;
              return (
                <FeatureCard
                  key={i}
                  item={item}
                  className={isLast ? 'rdz-card col sx-feat__bento-wide' : 'rdz-card col sx-feat__bento-cell'}
                  descSize={isLast ? 'body' : 'caption'}
                />
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
