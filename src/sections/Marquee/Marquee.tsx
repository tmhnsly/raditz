import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function MarqueeA({ background = 'none', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell pad="sm" padClassName="sx-mq__band" wrap="col sx-grid-center sx-gap-4" background={background} parallax={parallax} image={image} video={video}>
      <span className="muted sx-fs-body-s">Trusted by fast-moving teams</span>
      <div className="mq"><div className="mq__row">
        <strong>Northwind</strong><strong className="sx-mq__mono">ACME</strong><strong>LUMEN</strong><strong className="sx-mq__italic">Vertex</strong><strong className="sx-mq__tight">Hatch</strong><strong>Aurora</strong>
        <strong>Northwind</strong><strong className="sx-mq__mono">ACME</strong><strong>LUMEN</strong><strong className="sx-mq__italic">Vertex</strong><strong className="sx-mq__tight">Hatch</strong><strong>Aurora</strong>
      </div></div>
    </SectionShell>
  );
}

export function Marquee() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Auto-scrolling logo strip</span><MarqueeA /></div>
    </div>
  );
}
