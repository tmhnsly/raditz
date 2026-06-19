import { SectionShell } from '../../lib/SectionShell';

export function BlogA() {
  return (
    <SectionShell wrap="sx-g3 sx-gap-5">
      <article className="srx-card sx-blog__card"><div className="ph sx-blog__cover">cover</div><div className="col sx-blog__body"><span className="eyebrow2 sx-fs-caption">Engineering</span><strong className="sx-blog__title">Re-skinning in one line</strong><span className="muted sx-body-s">How semantic tokens make a rebrand a one-variable change.</span></div></article>
      <article className="srx-card sx-blog__card"><div className="ph ph--neutral sx-blog__cover">cover</div><div className="col sx-blog__body"><span className="eyebrow2 sx-fs-caption">Design</span><strong className="sx-blog__title">The eight radius rules</strong><span className="muted sx-body-s">Concentric corners and the formal↔friendly spectrum.</span></div></article>
      <article className="srx-card sx-blog__card"><div className="ph sx-blog__cover">cover</div><div className="col sx-blog__body"><span className="eyebrow2 sx-fs-caption">Product</span><strong className="sx-blog__title">53 → 64 components</strong><span className="muted sx-body-s">What shipped in the latest release and why.</span></div></article>
    </SectionShell>
  );
}

export function BlogB() {
  return (
    <SectionShell wrap="col sx-blog__list">
      <a href="#" className="blogrow"><div className="col sx-blog__row-body"><div className="row sx-blog__row-meta"><span className="eyebrow2 sx-fs-caption">Engineering</span><span className="muted sx-fs-caption">Jun 12</span></div><strong className="sx-blog__row-title">Re-skinning in one line</strong></div><span className="blogrow__arrow">→</span></a>
      <a href="#" className="blogrow"><div className="col sx-blog__row-body"><div className="row sx-blog__row-meta"><span className="eyebrow2 sx-fs-caption">Design</span><span className="muted sx-fs-caption">Jun 4</span></div><strong className="sx-blog__row-title">The eight radius rules</strong></div><span className="blogrow__arrow">→</span></a>
      <a href="#" className="blogrow"><div className="col sx-blog__row-body"><div className="row sx-blog__row-meta"><span className="eyebrow2 sx-fs-caption">Product</span><span className="muted sx-fs-caption">May 28</span></div><strong className="sx-blog__row-title">53 → 64 components</strong></div><span className="blogrow__arrow">→</span></a>
    </SectionShell>
  );
}

export function Blog() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Card grid with cover</span><BlogA /></div>
      <div className="variant"><span className="variant__tag">B · Editorial list rows</span><BlogB /></div>
    </div>
  );
}
