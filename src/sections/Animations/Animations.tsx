'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Reveal, RevealGroup, type RevealAnim } from '../../components/utility/Reveal';
import { AnimatedIcon, type IconAnim } from '../../components/utility/AnimatedIcon';
import { TextReveal } from '../../components/utility/TextReveal';
import { MotionCard, type MotionCardTone } from '../../components/surfaces/MotionCard';
import { Icon } from '../../components/foundation/Icon/Icon';
import { Button } from '../../components/controls/Button';

export interface AnimationsProps extends SectionBaseProps {
  /** Section heading. */
  heading?: ReactNode;
}

const REVEAL_ANIMS: RevealAnim[] = [
  'fade-rise', 'rise', 'fade', 'scale', 'zoom', 'blur',
  'slide-left', 'slide-right', 'flip', 'flip-y', 'rotate', 'skew',
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
const CARD_TONES: MotionCardTone[] = ['accent', 'secondary', 'aurora', 'dusk', 'glass', 'mono'];

/** Animations A — scroll-reveal entrances (every variant), with a Replay control. */
export function AnimationsA({ heading = 'Scroll-reveal entrances', background = 'none', children, ...props }: AnimationsProps) {
  // Bumping the key re-mounts the group so the reveals fire again — the "Replay".
  const [playKey, setPlayKey] = useState(0);
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <div className="row sx-row-between sx-anim__head-row">
            <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
            <Button variant="soft" size="sm" icon="play" onClick={() => setPlayKey((k) => k + 1)}>Replay</Button>
          </div>
          <RevealGroup key={playKey} className="sx-g3 sx-gap-5">
            {REVEAL_ANIMS.map((a) => (
              <Reveal key={a} className="rdz-card col sx-gap-2" anim={a}>
                <strong>{a}</strong>
                <span className="muted sx-body-s">Reveals on scroll — hit Replay to watch again.</span>
              </Reveal>
            ))}
          </RevealGroup>
        </>
      )}
    </SectionShell>
  );
}

/** Animations B — title + kinetic text animations. */
export function AnimationsB({ heading = 'Title & text animations', background = 'surface-2', children, ...props }: AnimationsProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
          <TextReveal as="h3" className="h-section" anim="flip" text="Kinetic headlines, word by word" />
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

/** Animations D — brand-colored MotionCard presets (internal + external arrows). */
export function AnimationsD({ heading = 'Preset cards', background = 'surface-2', children, ...props }: AnimationsProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow="Animations" heading={heading} className="col sx-feat__head" />
          <div className="sx-g3 sx-gap-5">
            {CARD_TONES.map((tone, i) => (
              <MotionCard
                key={tone}
                tone={tone}
                index={i}
                href={tone === 'aurora' ? 'https://example.com' : '#'}
                eyebrow={tone}
                title="Preset card"
                icon={tone === 'aurora' ? <GiMoonOrbit /> : <Icon name="star" />}
                iconAnim={tone === 'aurora' ? 'orbit' : 'float'}
              >
                Brand-colored, reveals on scroll, with the clickable arrow.
              </MotionCard>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
