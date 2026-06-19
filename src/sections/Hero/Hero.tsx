import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function HeroA({ background = 'none', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} parallax={parallax} image={image} video={video}>
      <span className="srx-badge srx-badge--soft">New · v2 components</span>
      <h2 className="h-display sx-hero__title">
        The design foundation that re-skins in one line
      </h2>
      <p className="lede sx-hero__lede">
        Radix Colors and a token system wired into 53 components. Change one accent and the whole product follows.
      </p>
      <div className="row sx-row-center">
        <button className="srx-btn srx-btn--primary srx-btn--lg sx-hero__pill">
          Get started
        </button>
        <button className="srx-btn srx-btn--outline srx-btn--lg">Read the docs</button>
      </div>
    </SectionShell>
  );
}

export function HeroB({ background = 'surface-2', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-split sx-feat__spotlight" background={background} parallax={parallax} image={image} video={video}>
      <div className="col sx-gap-4">
        <span className="eyebrow2">Design system</span>
        <h2 className="h-display">Ship a polished UI on day one</h2>
        <p className="lede">
          Accessible components, semantic tokens, dark mode and motion — all consistent, all themeable.
        </p>
        <div className="row">
          <button className="srx-btn srx-btn--primary srx-btn--lg">Start building</button>
          <button className="srx-btn srx-btn--ghost srx-btn--lg">Live demo →</button>
        </div>
      </div>
      <div className="ph sx-hero__media">product shot</div>
    </SectionShell>
  );
}

export function HeroC({ background = 'gradient-aurora', parallax = true, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell padClassName="sx-hero__band" wrap="col sx-center sx-gap-5" background={background} parallax={parallax} image={image} video={video}>
      <h2 className="h-display sx-hero__band-title">
        One accent token. Infinite themes.
      </h2>
      <p className="sx-hero__band-lede">
        Cyan, iris, jade — flip a variable and every surface, state and shadow recolors in place.
      </p>
      <div className="row sx-row-center">
        <button className="srx-btn srx-btn--lg sx-hero__band-btn">
          Try the switcher
        </button>
      </div>
    </SectionShell>
  );
}

export function Hero() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Centered, dual CTA</span><HeroA /></div>
      <div className="variant"><span className="variant__tag">B · Split — copy + media</span><HeroB /></div>
      <div className="variant"><span className="variant__tag">C · Accent full-bleed</span><HeroC /></div>
    </div>
  );
}
