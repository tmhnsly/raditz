import type { ReactNode } from 'react';
import { Frame } from '../../lib/Frame';
import { Button } from '../../components/controls/Button';
import { SectionShell, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

export interface AnnouncementProps extends SectionBaseProps {
  /** Banner body text (required). */
  text: ReactNode;
  /** Optional CTA link/button. */
  action?: SectionAction;
  /** Show a dismiss (×) affordance. */
  dismissible?: boolean;
}

/** Announcement A — accent strip banner. */
export function AnnouncementA({ text, action, dismissible, children }: AnnouncementProps) {
  return (
    <Frame>
      {children ?? (
        <div className="sx-ann__strip">
          <div className="s-wrap row sx-ann__strip-inner">
            {text}
            {action && (
              <a href={action.href} onClick={action.onClick} className="sx-ann__link">{action.label}</a>
            )}
            {dismissible && (
              <button className="sx-ann__dismiss" aria-label="Dismiss">×</button>
            )}
          </div>
        </div>
      )}
    </Frame>
  );
}

/** Announcement B — consent / cookie banner. */
export function AnnouncementB({ text, action, background = 'none', children, ...props }: AnnouncementProps) {
  return (
    <SectionShell pad="sm" wrap="sx-ann__banner" background={background} {...props}>
      {children ?? (
        <>
          <span className="muted sx-ann__banner-text">{text}</span>
          {action && (
            <div className="row">
              <Button
                variant={action.variant ?? 'primary'}
                size={action.size ?? 'sm'}
                href={action.href}
                onClick={action.onClick}
                icon={action.icon}
              >
                {action.label}
              </Button>
            </div>
          )}
        </>
      )}
    </SectionShell>
  );
}
