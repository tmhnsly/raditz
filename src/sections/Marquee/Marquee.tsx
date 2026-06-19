import { Frame } from '../../lib/Frame';

export function MarqueeA() {
  return (
    <Frame>
      <div className="s-pad-sm sx-mq__band">
        <div className="s-wrap col sx-grid-center sx-gap-4">
          <span className="muted sx-fs-body-s">Trusted by fast-moving teams</span>
          <div className="mq"><div className="mq__row">
            <strong>Northwind</strong><strong className="sx-mq__mono">ACME</strong><strong>LUMEN</strong><strong className="sx-mq__italic">Vertex</strong><strong className="sx-mq__tight">Hatch</strong><strong>Aurora</strong>
            <strong>Northwind</strong><strong className="sx-mq__mono">ACME</strong><strong>LUMEN</strong><strong className="sx-mq__italic">Vertex</strong><strong className="sx-mq__tight">Hatch</strong><strong>Aurora</strong>
          </div></div>
        </div>
      </div>
    </Frame>
  );
}

export function Marquee() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Auto-scrolling logo strip</span><MarqueeA /></div>
    </div>
  );
}
