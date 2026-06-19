import { Frame } from '../../lib/Frame';

export function FooterA() {
  return (
    <Frame>
      <div className="s-pad sx-foot__panel"><div className="s-wrap sx-footer sx-gap-6">
        <div className="col sx-foot__brand"><div className="row sx-foot__brand-row"><span className="feat-ico sx-foot__logo"><span className="sx-foot__logo-glyph">S</span></span><strong>SuperRadix</strong></div><span className="muted sx-body-s">A modular design foundation built on Radix that re-themes from a single accent.</span></div>
        <div className="col sx-foot__col"><strong className="sx-foot__col-head">Product</strong><span className="muted">Components</span><span className="muted">Tokens</span><span className="muted">Templates</span></div>
        <div className="col sx-foot__col"><strong className="sx-foot__col-head">Resources</strong><span className="muted">Docs</span><span className="muted">Changelog</span><span className="muted">GitHub</span></div>
        <div className="col sx-foot__col"><strong className="sx-foot__col-head">Company</strong><span className="muted">About</span><span className="muted">Careers</span><span className="muted">Contact</span></div>
      </div></div>
    </Frame>
  );
}

export function FooterB() {
  return (
    <Frame>
      <div className="s-pad-sm sx-foot__bar"><div className="s-wrap row sx-foot__bar-inner">
        <div className="row sx-foot__bar-brand"><span className="feat-ico sx-foot__logo-sm"><span className="sx-foot__logo-glyph-sm">S</span></span><span className="muted sx-fs-body-s">© 2026 SuperRadix</span></div>
        <nav className="row sx-foot__nav"><span>Privacy</span><span>Terms</span><span>Status</span></nav>
      </div></div>
    </Frame>
  );
}

export function Footer() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Multi-column</span><FooterA /></div>
      <div className="variant"><span className="variant__tag">B · Minimal bar</span><FooterB /></div>
    </div>
  );
}
