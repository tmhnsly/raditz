import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function TestimonialsA({ background = 'gradient-dusk', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-g3 sx-gap-4" background={background} parallax={parallax} image={image} video={video}>
      <div className="srx-card col sx-tst__card"><p className="sx-tst__quote">“We re-skinned our entire app for a rebrand in an afternoon. One token.”</p><div className="row sx-tst__person"><span className="srx-avatar sx-avatar-sm">MO</span><div className="col"><strong className="sx-fs-body-s">Maya Okafor</strong><span className="muted sx-fs-caption">Design Lead, Aurora</span></div></div></div>
      <div className="srx-card col sx-tst__card"><p className="sx-tst__quote">“The component coverage is unreal. We deleted our internal UI kit.”</p><div className="row sx-tst__person"><span className="srx-avatar sx-avatar-sm">JT</span><div className="col"><strong className="sx-fs-body-s">Jon Tran</strong><span className="muted sx-fs-caption">Eng Manager, Vertex</span></div></div></div>
      <div className="srx-card col sx-tst__card"><p className="sx-tst__quote">“Accessible by default saved us weeks of audit work.”</p><div className="row sx-tst__person"><span className="srx-avatar sx-avatar-sm">SL</span><div className="col"><strong className="sx-fs-body-s">Sara Lin</strong><span className="muted sx-fs-caption">PM, Lumen</span></div></div></div>
    </SectionShell>
  );
}

export function TestimonialsB({ background = 'gradient-dusk', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} parallax={parallax} image={image} video={video}>
      <span className="eyebrow2">Customer story</span>
      <p className="sx-tst__big-quote">“SuperRadix is the first design system our designers and engineers actually agree on.”</p>
      <div className="row sx-tst__person-center"><span className="srx-avatar sx-tst__avatar-md">MO</span><div className="col sx-tst__person-meta"><strong className="sx-fs-body-s">Maya Okafor</strong><span className="muted sx-fs-caption">Design Lead, Aurora</span></div></div>
    </SectionShell>
  );
}

export function Testimonials() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · 3 quote cards</span><TestimonialsA /></div>
      <div className="variant"><span className="variant__tag">B · Single large quote</span><TestimonialsB /></div>
    </div>
  );
}
