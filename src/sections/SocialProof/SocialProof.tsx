import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';
import { Marquee } from '../../components/media/Marquee';

export interface SocialProofProps extends SectionBaseProps {
  /** Logos/brand names to display (required). */
  logos: { name: ReactNode; src?: string; node?: ReactNode }[];
  /** Caption label (e.g. "Trusted by teams at"). */
  label?: ReactNode;
}

/** Private: renders one logo entry — node, img, or text — with the given class. */
function LogoMark({
  logo,
  className,
}: {
  logo: { name: ReactNode; src?: string; node?: ReactNode };
  className: string;
}) {
  if (logo.node) {
    return <span className={className}>{logo.node}</span>;
  }
  if (logo.src) {
    return <img src={logo.src} alt={typeof logo.name === 'string' ? logo.name : undefined} className={className} />;
  }
  return <strong className={className}>{logo.name}</strong>;
}

/** SocialProof A — scrolling marquee of logos. */
export function SocialProofA({ logos, label, background = 'none', children, ...props }: SocialProofProps) {
  return (
    <SectionShell pad="sm" padClassName="sx-sp__band" background={background} {...props}>
      {children ?? (
        <>
          {label && <div className="muted sx-fs-body-s">{label}</div>}
          <Marquee className="sx-sp__marquee" duration={30}>
            {logos.map((logo, i) => (
              <LogoMark key={i} logo={logo} className="sx-sp__logo" />
            ))}
          </Marquee>
        </>
      )}
    </SectionShell>
  );
}

/** SocialProof B — label + static logo row. */
export function SocialProofB({ logos, label, background = 'none', children, ...props }: SocialProofProps) {
  return (
    <SectionShell pad="sm" padClassName="sx-sp__band" wrap="col sx-items-center sx-gap-4" background={background} {...props}>
      {children ?? (
        <>
          {label && <span className="muted sx-fs-body-s">{label}</span>}
          <div className="row sx-sp__row-b">
            {logos.map((logo, i) => (
              <LogoMark key={i} logo={logo} className="sx-sp__logo-b" />
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
