import { SectionShell } from '../../lib/SectionShell';
import { Carousel } from '../../components/media/Carousel';

export function TestimonialCarouselA() {
  return (
    <SectionShell>
      <Carousel perView={1.1} arrows dots>
        <figure className="tcar__card"><blockquote className="sx-lh-body">“We re-skinned our entire app for a rebrand in an afternoon. One token.”</blockquote><figcaption className="row sx-tcar__fig"><span className="srx-avatar sx-avatar-sm">MO</span><div className="col"><strong className="sx-fs-body-s">Maya Okafor</strong><span className="muted sx-fs-caption">Design Lead, Aurora</span></div></figcaption></figure>
        <figure className="tcar__card"><blockquote className="sx-lh-body">“The component coverage is unreal. We deleted our internal UI kit.”</blockquote><figcaption className="row sx-tcar__fig"><span className="srx-avatar sx-avatar-sm">JT</span><div className="col"><strong className="sx-fs-body-s">Jon Tran</strong><span className="muted sx-fs-caption">Eng Manager, Vertex</span></div></figcaption></figure>
        <figure className="tcar__card"><blockquote className="sx-lh-body">“Accessible by default saved us weeks of audit work.”</blockquote><figcaption className="row sx-tcar__fig"><span className="srx-avatar sx-avatar-sm">SL</span><div className="col"><strong className="sx-fs-body-s">Sara Lin</strong><span className="muted sx-fs-caption">PM, Lumen</span></div></figcaption></figure>
      </Carousel>
    </SectionShell>
  );
}

export function TestimonialCarousel() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Scroll-snap quotes (drag / swipe)</span><TestimonialCarouselA /></div>
    </div>
  );
}
