import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal';

export interface TimelineItem {
  /** Event headline. */
  title: ReactNode;
  /** Mono eyebrow above the title — typically a date or phase label. */
  meta?: ReactNode;
  /** Supporting copy under the title. */
  description?: ReactNode;
  /** Custom marker content; replaces the default dot (or check for `done`). */
  icon?: ReactNode;
  /** Emphasis of the marker. @default 'default' */
  tone?: 'default' | 'accent' | 'done';
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** The events, in display order. */
  items: TimelineItem[];
  /** Axis direction — vertical only for now; horizontal can join later. @default 'vertical' */
  orientation?: 'vertical';
}

/**
 * Timeline — an ordered list of events on a continuous rule. Each item is a
 * marker disc (icon, dot, or check) with a content block beside it: mono
 * eyebrow meta, semibold title, soft description. `tone` colours the marker
 * (`accent` for the active step, `done` for completed ones). Non-interactive.
 */
export function Timeline({ items, orientation = 'vertical', className, ...rest }: TimelineProps) {
  return (
    <ol className={cx('rdz-timeline', className)} data-orientation={orientation} {...rest}>
      {items.map((item, i) => (
        <li key={i} className="rdz-timeline__item" data-tone={item.tone ?? 'default'}>
          <span className="rdz-timeline__marker" aria-hidden="true">
            {item.icon ??
              (item.tone === 'done' ? (
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="rdz-timeline__dot" />
              ))}
          </span>
          <div className="rdz-timeline__body">
            {item.meta != null && <div className="rdz-timeline__meta">{item.meta}</div>}
            <div className="rdz-timeline__title">{item.title}</div>
            {item.description != null && <div className="rdz-timeline__description">{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
