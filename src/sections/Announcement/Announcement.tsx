import { Frame } from '../../lib/Frame';

export function AnnouncementA() {
  return (
    <Frame>
      <div className="sx-ann__strip"><div className="s-wrap row sx-ann__strip-inner"><strong>SuperRadix 2.0 is here</strong><span className="sx-ann__dim">— 64 components, theme builder, templates.</span><a href="#" className="sx-ann__link">Read more →</a></div></div>
    </Frame>
  );
}

export function AnnouncementB() {
  return (
    <Frame>
      <div className="s-pad-sm"><div className="s-wrap sx-ann__banner">
        <span className="muted sx-ann__banner-text">We use cookies to improve your experience. By using SuperRadix you agree to our <a href="#" className="sx-ann__banner-link">cookie policy</a>.</span>
        <div className="row"><button className="srx-btn srx-btn--ghost srx-btn--sm">Decline</button><button className="srx-btn srx-btn--primary srx-btn--sm">Accept all</button></div>
      </div></div>
    </Frame>
  );
}

export function Announcement() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Accent strip + CTA</span><AnnouncementA /></div>
      <div className="variant"><span className="variant__tag">B · Cookie / consent banner</span><AnnouncementB /></div>
    </div>
  );
}
