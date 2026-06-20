import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function CtaA({ background = 'gradient-dusk', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} {...props}>
      <h3 className="h-section sx-cta__title">Ready to build something consistent?</h3>
      <div className="row sx-row-center"><button className="rdz-btn rdz-btn--primary rdz-btn--lg sx-cta__pill">Get started free</button><button className="rdz-btn rdz-btn--outline rdz-btn--lg">Talk to us</button></div>
    </SectionShell>
  );
}

export function CtaB({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell padClassName="sx-cta__band" wrap="sx-cta__split" background={background} {...props}>
      <div className="col sx-cta__copy"><h3 className="h-section sx-cta__title-ink">Start shipping today</h3><p className="muted sx-cta__sub">No credit card required.</p></div>
      <div className="row"><div className="rdz-input sx-cta__input">you@studio.com</div><button className="rdz-btn rdz-btn--primary rdz-btn--lg">Request access</button></div>
    </SectionShell>
  );
}
