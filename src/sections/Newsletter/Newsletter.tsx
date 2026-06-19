import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function NewsletterA({ background = 'gradient-aurora', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-news__wrap" background={background} {...props}>
      <div className="srx-card col sx-news__card">
        <span className="feat-ico"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
        <div className="col sx-news__copy"><strong className="sx-news__title">Get the changelog</strong><span className="muted sx-fs-body-s">New components and tokens, monthly. No spam.</span></div>
        <div className="row sx-news__form"><div className="srx-input sx-news__input">you@studio.com</div><button className="srx-btn srx-btn--primary">Subscribe</button></div>
      </div>
    </SectionShell>
  );
}

export function Newsletter() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Card signup</span><NewsletterA /></div>
    </div>
  );
}
