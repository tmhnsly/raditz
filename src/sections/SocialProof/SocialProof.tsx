import { Frame } from '../../lib/Frame';

export function SocialProofA() {
  return (
    <Frame>
      <div className="s-pad-sm sx-sp__band">
        <div className="s-wrap row sx-sp__row">
          <strong className="sx-sp__logo sx-sp__logo-tight">Northwind</strong>
          <strong className="sx-sp__logo sx-sp__logo-mono">ACME</strong>
          <strong className="sx-sp__logo sx-sp__logo-wide">LUMEN</strong>
          <strong className="sx-sp__logo sx-sp__logo-italic">Vertex</strong>
          <strong className="sx-sp__logo sx-sp__logo-tighter">Hatch</strong>
        </div>
      </div>
    </Frame>
  );
}

export function SocialProofB() {
  return (
    <Frame>
      <div className="s-pad-sm sx-sp__band">
        <div className="s-wrap col sx-items-center sx-gap-4">
          <span className="muted sx-fs-body-s">Trusted by teams at</span>
          <div className="row sx-sp__row-b">
            <strong className="sx-sp__logo-b">Northwind</strong>
            <strong className="sx-sp__logo-b sx-sp__logo-mono">ACME</strong>
            <strong className="sx-sp__logo-b">LUMEN</strong>
            <strong className="sx-sp__logo-b sx-sp__logo-italic">Vertex</strong>
          </div>
        </div>
      </div>
    </Frame>
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
