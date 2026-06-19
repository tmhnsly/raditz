import { Frame } from '../../lib/Frame';

export function StatsA() {
  return (
    <Frame>
      <div className="s-pad">
        <div className="s-wrap sx-g4 sx-gap-5">
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
        </div>
      </div>
    </Frame>
  );
}

export function StatsB() {
  return (
    <Frame>
      <div className="s-pad sx-stat__band">
        <div className="s-wrap sx-g3 sx-gap-5 sx-stat__band-grid">
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
        </div>
      </div>
    </Frame>
  );
}

export function Stats() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · 4 across</span><StatsA /></div>
      <div className="variant"><span className="variant__tag">B · Accent band</span><StatsB /></div>
    </div>
  );
}
