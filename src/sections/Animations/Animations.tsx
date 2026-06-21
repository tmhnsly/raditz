'use client';
import type { ReactNode } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Reveal, RevealGroup, type RevealAnim } from '../../components/utility/Reveal';
import { AnimatedIcon, type IconAnim } from '../../components/utility/AnimatedIcon';
import { Icon } from '../../components/foundation/Icon/Icon';

export interface AnimationsProps extends SectionBaseProps {
  /** Section heading. */
  heading?: ReactNode;
}

const REVEAL_CARDS: { anim: RevealAnim; title: string; body: string }[] = [
  { anim: 'fade-rise', title: 'Fade rise', body: 'Lifts and fades in as it enters the viewport.' },
  { anim: 'scale', title: 'Scale', body: 'A subtle scale-up settles into place.' },
  { anim: 'blur', title: 'Blur', body: 'Sharpens from a soft blur on reveal.' },
  { anim: 'slide-left', title: 'Slide', body: 'Slides in from the side.' },
  { anim: 'fade', title: 'Fade', body: 'A clean opacity fade — the calm option.' },
  { anim: 'rise', title: 'Rise', body: 'Travels up into position.' },
];

const TITLE_MODES = ['fade', 'fade-up', 'blur-in', 'scale'] as const;

const ICON_CARDS: { anim: IconAnim; label: string; glyph: ReactNode }[] = [
  { anim: 'orbit', label: 'orbit', glyph: <GiMoonOrbit /> },
  { anim: 'float', label: 'float', glyph: <Icon name="star" /> },
  { anim: 'pulse', label: 'pulse', glyph: <Icon name="heart" /> },
  { anim: 'spin', label: 'spin', glyph: <Icon name="settings" /> },
  { anim: 'wiggle', label: 'wiggle', glyph: <Icon name="bell" /> },
  { anim: 'draw', label: 'draw', glyph: <Icon name="check" /> },
];

/** Animations A — scroll-reveal entrance cards (a staggered RevealGroup). */
export function AnimationsA({ heading = 'Scroll-reveal entrances', background = 'none', children, ...props }: AnimationsProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
          <RevealGroup className="sx-g3 sx-gap-5">
            {REVEAL_CARDS.map((c, i) => (
              <Reveal key={i} className="rdz-card col sx-gap-2" anim={c.anim}>
                <strong>{c.title}</strong>
                <span className="muted sx-body-s">{c.body}</span>
              </Reveal>
            ))}
          </RevealGroup>
        </>
      )}
    </SectionShell>
  );
}

/** Animations B — the global title-animation set, each row scoped via data-title-anim. */
export function AnimationsB({ heading = 'Title animations', background = 'surface-2', children, ...props }: AnimationsProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
          <div className="col sx-gap-5">
            {TITLE_MODES.map((m) => (
              <div key={m} data-title-anim={m} className="col sx-anim__title-row">
                <span className="eyebrow2">{m}</span>
                <h3 className="h-section">Ship a polished UI</h3>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}

/** Animations C — looping icon animations (AnimatedIcon + react-icons). */
export function AnimationsC({ heading = 'Animated icons', background = 'none', children, ...props }: AnimationsProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
          <div className="sx-g3 sx-gap-5">
            {ICON_CARDS.map((c, i) => (
              <div key={i} className="rdz-card col sx-gap-3 sx-anim__card">
                <AnimatedIcon anim={c.anim} className="sx-anim__icon">{c.glyph}</AnimatedIcon>
                <strong>{c.label}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
