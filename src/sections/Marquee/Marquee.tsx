import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';
import { Marquee as MarqueeStrip } from '../../components/media/Marquee';

export interface MarqueeSectionProps extends SectionBaseProps {
  /** Scrolling items (logos, chips, etc.). */
  items: ReactNode[];
  /** Optional caption above the strip (e.g. a "trusted by" line). */
  label?: ReactNode;
}

/** Marquee A — auto-scrolling logo strip. */
export function MarqueeA({ items, label, background = 'none', children, ...props }: MarqueeSectionProps) {
  return (
    <SectionShell pad="sm" padClassName="sx-mq__band" wrap="col sx-grid-center sx-gap-4" background={background} {...props}>
      {children ?? (
        <>
          {label && <span className="muted sx-fs-body-s">{label}</span>}
          {/* reuse the Marquee component (seamless loop) — no duplicate functionality */}
          <MarqueeStrip className="sx-mq">{items}</MarqueeStrip>
        </>
      )}
    </SectionShell>
  );
}
