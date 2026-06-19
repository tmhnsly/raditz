import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function StatsA({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-g4 sx-gap-5" background={background} {...props}>
      <div className="col sx-stat__cell">
        <span className="sx-stat__num">53</span>
        <span className="muted sx-fs-body-s">components</span>
      </div>
      <div className="col sx-stat__cell">
        <span className="sx-stat__num">188</span>
        <span className="muted sx-fs-body-s">design tokens</span>
      </div>
      <div className="col sx-stat__cell">
        <span className="sx-stat__num">12</span>
        <span className="muted sx-fs-body-s">color steps</span>
      </div>
      <div className="col sx-stat__cell">
        <span className="sx-stat__num">1</span>
        <span className="muted sx-fs-body-s">line to re-skin</span>
      </div>
    </SectionShell>
  );
}

export function StatsB({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell padClassName="sx-stat__band" wrap="sx-g3 sx-gap-5 sx-stat__band-grid" background={background} {...props}>
      <div className="col sx-stat__cell">
        <span className="sx-stat__band-num">99.9%</span>
        <span className="sx-stat__band-label">uptime</span>
      </div>
      <div className="col sx-stat__cell">
        <span className="sx-stat__band-num">40ms</span>
        <span className="sx-stat__band-label">p95 latency</span>
      </div>
      <div className="col sx-stat__cell">
        <span className="sx-stat__band-num">12k+</span>
        <span className="sx-stat__band-label">teams</span>
      </div>
    </SectionShell>
  );
}
