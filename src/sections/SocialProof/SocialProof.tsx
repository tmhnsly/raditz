import { SectionShell } from '../../lib/SectionShell';

export function SocialProofA() {
  return (
    <SectionShell pad="sm" padClassName="sx-sp__band" wrap="row sx-sp__row">
      <strong className="sx-sp__logo sx-sp__logo-tight">Northwind</strong>
      <strong className="sx-sp__logo sx-sp__logo-mono">ACME</strong>
      <strong className="sx-sp__logo sx-sp__logo-wide">LUMEN</strong>
      <strong className="sx-sp__logo sx-sp__logo-italic">Vertex</strong>
      <strong className="sx-sp__logo sx-sp__logo-tighter">Hatch</strong>
    </SectionShell>
  );
}

export function SocialProofB() {
  return (
    <SectionShell pad="sm" padClassName="sx-sp__band" wrap="col sx-items-center sx-gap-4">
      <span className="muted sx-fs-body-s">Trusted by teams at</span>
      <div className="row sx-sp__row-b">
        <strong className="sx-sp__logo-b">Northwind</strong>
        <strong className="sx-sp__logo-b sx-sp__logo-mono">ACME</strong>
        <strong className="sx-sp__logo-b">LUMEN</strong>
        <strong className="sx-sp__logo-b sx-sp__logo-italic">Vertex</strong>
      </div>
    </SectionShell>
  );
}

export function SocialProof() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Logo row</span><SocialProofA /></div>
      <div className="variant"><span className="variant__tag">B · Heading + logos</span><SocialProofB /></div>
    </div>
  );
}
