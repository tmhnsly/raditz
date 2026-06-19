import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function FeaturesA({ background = 'none', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} parallax={parallax} image={image} video={video}>
      <div className="col sx-feat__head">
        <span className="eyebrow2">Why SuperRadix</span>
        <h3 className="h-section">Everything wired together</h3>
      </div>
      <div className="sx-g3 sx-gap-5">
        <div className="srx-card col sx-gap-3">
          <span className="feat-ico">
            <svg className="ico" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
            </svg>
          </span>
          <strong>12-step color</strong>
          <span className="muted sx-body-s">
            Radix scales aliased to semantic tokens, light &amp; dark.
          </span>
        </div>
        <div className="srx-card col sx-gap-3">
          <span className="feat-ico">
            <svg className="ico" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <strong>53 components</strong>
          <span className="muted sx-body-s">
            The full Radix primitive surface, styled and accessible.
          </span>
        </div>
        <div className="srx-card col sx-gap-3">
          <span className="feat-ico">
            <svg className="ico" viewBox="0 0 24 24">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
            </svg>
          </span>
          <strong>Re-skin instantly</strong>
          <span className="muted sx-body-s">
            One accent variable retones the entire product.
          </span>
        </div>
      </div>
    </SectionShell>
  );
}

export function FeaturesB({ background = 'gradient-mesh', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="sx-bento sx-feat__bento" background={background} parallax={parallax} image={image} video={video}>
      <div className="srx-card col sx-feat__bento-lead">
        <span className="feat-ico">
          <svg className="ico" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
          </svg>
        </span>
        <strong className="sx-feat__bento-title">Token-driven theming</strong>
        <span className="muted sx-fs-body-s">
          Colors, type, spacing, radius, motion — all variables.
        </span>
      </div>
      <div className="srx-card col sx-feat__bento-cell">
        <strong>Dark mode</strong>
        <span className="muted sx-fs-caption">class="dark"</span>
      </div>
      <div className="srx-card col sx-feat__bento-cell">
        <strong>A11y</strong>
        <span className="muted sx-fs-caption">Keyboard + ARIA</span>
      </div>
      <div className="srx-card col sx-feat__bento-wide">
        <strong>Eight radius rules</strong>
        <span className="muted sx-fs-body-s">
          Concentric corners, size-proportional, formal↔friendly.
        </span>
      </div>
    </SectionShell>
  );
}

export function FeaturesC({ background = 'surface-2', parallax, image, video }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-gap-7" background={background} parallax={parallax} image={image} video={video}>
      <div className="sx-split sx-feat__spotlight">
        <div className="col sx-gap-3">
          <span className="eyebrow2">Composable</span>
          <h3 className="h-section">Build pages from sections</h3>
          <p className="muted sx-lh-body">
            Drop in heroes, pricing, testimonials and footers — all sharing one type scale and palette.
          </p>
        </div>
        <div className="ph sx-feat__media">A</div>
      </div>
      <div className="sx-split sx-feat__spotlight">
        <div className="ph ph--neutral sx-feat__media">B</div>
        <div className="col sx-gap-3">
          <span className="eyebrow2">Consistent</span>
          <h3 className="h-section">Themed end to end</h3>
          <p className="muted sx-lh-body">
            Every section reads from the same tokens, so a re-skin is global and instant.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

export function Features() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · 3-up icon cards</span><FeaturesA /></div>
      <div className="variant"><span className="variant__tag">B · Bento grid</span><FeaturesB /></div>
      <div className="variant"><span className="variant__tag">C · Alternating spotlight</span><FeaturesC /></div>
    </div>
  );
}
