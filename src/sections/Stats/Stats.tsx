import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';

export interface StatItem {
  value: ReactNode;
  label: ReactNode;
}

export interface StatsProps extends SectionBaseProps {
  /** Stat cells (required). */
  stats: StatItem[];
  /** Optional section heading. */
  heading?: ReactNode;
}

/** Stats A — 4-across grid. */
export function StatsA({ stats, heading, background = 'none', children, ...props }: StatsProps) {
  return (
    <SectionShell wrap="col sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} className="col sx-stat__head" />
          <div className="sx-g4 sx-gap-5">
            {stats.map((stat, i) => (
              <div key={i} className="col sx-stat__cell">
                <span className="sx-stat__num">{stat.value}</span>
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
export function StatsB({ stats, heading, background = 'none', children, ...props }: StatsProps) {
  return (
    <SectionShell padClassName="sx-stat__band" wrap="col sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} className="col sx-stat__head" />
          <div className="sx-g3 sx-gap-5 sx-stat__band-grid">
            {stats.map((stat, i) => (
              <div key={i} className="col sx-stat__cell">
                <span className="sx-stat__band-num">{stat.value}</span>
                <span className="sx-stat__band-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
