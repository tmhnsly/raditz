import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';

export interface HowItWorksItem {
  title: ReactNode;
  description?: ReactNode;
  /** Replaces the step number in the marker disc when provided. */
  icon?: ReactNode;
}

export interface HowItWorksProps extends SectionBaseProps {
  /** Ordered steps (required). */
  items: HowItWorksItem[];
  /** Small label above the heading. */
  eyebrow?: ReactNode;
  /** Section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'center' */
  align?: 'start' | 'center';
}

export interface HowItWorksBProps extends HowItWorksProps {
  /** Media rendered beside the vertical step list (right column of the split). */
  media?: ReactNode;
}

/** Private: the numbered/icon marker disc every variant repeats. The `<ol>`
 * already conveys position to assistive tech, so the visible number (or the
 * decorative icon) is `aria-hidden` — AT users hear "1 of 3", not "1 1 of 3". */
function StepMarker({ item, index }: { item: HowItWorksItem; index: number }) {
  return (
    <span className="sx-hiw__marker" aria-hidden="true">
      {item.icon ?? index + 1}
    </span>
  );
}

/** Private: the title + optional description block shared by both variants. */
function StepBody({ item }: { item: HowItWorksItem }) {
  return (
    <>
      <strong className="sx-hiw__title">{item.title}</strong>
      {item.description && <span className="muted sx-fs-body-s">{item.description}</span>}
    </>
  );
}

/** How it works A — numbered steps in a row, markers joined by a connecting rule. */
export function HowItWorksA({ items, eyebrow, heading, align = 'center', background = 'none', children, ...props }: HowItWorksProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-hiw__head" />
          <ol className="sx-hiw__steps">
            {items.map((item, i) => (
              <li key={i} className="sx-hiw__step">
                <StepMarker item={item} index={i} />
                <StepBody item={item} />
              </li>
            ))}
          </ol>
        </>
      )}
    </SectionShell>
  );
}

/** How it works B — vertical left-ruled step list, optional media in a split (media right). */
export function HowItWorksB({ items, eyebrow, heading, align, media, background = 'none', children, ...props }: HowItWorksBProps) {
  const list = (
    <ol className="sx-hiw__vsteps">
      {items.map((item, i) => (
        <li key={i} className="sx-hiw__vstep">
          <StepMarker item={item} index={i} />
          <div className="col sx-hiw__vbody">
            <StepBody item={item} />
          </div>
        </li>
      ))}
    </ol>
  );
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-hiw__head" />
          {media ? (
            <div className="sx-hiw__split">
              {list}
              <div className="sx-hiw__media">{media}</div>
            </div>
          ) : (
            list
          )}
        </>
      )}
    </SectionShell>
  );
}
