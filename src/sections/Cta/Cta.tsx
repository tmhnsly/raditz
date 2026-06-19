import { SectionShell } from '../../lib/SectionShell';

export function CtaA() {
  return (
    <SectionShell wrap="col sx-center sx-gap-5">
      <h3 className="h-section sx-cta__title">Ready to build something consistent?</h3>
      <div className="row sx-row-center"><button className="srx-btn srx-btn--primary srx-btn--lg sx-cta__pill">Get started free</button><button className="srx-btn srx-btn--outline srx-btn--lg">Talk to us</button></div>
    </SectionShell>
  );
}

export function CtaB() {
  return (
    <SectionShell padClassName="sx-cta__band" wrap="sx-cta__split">
      <div className="col sx-cta__copy"><h3 className="h-section sx-cta__title-ink">Start shipping today</h3><p className="muted sx-cta__sub">No credit card required.</p></div>
      <div className="row"><div className="srx-input sx-cta__input">you@studio.com</div><button className="srx-btn srx-btn--primary srx-btn--lg">Request access</button></div>
    </SectionShell>
  );
}

export function Cta() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Centered</span><CtaA /></div>
      <div className="variant"><span className="variant__tag">B · Split, accent surface</span><CtaB /></div>
    </div>
  );
}
