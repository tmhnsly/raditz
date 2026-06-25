import type { ReactNode } from 'react';
import { SectionShell, SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

export interface HeroProps extends SectionBaseProps {
  /** Headline (required). */
  title: ReactNode;
  /** Small label/badge above the title. */
  eyebrow?: ReactNode;
  /** Lead paragraph under the title. */
  lede?: ReactNode;
  /** Call-to-action buttons. */
  actions?: SectionAction[];
  /** Media slot (used by the split/full-bleed variants). */
  media?: ReactNode;
}

/** Hero A — centered column, dual CTA. Heroes are above the fold, so they default to the
 *  `'load'` entrance — a pure-CSS mount animation that plays at first paint (no observer,
 *  no blank flash). Pass `animate="scroll"` to reveal on scroll instead, or `false` for
 *  static. */
export function HeroA({ title, eyebrow, lede, actions, background = 'none', animate = 'load', children, ...props }: HeroProps) {
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} animate={animate} {...props}>
      {children ?? (
        <>
          {eyebrow && <span className="rdz-badge rdz-badge--soft">{eyebrow}</span>}
          <h2 className="h-display sx-hero__title">{title}</h2>
          {lede && <p className="lede sx-hero__lede">{lede}</p>}
          <SectionActions actions={actions} size="lg" />
        </>
      )}
    </SectionShell>
  );
}

/** Hero B — split: copy beside a media slot. */
export function HeroB({ title, eyebrow, lede, actions, media, background = 'surface-2', animate = 'load', children, ...props }: HeroProps) {
  return (
    <SectionShell wrap="sx-split sx-feat__spotlight" background={background} animate={animate} {...props}>
      {children ?? (
        <>
          <div className="col sx-gap-4">
            {eyebrow && <span className="eyebrow2">{eyebrow}</span>}
            <h2 className="h-display">{title}</h2>
            {lede && <p className="lede">{lede}</p>}
            <SectionActions actions={actions} size="lg" className="row" />
          </div>
          {media}
        </>
      )}
    </SectionShell>
  );
}

/** Hero C — accent full-bleed band. */
export function HeroC({ title, lede, actions, background = 'gradient-aurora', parallax = true, animate = 'load', children, ...props }: HeroProps) {
  return (
    <SectionShell padClassName="sx-hero__band" wrap="col sx-center sx-gap-5" background={background} parallax={parallax} animate={animate} {...props}>
      {children ?? (
        <>
          <h2 className="h-display sx-hero__band-title">{title}</h2>
          {lede && <p className="sx-hero__band-lede">{lede}</p>}
          <SectionActions actions={actions} size="lg" />
        </>
      )}
    </SectionShell>
  );
}
