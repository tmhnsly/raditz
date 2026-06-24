import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { CountUp } from '../../components/display/CountUp';

/** A string/number stat value rolls up via CountUp; richer nodes render as-is. */
function statValue(value: ReactNode): ReactNode {
  return typeof value === 'number' || typeof value === 'string' ? <CountUp value={value} /> : value;
}

export interface StatItem {
  value: ReactNode;
  label: ReactNode;
}

export interface StatsProps extends SectionBaseProps {
  /** Stat cells (required). */
  stats: StatItem[];
  /** Optional section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'start' */
  align?: 'start' | 'center';
}

/** Stats A — 4-across grid. */
export function StatsA({ stats, heading, align, background = 'none', children, ...props }: StatsProps) {
  return (
    <SectionShell wrap="col sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} align={align} className="col sx-stat__head" />
          <div className="sx-g4 sx-gap-5">
            {stats.map((stat, i) => (
              <div key={i} className="col sx-stat__cell">
                <span className="sx-stat__num">{statValue(stat.value)}</span>
                <span className="muted sx-fs-body-s">{stat.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}

/** Stats B — accent band, 3-cell grid. */
export function StatsB({ stats, heading, align, background = 'none', children, ...props }: StatsProps) {
  return (
    <SectionShell padClassName="sx-stat__band" wrap="col sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} align={align} className="col sx-stat__head" />
          <div className="sx-g3 sx-gap-5 sx-stat__band-grid">
            {stats.map((stat, i) => (
              <div key={i} className="col sx-stat__cell">
                <span className="sx-stat__band-num">{statValue(stat.value)}</span>
                <span className="sx-stat__band-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
