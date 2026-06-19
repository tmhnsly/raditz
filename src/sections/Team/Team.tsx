import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function TeamA({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      <div className="col sx-team__head"><span className="eyebrow2">The people</span><h3 className="h-section">Meet the team</h3></div>
      <div className="sx-g4 sx-gap-5">
        <div className="col sx-team__member"><div className="ph sx-team__photo">MO</div><div className="col"><strong>Maya Okafor</strong><span className="muted sx-fs-body-s">Design Lead</span></div></div>
        <div className="col sx-team__member"><div className="ph ph--neutral sx-team__photo">JT</div><div className="col"><strong>Jon Tran</strong><span className="muted sx-fs-body-s">Eng Manager</span></div></div>
        <div className="col sx-team__member"><div className="ph sx-team__photo">SL</div><div className="col"><strong>Sara Lin</strong><span className="muted sx-fs-body-s">Product</span></div></div>
        <div className="col sx-team__member"><div className="ph ph--neutral sx-team__photo">AR</div><div className="col"><strong>Ada Reyes</strong><span className="muted sx-fs-body-s">Engineering</span></div></div>
      </div>
    </SectionShell>
  );
}

export function Team() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · 4-up member grid</span><TeamA /></div>
    </div>
  );
}
