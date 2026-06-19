import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';
import { Marquee as MarqueeStrip } from '../../components/media/Marquee';

export function MarqueeA({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell pad="sm" padClassName="sx-mq__band" wrap="col sx-grid-center sx-gap-4" background={background} {...props}>
      <span className="muted sx-fs-body-s">Trusted by fast-moving teams</span>
      {/* reuse the Marquee component (seamless loop) — no duplicate functionality */}
      <MarqueeStrip className="sx-mq">
        <strong>Northwind</strong>
        <strong className="sx-mq__mono">ACME</strong>
        <strong>LUMEN</strong>
        <strong className="sx-mq__italic">Vertex</strong>
        <strong className="sx-mq__tight">Hatch</strong>
        <strong>Aurora</strong>
      </MarqueeStrip>
    </SectionShell>
  );
}
