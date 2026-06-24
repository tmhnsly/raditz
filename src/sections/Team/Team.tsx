import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';

export interface TeamProps extends SectionBaseProps {
  /** Team members to render (required). */
  members: { name: ReactNode; role?: ReactNode; avatar?: ReactNode; bio?: ReactNode }[];
  /** Section heading. */
  heading?: ReactNode;
}

/** Team A — 4-up member grid. */
export function TeamA({ members, heading, background = 'none', children, ...props }: TeamProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <SectionHeader heading={heading} className="col sx-team__head" />
          <div className="sx-g4 sx-gap-5">
            {members.map((m, i) => (
              <div key={i} className="col sx-team__member">
                {m.avatar ? (
                  <div className="ph sx-team__photo sx-media-reveal">{m.avatar}</div>
                ) : null}
                <div className="col">
                  <strong>{m.name}</strong>
                  {m.role && <span className="muted sx-fs-body-s">{m.role}</span>}
                  {m.bio && <span className="muted sx-fs-body-s">{m.bio}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
