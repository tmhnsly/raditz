import { Frame } from '../../lib/Frame';
import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function AnnouncementA() {
  return (
    <Frame>
      <div className="sx-ann__strip"><div className="s-wrap row sx-ann__strip-inner"><strong>SuperRadix 2.0 is here</strong><span className="sx-ann__dim">— 64 components, theme builder, templates.</span><a href="#" className="sx-ann__link">Read more →</a></div></div>
    </Frame>
  );
}

export function AnnouncementB({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell pad="sm" wrap="sx-ann__banner" background={background} {...props}>
      <span className="muted sx-ann__banner-text">We use cookies to improve your experience. By using SuperRadix you agree to our <a href="#" className="sx-ann__banner-link">cookie policy</a>.</span>
      <div className="row"><button className="srx-btn srx-btn--ghost srx-btn--sm">Decline</button><button className="srx-btn srx-btn--primary srx-btn--sm">Accept all</button></div>
    </SectionShell>
  );
}
