import type { ReactNode } from 'react';
import { Button } from '../../components/controls/Button';
import { SectionShell, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

export interface NewsletterProps extends SectionBaseProps {
  /** Submit button (required). */
  action: SectionAction;
  /** Card heading. */
  title?: ReactNode;
  /** Card sub-text. */
  sub?: ReactNode;
  /** Input placeholder text. */
  placeholder?: string;
}

/** Newsletter A — email signup card. */
export function NewsletterA({ action, title, sub, placeholder, background = 'gradient-aurora', children, ...props }: NewsletterProps) {
  return (
    <SectionShell wrap="sx-news__wrap" background={background} {...props}>
      {children ?? (
        <div className="rdz-card col sx-news__card">
          <span className="feat-ico">
            <svg className="ico" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <div className="col sx-news__copy">
            {title && <strong className="sx-news__title">{title}</strong>}
            {sub && <span className="muted sx-fs-body-s">{sub}</span>}
          </div>
          <div className="row sx-news__form">
            <div className="rdz-input sx-news__input">{placeholder ?? ''}</div>
            <Button
              variant={action.variant}
              size={action.size}
              href={action.href}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
