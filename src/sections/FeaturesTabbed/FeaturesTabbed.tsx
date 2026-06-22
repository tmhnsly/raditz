'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';
import { cx } from '../../components/internal';

export interface FeaturesTabbedItem {
  /** Tab label in the left rail (and the accessible tab name). */
  label: ReactNode;
  /** Prominent lead block for the panel — e.g. a price / rate list. */
  lead?: ReactNode;
  /** Body paragraph. */
  description?: ReactNode;
  /** Feature checklist — rendered as ticked items in a two-column grid. */
  features?: ReactNode[];
  /** Panel CTA. */
  action?: SectionAction;
}

export interface FeaturesTabbedProps extends SectionBaseProps {
  /** One entry per tab (required). */
  items: FeaturesTabbedItem[];
  eyebrow?: ReactNode;
  heading?: ReactNode;
  /** Header alignment. @default 'center' */
  align?: 'start' | 'center';
  /** Extra node pinned under the tab rail (e.g. opening hours, terms). */
  aside?: ReactNode;
}

/**
 * FeaturesTabbed — a vertical tab rail beside a detail panel: pick an offering on
 * the left, read its lead (price/rates), description, ticked feature list and CTA
 * on the right. Built for "a few rich, comparable offerings" where cards bury the
 * detail. The panel holds a steady min-height so switching tabs never makes the
 * page jump. Uncontrolled (first tab open) — a deep section, no wiring required.
 */
export function FeaturesTabbed({ items, eyebrow, heading, align = 'center', aside, ...props }: FeaturesTabbedProps) {
  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  return (
    <SectionShell {...props}>
      {(eyebrow || heading) && <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-feat__head" />}
      <div className="rdz-ftabs">
        <div className="rdz-ftabs__rail" role="tablist" aria-orientation="vertical">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              id={`rdz-ftab-${i}`}
              aria-selected={i === active}
              aria-controls={`rdz-ftabpanel-${i}`}
              className={cx('rdz-ftabs__tab', i === active && 'rdz-ftabs__tab--active')}
              onClick={() => setActive(i)}
            >
              {it.label}
            </button>
          ))}
          {aside && <div className="rdz-ftabs__aside">{aside}</div>}
        </div>

        <div className="rdz-ftabs__panel" role="tabpanel" id={`rdz-ftabpanel-${active}`} aria-labelledby={`rdz-ftab-${active}`}>
          {item.lead && <div className="rdz-ftabs__lead">{item.lead}</div>}
          {item.description && <p className="rdz-ftabs__desc">{item.description}</p>}
          {item.features && item.features.length > 0 && (
            <ul className="rdz-ftabs__features">
              {item.features.map((f, i) => (
                <li key={i} className="rdz-ftabs__feature">
                  <svg className="rdz-ftabs__tick" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
          {item.action && <SectionActions actions={[item.action]} className="row rdz-ftabs__actions" />}
        </div>
      </div>
    </SectionShell>
  );
}
